const Monstruo = require("../models/monsters"); // Asegúrate de que la ruta al modelo es correcta

const monstruosIniciales = [
  {
    nombre: "Goblin",
    vidaMaxima: 100,
    poderAtaque: 15,
    poderDefensa: 5,
    dificultad: "Baja",
  },
  {
    nombre: "Troll",
    vidaMaxima: 200,
    poderAtaque: 30,
    poderDefensa: 15,
    dificultad: "Media",
  },
  {
    nombre: "Dragón",
    vidaMaxima: 500,
    poderAtaque: 50,
    poderDefensa: 25,
    dificultad: "Alta",
  },
];

async function inicializarMonstruos() {
  try {
    const monstruosExistentes = await Monstruo.find();
    if (monstruosExistentes.length === 0) {
      console.log(
        "No se encontraron monstruos, creando monstruos iniciales..."
      );
      await Monstruo.insertMany(monstruosIniciales);
      console.log("Monstruos creados con éxito.");
    } else {
      console.log("Monstruos ya existentes en la base de datos.");
    }
  } catch (error) {
    console.error("Error al inicializar los monstruos:", error);
  }
}

module.exports = inicializarMonstruos;
