const { register, login, getUsers, getUserById, updateUser, changeRole, deleteUser, addEventsToUser } = require("../controllers/user");
const { isAuth, isAdmin } = require("../../middlewares/auth");
const { upload } = require("../../middlewares/file");

const usersRouter = require("express").Router();

usersRouter.post("/register", upload.single("image"), register);
usersRouter.post("/login", login);


usersRouter.get("/", isAuth, getUsers);
usersRouter.get("/:id", isAuth, getUserById);
usersRouter.put("/:id", isAuth, upload.single("image"), updateUser);
usersRouter.put("/:id/role", isAuth, isAdmin, changeRole);
usersRouter.delete("/:id", isAuth, deleteUser);


usersRouter.put("/:id/events", isAuth, addEventsToUser);

module.exports = usersRouter;
