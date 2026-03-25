const Event = require("../models/event");
const User = require("../models/user");

const createEvent = async (req, res, next) => {
  try {
    const newEvent = new Event({...req.body, users: [req.user._id]});

    const savedEvent = await newEvent.save();

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { events: savedEvent._id } }, { new: true });

    return res.status(201).json("Evento creado correctamente.");
  } catch (error) {
    return res.status(400).json("Error al crear evento.");
  }
};

const getEvents = async (req, res, next) => {
  try {
    const events = await Event.find();
    return res.status(200).json(events);
  } catch (error) {
    return res.status(500).json("Error al obtener eventos.");
  }
};

const getEventById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json("Evento no encontrado.");
    }
    return res.status(200).json(event);
  } catch (error) {
    return res.status(500).json("Error al obtener evento.");
  }
};

const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    const updateFields = {};
    if (req.body.title) updateFields.title = req.body.title;
    if (req.body.description) updateFields.description = req.body.description;
    if (req.body.date) updateFields.date = req.body.date;
    if (req.body.location) updateFields.location = req.body.location;

    const updatedEvent = await Event.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    if (!updatedEvent) {
      return res.status(404).json("Evento no encontrado.");
    }
    return res.status(200).json("Evento actualizado correctamente.");
  } catch (error) {
    return res.status(400).json("Error al actualizar evento.");
  }
};

const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json("Evento no encontrado.");
    }

    // Eliminar referencia del evento en todos los usuarios que lo tenían asociado
    await User.updateMany({ events: id }, { $pull: { events: id } });

    return res.status(200).json("Evento eliminado correctamente.");
  } catch (error) {
    return res.status(500).json("Error al eliminar evento.");
  }
};

module.exports = { createEvent, getEvents, getEventById, updateEvent, deleteEvent};
