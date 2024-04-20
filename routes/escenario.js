const express = require("express");
const router = express.Router();
const escenarioController = require("../controllers/escenarioController");

// Rutas para el CRUD de escenarios
router.post("/escenarios", escenarioController.crearEscenario);
router.get("/escenarios/:usuarioId", escenarioController.listarEscenarios);
router.put("/escenarios/:id", escenarioController.actualizarEscenario);
router.put("/escenarios/:id", escenarioController.actualizarEscenario);

module.exports = router;
