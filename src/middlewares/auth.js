const User = require("../api/models/user");
const { verifyToken } = require("../utils/jwt");

const isAuth = async (req, res, next) => {
    try {
        const [,token] = req.headers.authorization?.split(" "); 
        
        const {id} = verifyToken(token); 
        
        const user = await User.findById(id); 

        if (!user) {
          return res.status(401).json("No estás autorizado para acceder");
        }

        user.password = undefined; 
        req.user = user; 

        next(); 
    } catch (error) {
        return res.status(401).json("No estás autorizado para acceder"); 
    }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json("Acceso denegado. Se requiere rol de administrador.");
  }
  next();
};

module.exports = { isAuth, isAdmin };
