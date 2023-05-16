// importar modulos
const jwt = require("jwt-simple");
const moment = require("moment");

// importar clave secreta
const { secret } = require("../helpers/jwt");

// crear middleware (metodo o funcion)
exports.auth = (req,res,next) => {
    
// comprobar si llega la cabecera de auth
if (!req.headers.authorization) {
    return res.status(403).send({
        status: "error",
        message: "La peticion no tiene la cabecera de autenticacion"
    });
}

// limpiar token
let token = req.headers.authorization.replace(/['"]+/g,""); 

// decodificar el token
try {
    let payload = jwt.decode(token,secret);

    // comprobar la expiracion del token
    if (payload.exp >= moment().unix()) {
        return res.status(401).send({
            status: "error",
            message: "Token expirado"
           
        });
    }

    // agregar datos del usuario a la request
    req.user = payload;

    


} catch (error) {
    return res.status(404).send({
        status: "error",
        message: "Token invalido",
        error
    });
}

// pasar a la ejecucion de la accion
next();

}

