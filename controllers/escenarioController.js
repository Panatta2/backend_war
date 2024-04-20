// controllers/escenarioController.js
const Escenario = require("../models/Escenario");
const Monstruo = require("../models/monsters");
exports.crearEscenario = async (req, res) => {
  try {
    const { nombre, descripcion, dificultad, usuario } = req.body;
    console.log("Recibido:", nombre, descripcion, dificultad, usuario);

    if (!usuario) {
      console.log("Error: No se proporcionó ID de usuario");
      return res.status(400).json({
        mensaje: "El ID del usuario es necesario para crear un escenario",
      });
    }

    // Buscar monstruos por dificulta
    console.log("Buscando monstruos con dificultad:", dificultad);
    const monstruosPorDificultad = await Monstruo.find({
      dificultad: dificultad,
    });
    console.log("Monstruos encontrados:", monstruosPorDificultad.length);

    if (!monstruosPorDificultad.length) {
      console.log("Error: No hay monstruos para la dificultad seleccionada");
      return res.status(400).json({
        mensaje: "No hay monstruos disponibles para la dificultad seleccionada",
      });
    }
    const seleccionados = [];
    const cantidad = Math.floor(Math.random() * 3) + 2; // Cambiado para seleccionar entre 2 y 4 monstruos
    console.log("Seleccionando", cantidad, "monstruos");

    for (let i = 0; i < cantidad; i++) {
      const indiceAleatorio = Math.floor(
        Math.random() * monstruosPorDificultad.length
      );
      seleccionados.push(monstruosPorDificultad[indiceAleatorio]._id);
    }
    console.log("Monstruos seleccionados:", seleccionados);

    const nuevoEscenario = new Escenario({
      nombre,
      descripcion,
      dificultad,
      usuario,
      monstruos: seleccionados,
    });

    await nuevoEscenario.save();
    console.log("Escenario creado con éxito:", nuevoEscenario);
    res.status(201).json(nuevoEscenario);
  } catch (error) {
    console.error("Error en la creación del escenario:", error);
    res.status(500).json({ mensaje: "Error al crear el escenario", error });
  }
};

exports.listarEscenarios = async (req, res) => {
  try {
    // Suponemos que el ID del usuario se recibe a través de un parámetro en la URL.
    const usuarioId = req.params.usuarioId;

    if (!usuarioId) {
      return res.status(400).json({
        mensaje: "El ID del usuario es necesario para listar los escenarios",
      });
    }

    const escenarios = await Escenario.find({ usuario: usuarioId }).populate(
      "monstruos"
    ); // Esto ahora trae toda la información de cada monstruo

    res.status(200).json(escenarios);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al listar los escenarios", error });
  }
};

exports.actualizarEscenario = async (req, res) => {
  try {
    const { id } = req.params;
    const escenarioActualizado = await Escenario.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!escenarioActualizado) {
      return res.status(404).json({ mensaje: "Escenario no encontrado" });
    }
    res.status(200).json(escenarioActualizado);
  } catch (error) {
    res
      .status(500)
      .json({ mensaje: "Error al actualizar el escenario", error });
  }
};
