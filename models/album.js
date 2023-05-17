const {Schema, model} = require("mongoose");
const { image } = require("../controllers/artist");

const AlbumSchema = Schema({
    artist: {
        type: Schema.ObjectId,  // Hacemos referencia al modelo de artista
        ref: "Artist"
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    year: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: "default.png"
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model("Album",AlbumSchema,"albums") // Primer parametro: como se llamara el modelo, segundo cual sera el schema que ocuparan, tercero en que coleccion se guardara en la bd