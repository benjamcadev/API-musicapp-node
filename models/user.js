const {Schema, model} = require("mongoose");
const { default: isEmail } = require("validator/lib/isEmail");

const UserSchema = Schema({
    name: {type: String,
    required: true},
    surname: String,
    nick: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false  //Esto es para que no devuelva la password para mostrar en un find
    },
    role: {
        type: String,
        default: "role_user"
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

module.exports = model("User", UserSchema, "users"); // coleccion: users