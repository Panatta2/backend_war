const mongoose = require("mongoose");
const Personaje = require("../models/personaje");
const Objeto = require("../models/objeto");

const Usuario = require("../models/user");

exports.crearPersonaje = async (req, res) => {
  try {
    const { nombre, puntosVida, usuarioId } = req.body;

    // Verificar que se hayan enviado todos los parámetros necesarios
    if (!nombre || puntosVida === undefined || !usuarioId) {
      return res
        .status(400)
        .json({ message: "Faltan datos para crear el personaje." });
    }

    // Verificar el formato del usuarioId
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res
        .status(400)
        .json({ message: "El ID del usuario es inválido." });
    }

    // Verificar si el usuario existe
    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    // Si todo está bien, proceder a crear el personaje
    const nuevoPersonaje = new Personaje({
      nombre,
      puntosVida,
      usuario: usuarioId,
    });

    await nuevoPersonaje.save();
    res.status(201).json(nuevoPersonaje);
  } catch (error) {
    // Enviar una respuesta de error más genérica
    res
      .status(500)
      .json({ message: "Error al crear el personaje", error: error.message });
  }
};

exports.obtenerPersonaje = async (req, res) => {
  try {
    const personaje = await Personaje.findById(req.params.id);
    if (!personaje) {
      return res.status(404).json({ mensaje: "Personaje no encontrado" });
    }
    res.status(200).json(personaje);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el personaje", error: error });
  }
};

exports.actualizarPersonaje = async (req, res) => {
  try {
    console.log("Cuerpo de la solicitud recibido:", req.body); // Muestra todo el cuerpo de la solicitud
    let { personajeId, objetos } = req.body; // Extraer personajeId y objetos del cuerpo

    // Parsear personajeId si es necesario
    if (typeof personajeId === "string" && personajeId.includes(",")) {
      [personajeId] = personajeId.split(",").map((id) => id.trim());
    }

    // Verificar el ID del personaje
    if (!personajeId || !mongoose.Types.ObjectId.isValid(personajeId)) {
      console.log(
        "Error: ID de personaje inválido o no proporcionado",
        personajeId
      );
      return res
        .status(400)
        .json({ mensaje: "ID de personaje inválido o no proporcionado." });
    }

    // Parsear 'objetos' si es un string
    if (typeof objetos === "string") {
      objetos = objetos.replace(/[\[\]']+/g, ""); // Eliminar corchetes y comillas simples si existen
      objetos = objetos.split(",").map((id) => id.trim()); // Dividir en comas y limpiar espacios
    }

    console.log("IDs de objetos después de parsear:", objetos);

    if (!objetos || !Array.isArray(objetos) || objetos.length === 0) {
      console.log(
        "Error: IDs de objetos no proporcionados o el formato no es correcto",
        objetos
      );
      return res.status(400).json({
        mensaje:
          "IDs de objetos no proporcionados o el formato no es correcto.",
      });
    }
    if (
      !objetos.every((objetoId) => mongoose.Types.ObjectId.isValid(objetoId))
    ) {
      console.log("Error: Algunos IDs de objetos son inválidos", objetos);
      return res
        .status(400)
        .json({ mensaje: "Algunos IDs de objetos son inválidos." });
    }

    const objetosEncontrados = await Objeto.find({ _id: { $in: objetos } });
    console.log("Objetos encontrados:", objetosEncontrados);

    if (!objetosEncontrados.length) {
      console.log(
        "Error: No se encontraron objetos con los IDs proporcionados",
        objetos
      );
      return res.status(404).json({ mensaje: "Objetos no encontrados." });
    }

    const totalPuntosAtaque = objetosEncontrados.reduce(
      (acc, obj) => acc + obj.puntosAtaque,
      0
    );
    const totalPuntosDefensa = objetosEncontrados.reduce(
      (acc, obj) => acc + obj.puntosDefensa,
      0
    );
    console.log("Total puntos de ataque:", totalPuntosAtaque);
    console.log("Total puntos de defensa:", totalPuntosDefensa);

    const personajeActualizado = await Personaje.findByIdAndUpdate(
      personajeId,
      {
        $set: { objetos },
        $inc: {
          puntosAtaque: totalPuntosAtaque,
          puntosDefensa: totalPuntosDefensa,
        },
      },
      { new: true }
    );

    if (!personajeActualizado) {
      console.log("Error: Personaje no encontrado con ID", personajeId);
      return res.status(404).json({ mensaje: "Personaje no encontrado" });
    }

    console.log("Personaje actualizado con éxito:", personajeActualizado);
    res.status(200).json(personajeActualizado);
  } catch (error) {
    console.error("Excepción capturada al actualizar personaje:", error);
    res.status(500).json({ mensaje: error.message });
  }
};

// Eliminar un personaje por ID
exports.eliminarPersonaje = async (req, res) => {
  try {
    const personajeEliminado = await Personaje.findByIdAndDelete(req.params.id);
    if (!personajeEliminado)
      res.status(404).json({ mensaje: "Personaje no encontrado" });
    res.status(200).json({ mensaje: "Personaje eliminado" });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

// Listar todos los personajes

exports.listarPersonajes = async (req, res) => {
  try {
    console.log("entra");
    const { usuarioId } = req.params; // Obtiene el usuarioId de los parámetros de la ruta

    console.log(usuarioId);
    console.log("entra");
    if (!usuarioId) {
      return res
        .status(400)
        .json({ mensaje: "Se requiere el ID del usuario." });
    }

    // Verificar el formato del usuarioId
    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res
        .status(400)
        .json({ mensaje: "El ID del usuario es inválido." });
    }

    // Buscar los personajes que correspondan al usuarioId proporcionado
    const personajes = await Personaje.find({ usuario: usuarioId });

    res.status(200).json({ personajes: personajes });
  } catch (error) {
    // En caso de un error en la consulta, devolver un mensaje de error
    res.status(500).json({
      mensaje: "Error al listar los personajes",
      error: error.message,
    });
  }
};
