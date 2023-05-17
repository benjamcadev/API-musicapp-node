
const Song = require("../models/song");
const fs = require("fs");
const path = require("path");


// accion de prueba
const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: song.js"
    });
}

// metodo para guardar cancion
const save = (req,res) => {
    // recoger los datos que me llegan
    let params = req.body;

    // crear un objeto con mi modelo
    let song = new Song(params);

    // guardado
    song.save()
    .then((songStored) => {

        return res.status(200).send({
            status: "success",
            songStored
        });

    })
    .catch((error) => {
        return res.status(404).send({
            status: "error",
            message: "Hubo error al guardar cancion",
            error
        });
    })
}

// metodo para sacar una cancion
const one = (req,res) => {
    // recoger id
    let songId = req.params.id;

    // buscar cancion con find
    Song.findById(songId)
    .populate("album")
    .then((songFind) => {

        return res.status(200).send({
            status: "success",
            songFind
        });

    })
    .catch((error) => {
        return res.status(404).send({
            status: "error",
            message: "Hubo error al buscar cancion",
            error
        });
    })


}

const list = (req,res) => {
    // recoger id de album
    let albumId = req.params.albumId;

    // hacer consulta find
    Song.find({album: albumId})
    .populate({
        path: "album",     // Esto es un populate anidado para sacar todos los detalles del album y del artista
        populate: {
            path: "artist",
            model: "Artist"
        }
    }) 
    .sort("track")
    .then((songs) => {

        return res.status(200).send({
            status: "success",
            songs
        });

    })
    .catch((error) => {
        return res.status(404).send({
            status: "error",
            message: "Hubo error al listar cancion",
            error
        });
    })

    // devolver un resultado
}


const update = (req,res) => {
    // parametro de la url id cancion
    let songId = req.params.id;

    // datos para guardar
    let data = req.body;

    // busqueda y actualizacion
    Song.findByIdAndUpdate(songId, data, {new:true})
    .then((songUpdated) => {

        return res.status(200).send({
            status: "success",
            songUpdated
        });
    })
    .catch((error) => {
        return res.status(404).send({
            status: "error",
            message: "Hubo error al actualizar la cancion",
            error
        });
    })
}

const remove = (req,res) => {
    const songId = req.params.id;

    Song.findByIdAndRemove(songId)
    .then((songRemoved) => {

        return res.status(200).send({
            status: "success",
            songRemoved
        });

    })
    .catch((error) => {
        return res.status(404).send({
            status: "error",
            message: "Hubo error al eliminar la cancion",
            error
        });
    })
}

const upload = (req,res) => {
    // capturar el id del artista
    let songId = req.params.id;

    // configuracion de subida con multer


    // recoger fichero de imagen
    if (!req.file) {
        return res.status(404).send({
            status: "error",
            message: "No se ha enviado la imagen"
            
        });
    }

    // conseguir el nombre del archivo
    let image = req.file.originalname;

    // sacar info de la imagen
    const imageSplit = image.split("\.");
    const extension = imageSplit[1];

   

    // comprobar la extension
    if (extension != "mp3" && extension != "ogg") {
        // borrar archivo
        const filePath = req.file.path;
        const fileDeleted = fs.unlinkSync(filePath);

        // devolver error
        return res.status(404).send({
            status: "error",
            message: "La extension no es valida"      
        });
    }

    // si todo es correcto guardamos imagen
    Song.findOneAndUpdate(
        {_id: songId}, {file: req.file.filename}, {new:true} //Actualizar el campo imagen en la bd
        ) 
    .then((songUpdated) => {


        return res.status(200).send({
            status: "success",
            user: songUpdated,
            file: req.file
            
        });


    })
    .catch((error) => {
        return res.status(404).send({
            status: "error",
            message: "Hubo un error al subir el archivo"      
        });
    })
}

const audio = (req,res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // montar el path real de la imagen
    const filePath = "./uploads/songs/"+file;

    // comprobar que existe el fichero
    fs.stat(filePath, (error, exists) => {

        if (error || !exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            });
        }
        // devolver el archivo
        return res.sendFile(path.resolve(filePath));

    })

   
}



// exportar acciones
module.exports = {
    prueba,
    save,
    one,
    list,
    update,
    remove,
    upload,
    audio
}