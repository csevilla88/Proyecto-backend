const cloudinary = require("cloudinary").v2;

const connectCloudinary = () => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUD_NAME,
            api_key: process.env.API_KEY,
            api_secret: process.env.API_SECRET,
        })
        console.log("Conectado con éxito a Cloudinary");
    } catch (error) {
        console.error("Error al conectar con Cloudinary:", error.message);
    }
};


const deleteFile = async (imageUrl) => {
    try {
        if (!imageUrl) return;
        const urlParts = imageUrl.split("/");
        const fileWithExtension = urlParts[urlParts.length - 1];
        const folder = urlParts[urlParts.length - 2];
        const publicId = `${folder}/${fileWithExtension.split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
        console.log("Imagen eliminada de Cloudinary:", publicId);
    } catch (error) {
        console.error("Error al eliminar imagen de Cloudinary:", error.message);
    }
};

module.exports = { connectCloudinary, deleteFile };
