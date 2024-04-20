const poder = require("../models/poderes");

exports.listarPoderes = async (req, res) => {
  try {
    console.log("Listando poderes disponibles");
    const poderes = await poder.find({}); // Lista todos los poderes sin restricciones

    res.status(200).json({ poderes: poderes });
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al listar los poderes",
      error: error.message,
    });
  }
};
exports.obtenerPoderPorId = async (req, res) => {
  const poderId = req.params.id; // Asume que recibes el ID como parámetro en la URL
  try {
    console.log(`Buscando el poder con ID: ${poderId}`);
    const poderEncontrado = await poder.findById(poderId);

    if (!poderEncontrado) {
      return res.status(404).json({ mensaje: "Poder no encontrado" });
    }

    res.status(200).json(poderEncontrado);
  } catch (error) {
    res.status(500).json({
      mensaje: "Error al buscar el poder",
      error: error.message,
    });
  }
};
