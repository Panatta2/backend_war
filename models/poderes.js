const mongoose = require("mongoose");

const poderSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  descripcion: {
    type: String,
    required: true,
  },
});

const poder = mongoose.model("poder", poderSchema);
module.exports = poder;
