const mongoose = require("mongoose");

const UsuarioSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  vidas: {
    type: Number,
    default: 3, // Un valor por defecto, ajusta según tu lógica de juego
  },
  puntaje: {
    type: Number,
    default: 0, // Puntaje inicial del usuario
  },
});

module.exports = mongoose.model("usuarios", UsuarioSchema);
