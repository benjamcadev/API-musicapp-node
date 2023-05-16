// importaciones

const Artist = require("../models/artist");
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

        // remove de songs


        // devolver un resultado
        return res.status(200).send({
            status: "success",
            artistRemoved
        });
    } catch (error) {
        return res.status(500).send({
            status: "error",
            message: "Error al eliminar artista"      
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
    remove
}