const express = require("express");
const router = express.Router();
const desafioController = require("../controllers/desafioController");

// Rutas para el CRUD de escenarios
router.post("/desafios", desafioController.crearDesafio);
router.get("/desafios/:desafioId", desafioController.obtenerDesafioDetallado);
router.get(
  "/get_desafios/:desafioId",
  desafioController.obtenerResultadoCombate
);

module.exports = router;
