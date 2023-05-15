// importaar dependencias
const express = require("express");

// cargar router
const router = express.Router();

// importar controlador
const SongController = require("../controllers/song");

// definir rutas
router.get("/prueba", SongController.prueba);

// exportar router
module.exports = router;