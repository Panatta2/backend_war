const express = require("express");
const router = express.Router();
const personajeController = require("../controllers/personajeController");

// Rutas para el CRUD de personajes
router.post("/personajes", personajeController.crearPersonaje);
router.get("/personajes/:id", personajeController.obtenerPersonaje);
router.put("/personajes", personajeController.actualizarPersonaje);
router.delete("/personajes/:id", personajeController.eliminarPersonaje);
router.get(
  "/lista_personajes/:usuarioId",
  personajeController.listarPersonajes
);

module.exports = router;
