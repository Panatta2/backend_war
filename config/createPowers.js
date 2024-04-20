const Poder = require("../models/poderes"); // Asegúrate de que la ruta al modelo es correcta

const poderesIniciales = [
  {
    nombre: "Escudo de Energía",
    descripcion: "Absorbe daño hasta un límite especificado.",
  },
  {
    nombre: "Golpe Crítico",
    descripcion:
      "Aumenta la probabilidad de un golpe crítico que dobla el daño.",
  },
  {
    nombre: "Carga Rápida",
    descripcion:
      "Reduce los tiempos de recarga de habilidades activas temporalmente.",
  },
  {
    nombre: "Reflejo",
    descripcion: "Refleja un porcentaje del daño recibido hacia el atacante.",
  },
  {
    nombre: "Camuflaje",
    descripcion:
      "Hace al personaje indetectable temporalmente a menos que ataque.",
  },
  {
    nombre: "Aturdimiento",
    descripcion:
      "Aturde al enemigo, impidiendo sus acciones durante unos segundos.",
  },
  {
    nombre: "Salto de Batalla",
    descripcion: "Permite desplazamientos rápidos hacia o desde el enemigo.",
  },
  {
    nombre: "Granada de Veneno",
    descripcion: "Causa daño en el tiempo a enemigos en un área tras explotar.",
  },
  {
    nombre: "Impulso de Velocidad",
    descripcion: "Aumenta significativamente la velocidad de movimiento.",
  },
  { nombre: "Curación", descripcion: "Restaura salud de manera instantánea." },
];

async function inicializarPoderes() {
  try {
    const poderesExistentes = await Poder.find();
    if (poderesExistentes.length === 0) {
      console.log("No se encontraron poderes, creando poderes iniciales...");
      await Poder.insertMany(poderesIniciales);
      console.log("Poderes creados con éxito.");
    } else {
      console.log("Poderes ya existentes en la base de datos.");
    }
  } catch (error) {
    console.error("Error al inicializar los poderes:", error);
  }
}

module.exports = inicializarPoderes;
