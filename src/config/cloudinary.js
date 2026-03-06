const cloudinary = require("cloudinary").v2;

const connectCloudinary = () => {
    const cloudName = process.env.CLOUD_NAME;
    const apiKey = process.env.API_KEY;
    const apiSecret = process.env.API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
        console.error("Faltan variables de entorno de Cloudinary (CLOUD_NAME, API_KEY, API_SECRET).")
        return;
    }

    if (!/^[a-z0-9-]+$/.test(cloudName)) {
        console.warn(
            `CLOUD_NAME parece inválido: '${cloudName}'. Revisa el 'cloud name' real en tu panel de Cloudinary (suele ser minúsculas).`
        );
    }

    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });

    cloudinary.api
        .ping()
        .then(() => console.log("Conectado con éxito a Cloudinary"))
        .catch((error) => {
            console.error("No se puede conectar a Cloudinary:", error?.message || error);
        });
}

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
