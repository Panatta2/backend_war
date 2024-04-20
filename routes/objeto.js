const express = require("express");
const router = express.Router();
const objectController = require("../controllers/objectController");

// Rutas para el CRUD de personajes
router.post("/objetos", objectController.crearObjeto);
router.get("/objetos/:id", objectController.obtenerObjeto);
router.put("/objetos", objectController.actualizarObjeto);
router.delete("/objetos/:id", objectController.eliminarObjeto);
router.get("/lista_objetos/:usuarioId", objectController.listarObjetos);
router.get(
  "/objetos_activos/:usuarioId",
  objectController.listarObjetosActivos
);

module.exports = router;
