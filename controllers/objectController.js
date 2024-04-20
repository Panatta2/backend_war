const Objeto = require("../models/objeto"); // Asegúrate de que la ruta sea correcta
const Usuario = require("../models/user"); // Asegúrate de que la ruta sea correcta
const mongoose = require("mongoose");
const Poder = require("../models/poderes"); // Ajusta la ruta según donde tengas ubicado el archivo

exports.crearObjeto = async (req, res) => {
  try {
    const { nombre, tipo, poder, puntosAtaque, puntosDefensa, usuarioId } =
      req.body;
    console.log(req.body);
    if (!nombre || !tipo || !poder || !usuarioId) {
      return res
        .status(400)
        .json({ message: "Faltan datos para crear el objeto." });
    }

    if (
      !mongoose.Types.ObjectId.isValid(usuarioId) ||
      !mongoose.Types.ObjectId.isValid(poder)
    ) {
      return res
        .status(400)
        .json({ message: "El ID del usuario o del poder es inválido." });
    }

    const usuario = await Usuario.findById(usuarioId);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const poderExistente = await Poder.findById(poder);
    if (!poderExistente) {
      return res.status(404).json({ message: "Poder no encontrado." });
    }

    const nuevoObjeto = new Objeto({
      nombre,
      tipo,
      poder: poder,
      puntosAtaque,
      puntosDefensa,
      usuario: usuarioId,
    });

    await nuevoObjeto.save();
    res.status(201).json(nuevoObjeto);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: "Error al crear el objeto", error: error.message });
  }
};

exports.obtenerObjeto = async (req, res) => {
  try {
    const objeto = await Objeto.findById(req.params.id).populate("usuario");
    if (!objeto) {
      return res.status(404).json({ mensaje: "Objeto no encontrado" });
    }
    res.status(200).json(objeto);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al obtener el objeto", error: error });
  }
};

exports.actualizarObjeto = async (req, res) => {
  try {
    console.log("Llega");
    let { ids, ...updateData } = req.body;

    console.log("Cuerpo completo de la solicitud recibida:", req.body);
    console.log("Datos para actualizar:", updateData);

    // Verificar y ajustar el formato de 'ids' si es necesario
    if (typeof ids === "string") {
      // Eliminar corchetes y dividir por comas si ids está en un formato de array como string
      ids = ids
        .replace(/[\[\]']+/g, "")
        .split(",")
        .map((id) => id.trim());
    }

    console.log("IDs recibidos después del parseo:", ids);

    if (!Array.isArray(ids) || ids.length === 0) {
      console.log("Error: IDs no proporcionados o el formato no es correcto.");
      return res.status(400).json({
        mensaje: "IDs no proporcionados o el formato no es correcto.",
      });
    }

    if (!ids.every((id) => mongoose.Types.ObjectId.isValid(id))) {
      console.log("Error: Algunos IDs son inválidos.");
      return res.status(400).json({ mensaje: "Algunos IDs son inválidos." });
    }

    const resultado = await Objeto.updateMany(
      { _id: { $in: ids } },
      updateData
    );

    console.log("Resultado de la actualización:", resultado);

    if (resultado.matchedCount === 0) {
      console.log(
        "Error: No se encontraron objetos con los IDs proporcionados."
      );
      return res.status(404).json({
        mensaje: "Objetos no encontrados con los IDs proporcionados.",
      });
    }

    res
      .status(200)
      .json({ mensaje: "Objetos actualizados exitosamente.", resultado });
  } catch (error) {
    console.error("Error en actualizarObjeto:", error);
    res.status(500).json({ mensaje: error.message });
  }
};

exports.eliminarObjeto = async (req, res) => {
  try {
    const objetoEliminado = await Objeto.findByIdAndDelete(req.params.id);
    if (!objetoEliminado)
      res.status(404).json({ mensaje: "Objeto no encontrado" });
    res.status(200).json({ mensaje: "Objeto eliminado" });
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

exports.listarObjetos = async (req, res) => {
  try {
    const { usuarioId } = req.params; // Obtiene el usuarioId de los parámetros de la consulta

    console.log("aqui");
    console.log(usuarioId);
    if (!usuarioId) {
      return res
        .status(400)
        .json({ mensaje: "Se requiere el ID del usuario." });
    }

    if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
      return res
        .status(400)
        .json({ mensaje: "El ID del usuario es inválido." });
    }

    const objetos = await Objeto.find({ usuario: usuarioId });
    res.status(200).json(objetos);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al listar los objetos", error: error.message });
  }
};

exports.listarObjetosActivos = async (req, res) => {
  const usuarioId = req.params.usuarioId;
  if (!usuarioId) {
    return res.status(400).json({ mensaje: "Se requiere el ID del usuario." });
  }

  if (!mongoose.Types.ObjectId.isValid(usuarioId)) {
    return res.status(400).json({ mensaje: "El ID del usuario es inválido." });
  }

  try {
    console.log(usuarioId);
    const objetosActivos = await Objeto.find({
      usuario: usuarioId,
      activo: true,
    });
    if (objetosActivos.length === 0) {
      return res.status(404).json({
        mensaje: "No se encontraron objetos activos para este usuario.",
      });
    }
    console.log(objetosActivos);
    // Puedes decidir devolver solo los IDs o información específica, dependiendo de tus necesidades
    res.status(200).json({ objetos: objetosActivos });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      mensaje: "Error al listar los objetos activos",
      error: error.message,
    });
  }
};
