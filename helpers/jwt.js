// importar dependencias
const jwt = require("jwt-simple");
const moment = require("moment");
const { default: isEmail } = require("validator/lib/isEmail");

// clave secreta
const secret = "CLAVE_SECRETA_de_MI_proyecto_de_la_API_MuSical_7498247928";

// crear funcion para generar tokens
const createToken = (user) => {
    const payload = {
        id: user.id,
        name: user.name,
        surname: user.surname,
        nick: user.nick,
        email: user.email,
        role: user.role,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, "days")
    };

    // devoler el token
    return jwt.encode(payload,secret);
}

// exportar modulo
module.exports = {
    secret,
    createToken
}

