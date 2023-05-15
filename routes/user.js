// importaar dependencias
const express = require("express");

// cargar router
const router = express.Router();

// importar controlador
const UserController = require("../controllers/user");

// definir rutas
router.get("/prueba", UserController.prueba);
router.post("/register", UserController.register);
router.post("/login",UserController.login);
router.get("/profile/:id",UserController.profile);

// exportar router
module.exports = router;

