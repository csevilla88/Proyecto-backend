require("dotenv").config({ override: true });
const express = require("express");
const { connectDB } = require("./src/config/db");
const { connectCloudinary } = require("./src/config/cloudinary");

const usersRouter = require("./src/api/routes/user");
const eventsRouter = require("./src/api/routes/event");

const app = express();

// Conectar a la base de datos y a Cloudinary
connectDB();
connectCloudinary();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/events", eventsRouter);

// Middleware para rutas no encontradas
app.use("*path", (req, res) => {
  return res.status(404).json("Ruta no encontrada.");
});

// Middleware global de errores
app.use((err, req, res, next) => {
  console.error(err);

  if (err && err.name === "MulterError") {
    return res.status(400).json({
      message: err.message,
      code: err.code,
      field: err.field,
    });
  }

  return res.status(500).json({
    message: err?.message || "Error interno del servidor.",
  });
});

// Iniciar servidor
app.listen(3003, () => {
  console.log(`Servidor activo en http://localhost:3003`);
});
