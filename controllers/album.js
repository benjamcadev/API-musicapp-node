const Album = require("../models/album");
const fs = require("fs");
const path = require("path");
const Song = require("../models/song");


// accion de prueba
const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: album.js"
    });
}

const save = (req,res) => {
    // sacar los datos del body
    let params = req.body;

    // crear objeto
    let album = new Album(params);

    // guardar el objeto
    album.save()
    .then((albumStored) =>{

        return res.status(200).send({
            status: "success",
            message: "Album guardado",
            albumStored
        });

    })
    .catch((error) => {
        return res.status(500).send({
            status: "error",
            message: "No se pudo guardar el album"
        });
    })
   
}

const one = (req,res) => {
    // sacar el id del album
    const albumId = req.params.id;

    // luego hacer find y populate info de artista
    Album.findById(albumId)
    .populate({path: "artist"})
    .then((album) => {

    // devolver respuesta
        return res.status(200).send({
            status: "success",
            album
        });
    })
    .catch((error) => {
        return res.status(500).send({
            status: "error",
            message: "No se pudo obtener el album"
        });
    })

    
}

const list = (req,res) => {
    // sacar el id del artista de la url
    const artistId = req.params.artistId;

    // sacar todos los albums de la bbdd de un artista
    if (!artistId) {
        return res.status(404).send({
            status: "error",
            message: "No se ha encontrado el artista"
        }); 
    }

    Album.find({artist: artistId})
    .populate("artist")
    .then((albums) => {

        return res.status(200).send({
            status: "success",
            albums
        });
        
    })
    .catch((error) => {
        return res.status(404).send({
            status: "error",
            message: "No se ha encontrado el album"
        });
    })
    
    // populate info y devoler resultado
}

const update = (req,res) => {

    // recoger param url
    const albumId = req.params.id;

    // recoger el body
    const data = req.body;

    // find y un update

    Album.findByIdAndUpdate(albumId, data, {new:true})
    .then((albumUpdated) => {

        return res.status(200).send({
            status: "success",
            albumUpdated
        });

    })
    .catch((error) => {
        return res.status(404).send({
            status: "error",
            message: "No se ha actualizado el album"
        });
    })


   
}

const upload = (req,res) => {
    // capturar el id del artista
    let albumId = req.params.id;

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
    if (extension != "png" && extension != "jpg" && extension != "jpeg" && extension != "gif") {
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
    Album.findOneAndUpdate(
        {_id: albumId}, {image: req.file.filename}, {new:true} //Actualizar el campo imagen en la bd
        ) 
    .then((albumUpdated) => {


        return res.status(200).send({
            status: "success",
            user: albumUpdated,
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

const image = (req,res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // montar el path real de la imagen
    const filePath = "./uploads/albums/"+file;

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

const remove = async (req, res) => {
    // sacar el id del artista de la url
    const albumId = req.params.id;
    
    try {
       
        
        // remove de albums
        const albumRemoved = await Album.findById(albumId).deleteOne();
       
        const songRemoved = await Song.find({album: albumId}).deleteOne();

        // devolver un resultado
        return res.status(200).send({
            status: "success",
            message: "Album eliminado",
            albumRemoved,
            songRemoved
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar album",
            error   
        });
    }
    
}

// exportar acciones
module.exports = {
    prueba,
    save,
    one,
    list,
    update,
    upload,
    image,
    remove
}