//importaciones
const validate = require("../helpers/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");

// accion de prueba
const prueba = (req, res) => {
    return res.status(200).send({
        status: "success",
        message: "Mensaje enviado desde: user.js"
    });
}

// Registro
const register = (req,res) => {

    // Recoger datos de la peticion
    let params = req.body;

    // Comprobar que me llegan bien
    if (!params.name || !params.nick || !params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar" 
        })
    }

    // Validar datos
    try {
        validate(params);

    } catch (error) {
         return res.status(400).send({
            status: "error",
            message: "Validacion no superada" 
        })
    }

    // Control usuarios duplicados
    User.find({
        $or: [
            {email: params.email.toLowerCase()},
            {nick: params.nick.toLowerCase()}
        ]
    })
    .then(async (users) => {

        if (users && users.length >= 1) {
            return res.status(200).send({
                status: "error",
                message: "El usuario ya existe" 
            }) 
        }

    // Cifrar la contraseña
        let pwd = await bcrypt.hash(params.password, 10); // cifrar 10 veces
        params.password = pwd;

    // Crear objeto del usuario
    let userToSave = new User(params);

    // Guardar usuario en la bd
    userToSave.save()
    .then((userStored) => {

    // Limpiar el objeto a devolver
    let userCreated = userStored.toObject();
    delete userCreated.password;
    delete userCreated.role;

    // DEvolver resultado

        return res.status(200).send({
            status: "success",
            message: "Usuario registrado correctamente",
            user: userCreated
        });

    })
    .catch((error) => {
        return res.status(500).send({
            status: "error",
            message: "Error al registrar usuario" 
        })
    })

    

    })
    .catch((error) => {
        return res.status(500).send({
            status: "error",
            message: "Error usuarios duplicados" 
        })
    })
    

    

}

const login = (req,res) => {
    // Recoger los parametros de la peticion
    let params = req.body;

    // comprobar que me llegan
    if (!params.email || !params.password) {
        return res.status(400).send({
            status: "error",
            message: "Faltan datos por enviar"
            
        });
    }

    // buscar en la bd si existe el email
    User.findOne({
        email: params.email
    })
    .select("+password +role") // agregar a la query el campo password, que se oculta en el modelo de usuario
    .then((user) => {
        if (!user) {
            return res.status(404).send({
                status: "error",
                message: "Error no existe usuario"
                
            });
        }

         // comprobar su contrseña
        const pwd = bcrypt.compareSync(params.password, user.password); // compara la pass enviada por el usuario con la cifrada en la bd
        
        if (!pwd) {
            return res.status(400).send({
                status: "error",
                message: "Login incorrecto"
                
            });
        }

        //elmimando las password del objeto para que no la devuelva
        let identityUser = user.toObject();
        delete identityUser.password;
        delete identityUser.role;
        // conseuir token jwt

        // devolver datos usuario y token
        const token = jwt.createToken(user); // le paso el user y no el objeto limpiado ya que tengo toda la info en user

        return res.status(200).send({
            status: "success",
            message: "Metodo de login",
            user: identityUser,
            token
            
        });
    })
    .catch((error) => {
        return res.status(400).send({
            status: "error",
            message: "Error al buscar usuario"
            
        });
    })

   



   
}

const profile = (req,res) => {
    // recoger id usuario url
    const id = req.params.id;

    // consulta para sacar los datos del perfil
    User.findById(id)
    .then((userProfile) => {

        if (!userProfile) {
            return res.status(404).send({
                status: "error",
                message: "Error al buscar perfil no existe"
                
            });
        }

        return res.status(200).send({
            status: "success",
            message: "Metodo de profile",
            userProfile
           
            
        });

    })
    .catch((error) => {
        return res.status(400).send({
            status: "error",
            message: "Error al buscar perfil"
            
        });
    })
    // devolver resultado

   
}

// exportar acciones
module.exports = {
    prueba,
    register,
    login,
    profile
}

