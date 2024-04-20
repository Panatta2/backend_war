const express = require("express");
const router = express.Router();
const poderesController = require("../controllers/poderesController");

// Ruta para listar todos los poderes
router.get("/poderes", poderesController.listarPoderes);
router.get("/get_poder/:id", poderesController.obtenerPoderPorId);

module.exports = router;
