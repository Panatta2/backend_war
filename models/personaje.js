const mongoose = require("mongoose");

const PersonajeSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true, // Asegura que el nombre sea proporcionado
  },
  nivel: {
    type: Number,
    default: 1, // Valor por defecto para nivel si no se proporciona
  },
  puntosVida: {
    type: Number,
    required: true, // Asegura que los puntos de vida sean proporcionados
  },
  puntosAtaque: {
    type: Number,
    default: 10, // Valor por defecto para puntos de ataque
  },
  puntosDefensa: {
    type: Number,
    default: 10, // Valor por defecto para puntos de defensa
  },
  objetos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Objeto",
    },
  ],
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
});

module.exports = mongoose.model("personaje", PersonajeSchema);
