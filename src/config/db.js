const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Conexión a la base de datos establecida.");
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);
  }
};

module.exports = { connectDB };
