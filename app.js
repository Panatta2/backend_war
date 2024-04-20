const express = require("express");
const { connectDB, closeConnection } = require("./config/db");
const morgan = require("morgan");
const personajeRoutes = require("./routes/personaje");
const objetoRoutes = require("./routes/objeto");
const poderesRoutes = require("./routes/poderes");
const escenarioRoutes = require("./routes/escenario");
const userRoutes = require("./routes/auth");
const desafioRoutes = require("./routes/desafio");
const inicializarPoderes = require("./config/createPowers");
const inicializarMonstruos = require("./config/createMonsters");

const app = express();

// Connect to MongoDB
connectDB().then(() => {
  console.log("Connected to MongoDB");
  inicializarPoderes(); // Inicializar los poderes después de conectar a MongoDB
  inicializarMonstruos(); // Inicializar los monstruos después de conectar a MongoDB
});

app.use(express.json());
app.use(morgan("dev")); // 'dev' es un formato predefinido, pero hay otros disponibles

// Aquí puedes definir tus rutas
app.use("/", userRoutes);
app.use("/", personajeRoutes);
app.use("/", objetoRoutes);
app.use("/", poderesRoutes);
app.use("/", escenarioRoutes);
app.use("/", desafioRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Algo salió mal!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// Opcionalmente, puedes manejar el cierre de la aplicación para desconectar la base de datos
process.on("SIGINT", async () => {
  await closeConnection();
  console.log("MongoDB Disconnected");
  process.exit(0);
});
