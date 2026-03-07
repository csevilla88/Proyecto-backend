const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/user");
const Event = require("../models/event");
const { generateToken } = require("../../utils/jwt");
const { deleteFile } = require("../../config/cloudinary");

const register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Ya existe un usuario con ese email." });
    }

    const newUser = new User(req.body);
    if (req.files && req.files.length > 0) {
      newUser.image = req.files[0].path;
    } else if (req.file) {
      newUser.image = req.file.path;
    }

    const userSaved = await newUser.save();

    return res.status(201).json({
      message: "Usuario registrado correctamente.",
      user: {
        _id: userSaved._id,
        userName: userSaved.userName,
        email: userSaved.email,
        role: userSaved.role,
        image: userSaved.image,
      }
    });
  } catch (error) {
    return res.status(400).json("Error al registrar usuario.");
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json("No se ha podido iniciar sesión. Usuario no encontrado.");
    }

    if (bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user._id);
      return res.status(200).json({token, user});
    } else {  
      return res.status(400).json("Contraseña incorrecta.");
    }
  } catch (error) {
    return res.status(500).json("No se ha podido iniciar sesión");
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("events");
    return res.status(200).json(users);
  } catch (error) {
    return res.status(500).json( "Error al obtener usuarios.");
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("events");
    if (!user) {
      return res.status(404).json("Usuario no encontrado." );
    }
    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json("Error al obtener usuario.");
  }
};

//  ACTUALIZAR PERFIL (PROPIO) 
const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json("No puedes modificar el perfil de otro usuario.");
    }

    const newUser = new User(req.body);
    newUser._id = id;

    if (req.file) {
      const oldUser = await User.findById(id);
      if (oldUser.image) {
        await deleteFile(oldUser.image);
      }
      newUser.image = req.file.path;
    }

  if (req.body.role && req.user.role !== "admin") {
    return res.status(403).json("No puedes cambiar el rol de un usuario. Solo los admin pueden hacerlo.");
  }

    const updatedUser = await User.findByIdAndUpdate(id, newUser, { new: true}).populate("events");

    return res.status(200).json( updatedUser);
  } catch (error) {
    return res.status(400).json("Error al actualizar usuario.");
  }
};

//  CAMBIAR ROL (SOLO ADMIN) 
const changeRole = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json("Acceso denegado. Se requiere rol de admin.");
    }

    if (!["user", "admin"].includes(role)) {
      return res.status(400).json("Rol no válido. Debe ser 'user' o 'admin'." );
    }

    const userToUpdate = await User.findById(id);
    if (!userToUpdate) {
      return res.status(404).json( "Usuario no encontrado." );
    }

    userToUpdate.role = role;
    await userToUpdate.save();

    return res.status(200).json(`Rol del usuario actualizado a '${role}' correctamente.`);
  } catch (error) {
    return res.status(500).json("Error al cambiar el rol.");
  }
};

//  ELIMINAR USUARIO 
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json("No puedes eliminar la cuenta de otro usuario. Solo puedes eliminar tu propia cuenta.");
    }

    const userToDelete = await User.findById(id);
    if (!userToDelete) {
      return res.status(404).json("Usuario no encontrado." );
    }

    if (userToDelete.image) {
      await deleteFile(userToDelete.image);
    }

    await User.findByIdAndDelete(id);

    return res.status(200).json("Usuario eliminado correctamente.");
  } catch (error) {
    return res.status(500).json("Error al eliminar usuario.");
  }
};

//AÑADIR EVENTOS AL USUARIO
const addEventsToUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { events } = req.body;

    if (req.user._id.toString() !== id && req.user.role !== "admin") {
      return res.status(403).json("No puedes modificar los eventos de otro usuario." );
    }

    if (!events || !Array.isArray(events) || events.length === 0) {
      return res.status(400).json("Debes enviar un array de IDs de eventos." );
    }

    const validEventIds = events.filter((eventId) => mongoose.isValidObjectId(eventId));

    if (validEventIds.length === 0) {
      return res.status(400).json("Debes enviar IDs de eventos válidos.");
    }

    const updatedUser = await User.findByIdAndUpdate(id, { $addToSet: { events: { $each: validEventIds } } }, { new: true }).populate("events");     ;

    if (!updatedUser) {
      return res.status(404).json("Usuario no encontrado." );
    }

    await Event.updateMany( { _id: { $in: validEventIds } }, { $addToSet: { users: updatedUser._id } });

    return res.status(200).json({
      message: "Eventos añadidos correctamente",
      user: updatedUser,
    });
  } catch (error) {
    return res.status(400).json( "Error al añadir eventos.");
  }
};



module.exports = {register, login, getUsers, getUserById, updateUser, changeRole, deleteUser, addEventsToUser};
