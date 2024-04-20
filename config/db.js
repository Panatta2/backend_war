const mongoose = require("mongoose");
require("dotenv").config(); // Asegúrate de cargar las variables de entorno al principio

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {});
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Listar todas las colecciones
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();
    console.log(
      "Colecciones:",
      collections.map((coll) => coll.name)
    );
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  }
};

const closeConnection = async () => {
  await mongoose.disconnect();
  console.log("MongoDB Disconnected");
};

module.exports = { connectDB, closeConnection };
