// importr mongoose
const mongoose = require("mongoose");

// metodo de conexion
const connection = async() =>{
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/app_musica");

        console.info("Conectado correctamente a la bbdd");
    } catch (error) {
        console.error(error);
        throw new Error("No se ha podido establecer la conexion a la bbdd");
    }


}

module.exports = connection;