const { register, login, getUsers, getUserById, updateUser, changeRole, deleteUser, addEventsToUser, removeEventFromUser } = require("../controllers/user");
const { isAuth, isAdmin } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/file");

const usersRouter = require("express").Router();

usersRouter.post("/register", upload.any(), register);
usersRouter.post("/login", login);

// Rutas que requieren autenticación
usersRouter.get("/", isAuth, getUsers);
usersRouter.get("/:id", isAuth, getUserById);
usersRouter.put("/:id", isAuth, upload.single("image"), updateUser);
usersRouter.put("/:id/role", isAuth, isAdmin, changeRole);
usersRouter.delete("/:id", isAuth, deleteUser);

// Rutas para gestionar eventos del usuario
usersRouter.put("/:id/events", isAuth, addEventsToUser);
usersRouter.delete("/:id/events/:eventId", isAuth, removeEventFromUser);

module.exports = usersRouter;
