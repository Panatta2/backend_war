const mongoose = require("mongoose");

const monstruoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  vidaMaxima: {
    type: Number,
    required: true,
  },
  poderAtaque: {
    type: Number,
    required: true,
  },
  poderDefensa: {
    type: Number,
    required: true,
  },
  dificultad: {
    type: String,
    required: true,
  },
});

const Monstruo = mongoose.model("Monstruo", monstruoSchema);
module.exports = Monstruo;
