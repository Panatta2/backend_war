const mongoose = require("mongoose");

const EscenarioSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  dificultad: String,
  recompensa: String,
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario", // Asume que tienes un modelo de Usuario definido
    required: true,
  },
  completado: {
    type: Boolean,
    default: false,
  },
  monstruos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monstruo",
    },
  ],
});

module.exports = mongoose.model("Escenario", EscenarioSchema);
