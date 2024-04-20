const mongoose = require("mongoose");

const DesafioSchema = new mongoose.Schema({
  escenario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Escenario",
    required: true,
  },
  personaje: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "personaje",
    required: true,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  resultado: {
    exito: Boolean,
    vidaFinalPersonaje: Number,
  },
  monstruos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monstruo",
    },
  ],
  fechaCreacion: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Desafio", DesafioSchema);
