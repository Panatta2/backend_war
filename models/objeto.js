const mongoose = require("mongoose");

const ObjetoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  tipo: {
    type: String,
    required: true,
  },
  poder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Poder",
    required: true,
  },
  puntosAtaque: {
    type: Number,
    default: 0,
  },
  puntosDefensa: {
    type: Number,
    default: 0,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true, // Asumiendo que siempre queremos saber qué usuario creó el objeto
  },
  activo: {
    type: Boolean,
    default: true, // Por defecto, los objetos nuevos estarán activos
  },
});

const Objeto = mongoose.model("Objeto", ObjetoSchema);
module.exports = Objeto;
