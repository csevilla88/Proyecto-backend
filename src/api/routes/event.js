const express = require("express");
const { createEvent, getEvents, getEventById, updateEvent, deleteEvent, } = require("../controllers/event");
const { isAuth, isAdmin } = require("../../middlewares/auth");

const eventsRouter = express.Router();

// Rutas públicas
eventsRouter.get("/", getEvents);
eventsRouter.get("/:id", getEventById);

// Rutas protegidas (solo admin)
eventsRouter.post("/", isAuth, isAdmin, createEvent);
eventsRouter.put("/:id", isAuth, isAdmin, updateEvent);
eventsRouter.delete("/:id", isAuth, isAdmin, deleteEvent);

module.exports = eventsRouter;
