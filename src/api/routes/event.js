const express = require("express");
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent, } = require("../controllers/event");
const { isAuth, isAdmin } = require("../../middlewares/auth");

const eventsRouter = express.Router();

// Rutas públicas
eventsRouter.get("/", getEvents);
eventsRouter.get("/:id", getEventById);

// Rutas protegidas
eventsRouter.post("/", isAuth, createEvent);
eventsRouter.put("/:id", isAuth, updateEvent);
eventsRouter.delete("/:id", isAuth, deleteEvent);

module.exports = eventsRouter;
