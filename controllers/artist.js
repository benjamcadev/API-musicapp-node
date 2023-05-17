// importaciones

const Artist = require("../models/artist");
const Album = require("../models/album");
const Song = require("../models/song");

const mongoosePagination = require("mongoose-pagination");


// accion de prueba
const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: artist.js"
    });
}

// accion guardar artista
const save = (req,res) => {

    // recoger datos del body
    let params = req.body;

    // crear el objeto a guardar
    let artist = new Artist(params);

    // guardarlo
    artist.save()
    .then((artistStored) => {

        return res.status(200).send({
            status: "success",
            message: "Accion de guardar artista",
            artistStored
        });


    })
    .catch((error) => {
        return res.status(404).send({
            status: "error",
            message: "Hubo un error al guardar artista"      
        });
    })

   
}

const one = (req,res) => {

    // sacar parametro por url
    const artistId = req.params.id;

    // find
    Artist.findById(artistId)
    .then((artist) => {
        
        return res.status(200).send({
            status: "success",
            artist
        });
    })
    .catch((error) => {
        return res.status(404).send({
            status: "error",
            message: "No existe artista"      
        });
    })
}

const list = (req,res) => {
    // sacar la posible pagina
    let page = 1;

    if (req.params.page) {
        page = req.params.page;
        
    }
    // definir numero de elementos por pagina
    const itemPerPage = 5;

    // find, ordenarlo y paginarlo
    Artist.find()
    .sort("name")
    .paginate(page,itemPerPage)
    .then((artist) => {
        return res.status(200).send({
            status: "success",
            itemPerPage,
            page,
            artist
        });
    })


}

const update = (req,res) => {
    /// Recoger id del artista
    const idArtist = req.params.id;

    // recoger datos body
    const data = req.body;

    // buscar y actualizar artista
    Artist.findByIdAndUpdate(idArtist,data,{new:true})
    .then((artistUpdate) => {

        return res.status(200).send({
            status: "success",
            artistUpdate
        });
    })
    .catch((error) => {
        return res.status(500).send({
            status: "error",
            message: "No se ha actualizado el artista"      
        });
    })
}

const remove = async (req, res) => {
    // sacar el id del artista de la url
    const artistId = req.params.id;
    try {
        // hacer consulta para buscar y eliminar el artista con await
        const artistRemoved = await Artist.findByIdAndDelete(artistId);
        
        // remove de albums
        const albumRemoved = await Album.find({artist: artistId._id}).remove();

        albumRemoved.forEach(async (album) => {
            // remove de songs
            const songRemoved = await Song.find({album: album._id}).remove();

            album.remove();
        });
        

       


        // devolver un resultado
        return res.status(200).send({
            status: "success",
            message: "Artista eliminado",
            artistRemoved
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar artista"      
        });
    }
    
}
const upload = (req,res) => {
    // capturar el id del artista
    let artistId = req.params.id;

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
    Artist.findOneAndUpdate(
        {_id: artistId}, {image: req.file.filename}, {new:true} //Actualizar el campo imagen en la bd
        ) 
    .then((artistUpdated) => {


        return res.status(200).send({
            status: "success",
            user: artistUpdated,
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
    const filePath = "./uploads/artists/"+file;

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
    image
}