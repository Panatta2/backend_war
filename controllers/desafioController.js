const Desafio = require("../models/desafio");
const Escenario = require("../models/Escenario");
const Personaje = require("../models/personaje");
const Monstruo = require("../models/monsters");
const Poder = require("../models/poderes");
const Usuario = require("../models/user");

exports.crearDesafio = async (req, res) => {
  const { escenarioId, personajeId, usuarioId } = req.body;

  try {
    // Verificar existencia de escenario, personaje y usuario
    const escenario = await Escenario.findById(escenarioId);

    const personaje = await Personaje.findById(personajeId);

    const usuario = await Usuario.findById(usuarioId);

    if (!escenario || !personaje || !usuario) {
      console.log("Alguno de los elementos no fue encontrado"); // Indica cuál elemento no fue encontrado
      return res
        .status(404)
        .json({ mensaje: "Escenario, personaje o usuario no encontrado." });
    }

    // Crear el desafío
    const nuevoDesafio = new Desafio({
      escenario: escenarioId,
      personaje: personajeId,
      usuario: usuarioId,
      monstruos: escenario.monstruos,
      resultado: {},
    });

    await nuevoDesafio.save();

    // Respuesta con mensaje y el ID del desafío creado
    res.status(201).json({
      mensaje: "Desafío creado con éxito.",
      idDesafio: nuevoDesafio._id, // Incluir el ID del desafío aquí
      desafio: nuevoDesafio,
    });
  } catch (error) {
    console.error("Error en crearDesafio:", error); // Imprime detalles del error
    res
      .status(500)
      .json({ mensaje: "Error al crear el desafío", error: error.message });
  }
};

exports.obtenerDesafioDetallado = async (req, res) => {
  const { desafioId } = req.params;

  try {
    const desafio = await Desafio.findById(desafioId)
      .populate({
        path: "escenario",
        populate: {
          path: "monstruos",
        },
      })
      .populate("personaje");

    if (!desafio) {
      return res.status(404).json({ mensaje: "Desafío no encontrado." });
    }

    res.status(200).json(desafio);
  } catch (error) {
    console.error("Error al obtener el desafío:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener el desafío", error: error.message });
  }
};

// Simulación del combate
function simularCombate(personaje, monstruos) {
  let personajeVida = personaje.puntosVida;
  let monstruosVida = monstruos.map((monstruo) => monstruo.vidaMaxima);

  console.log("Iniciando simulación de combate...");
  for (let i = 0; i < monstruos.length && personajeVida > 0; i++) {
    while (personajeVida > 0 && monstruosVida[i] > 0) {
      const danoAMonstruo = Math.max(
        personaje.puntosAtaque - monstruos[i].poderDefensa,
        1
      );
      monstruosVida[i] = Math.max(monstruosVida[i] - danoAMonstruo, 0);
      const danoAPersonaje = Math.max(
        monstruos[i].poderAtaque - personaje.puntosDefensa,
        1
      );
      personajeVida = Math.max(personajeVida - danoAPersonaje, 0);
    }
  }
  console.log("Combate finalizado:", { personajeVida, monstruosVida });
  return { victoria: personajeVida > 0, personajeVida, monstruosVida };
}

// Actualización de las vidas tras el combate
async function actualizarVidas(personaje, monstruos, resultadoCombate) {
  console.log("Actualizando vidas después del combate...");
  try {
    const updates = [];

    // Actualizar la vida del personaje
    if (personaje && personaje._id) {
      updates.push(
        Personaje.findByIdAndUpdate(
          personaje._id,
          { puntosVida: resultadoCombate.personajeVida },
          { new: true }
        )
      );
    }

    // Actualizar la vida de los monstruos
    monstruos.forEach((monstruo, index) => {
      if (monstruo._id && resultadoCombate.monstruosVida[index] !== undefined) {
        updates.push(
          Monstruo.findByIdAndUpdate(
            monstruo._id,
            { vidaMaxima: resultadoCombate.monstruosVida[index] },
            { new: true }
          )
        );
      }
    });

    // Espera a que todas las actualizaciones se completen
    const results = await Promise.all(updates);
    console.log("Todas las actualizaciones completadas:", results);
  } catch (error) {
    console.error("Error al actualizar vidas:", error);
    throw error;
  }
}

// Iniciar combate
exports.iniciarCombate = async (req, res) => {
  const { desafioId } = req.params;
  console.log("Desafío ID recibido:", desafioId);

  try {
    const desafio = await Desafio.findById(desafioId)
      .populate({
        path: "escenario",
        populate: { path: "monstruos" },
      })
      .populate("personaje");

    if (!desafio) {
      console.log("Desafío no encontrado para ID:", desafioId);
      return res.status(404).json({ mensaje: "Desafío no encontrado." });
    }

    console.log("Desafío encontrado, simulando combate...");
    const resultadoCombate = simularCombate(
      desafio.personaje,
      desafio.escenario.monstruos
    );
    console.log("Resultado del combate:", resultadoCombate);

    console.log("Actualizando vidas...");
    await actualizarVidas(
      desafio.personaje,
      desafio.escenario.monstruos,
      resultadoCombate
    );
    console.log("Vidas actualizadas.");

    desafio.resultado = resultadoCombate;
    await desafio.save();
    console.log("Desafío guardado con el nuevo resultado.");

    res.status(200).json({
      mensaje: resultadoCombate.victoria
        ? "Desafío superado y actualizado"
        : "Desafío perdido y actualizado",
      resultado: resultadoCombate,
      desafio: desafio,
    });
  } catch (error) {
    console.error("Error al procesar combate:", error);
    res
      .status(500)
      .json({ mensaje: "Error al iniciar combate", error: error.message });
  }
};

// Obtener resultado del combate

exports.obtenerResultadoCombate = async (req, res) => {
  const { desafioId } = req.params;
  console.log("Llegó a obtenerResultadoCombate con el ID:", desafioId);

  try {
    const desafio = await Desafio.findById(desafioId)
      .populate("escenario")
      .populate("personaje")
      .populate({
        path: "escenario",
        populate: { path: "monstruos" },
      });

    if (!desafio) {
      console.log("Desafío no encontrado para el ID:", desafioId);
      return res.status(404).json({ mensaje: "Desafío no encontrado." });
    }

    console.log("Desafío encontrado:", desafio);
    if (!desafio.resultado || typeof desafio.resultado.exito === "undefined") {
      console.log(
        "No hay resultado previo o es incompleto, simulando el combate..."
      );
      const resultadoCombate = simularCombate(
        desafio.personaje,
        desafio.escenario.monstruos
      );
      desafio.resultado = resultadoCombate;
      await desafio.save();
      console.log("Resultado del combate simulado y guardado con éxito.");

      // Verifica si necesitas actualizar vidas aquí también
      await actualizarVidas(
        desafio.personaje,
        desafio.escenario.monstruos,
        resultadoCombate
      );
      console.log(
        "Vidas actualizadas después de simular y guardar el combate."
      );
    }

    res.status(200).json({
      mensaje: "Resultado del combate obtenido con éxito.",
      resultado: desafio.resultado,
      desafio: desafio,
    });
  } catch (error) {
    console.error("Error al obtener el resultado del combate:", error);
    res.status(500).json({
      mensaje: "Error al obtener el resultado del combate",
      error: error.message,
    });
  }
};
