// importaar dependencias
const express = require("express");

// cargar router
const router = express.Router();

// importar controlador
const ArtistController = require("../controllers/artist");

// definir rutas
router.get("/prueba", ArtistController.prueba);

// exportar router
module.exports = router;

