//importaciones
const validate = require("../helpers/validate");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("../helpers/jwt");
const fs = require("fs");
const path = require("path");

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

const update = (req,res) => {

    // Recoger datos usuario
    let userIdentity = req.user; // datos que estan en la sesion

    // Recoger datos a actualizar
    let userToUpdate = req.body; // datos que vopy a actualizar

      // Validar datos
      try {
        validate(userToUpdate);

    } catch (error) {
         return res.status(400).send({
            status: "error",
            message: "Validacion no superada" 
        })
    }



    // Comprobar si el usuario existe
    User.find({
        $or: [
            {email: userToUpdate.email.toLowerCase()}, // preguntando si el email o el nick son igual o existe en la bd
            {nick: userToUpdate.nick.toLowerCase()}
        ]
    })
    .then(async (users) => {

        // comprobar si el usuario existe y no soy yo (el identificado)
        let userIsset = false;
        users.forEach(async user => {

            if (user && user._id != userIdentity.id) {
                userIsset = true;
            }

               // si existe devuelvo una respuesta

            if (userIsset) {
                return res.status(200).send({
                    status: "success",
                    message: "El usuario ya existe"
                    
                });
            }

            // cifrar password
            if (userToUpdate.password) {
                let pwd = await bcrypt.hash(userToUpdate.password,10);
                userToUpdate.password = pwd;
            }else{
                delete userToUpdate.password;
            }

                // buscar el usuario n la bd y actualizar datos
                try {
                    let userUpdated = await User.findByIdAndUpdate(
                        {_id: userIdentity.id}, userToUpdate, {new:true}); // le pasas el id que quieres actualizar, luego los datos que quiero actualizar y luego que me muestre los datos actualizados
                
                 // devolver respuesta
                 return res.status(200).send({
                    status: "success",
                    message: "Metodo update usuario",
                    user: userUpdated
                    
                });

                } catch (error) {
                    return res.status(500).send({
                        status: "error",
                        message: "Error al updatear usuario"
                        
                    }); 
                    
                }
              
        })

        
    })
    .catch((error) => {
        return res.status(400).send({
            status: "error",
            message: "Error al buscar usuario"
            
        });
    })

    

}

const upload = (req,res) => {
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
    User.findOneAndUpdate(
        {_id: req.user.id}, {image: req.file.filename}, {new:true} //Actualizar el campo imagen en la bd
        ) 
    .then((userUpdated) => {


        return res.status(200).send({
            status: "success",
            user: userUpdated,
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

const avatar = (req,res) => {
    // Sacar el parametro de la url
    const file = req.params.file;

    // montar el path real de la imagen
    const filePath = "./uploads/avatars/"+file;

    // comprobar que existe el fichero
    fs.stat(filePath, (error, exists) => {

        if (error || !exists) {
            return res.status(404).send({
                status: "error",
                message: "No existe la imagen"
            });
        }

        return res.sendFile(path.resolve(filePath));

    })

    // devolver el archivo
}

// exportar acciones
module.exports = {
    prueba,
    register,
    login,
    profile,
    update,
    upload,
    avatar
}

