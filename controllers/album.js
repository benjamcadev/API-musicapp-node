const Album = require("../models/album");


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

// exportar acciones
module.exports = {
    prueba,
    save,
    one,
    list
}