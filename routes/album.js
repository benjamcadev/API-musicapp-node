// importaar dependencias
const express = require("express");


// cargar router
const router = express.Router();
const check = require("../middlewares/auth");

// importar controlador
const AlbumController = require("../controllers/album");

// definir rutas
router.get("/prueba", AlbumController.prueba);
router.post("/save",check.auth,AlbumController.save);
router.get("/one/:id", check.auth, AlbumController.one);
router.get("/list/:artistId", check.auth, AlbumController.list);

// exportar router
module.exports = router;

