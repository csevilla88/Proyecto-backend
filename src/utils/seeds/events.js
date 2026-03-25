const mongoose = require("mongoose");
const Event = require("../../api/models/event");
const events = require("../../api/data/events");

require("dotenv").config();

const lanzarSemilla = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);

    await Event.collection.drop();
    console.log("Colección de eventos eliminada.");

    await Event.insertMany(events);
    console.log("Eventos insertados correctamente.");

    await mongoose.disconnect();
    console.log("Desconectado de la base de datos.");
  } catch (error) {
    console.error("Error al ejecutar la semilla:");
  }
};

lanzarSemilla();
