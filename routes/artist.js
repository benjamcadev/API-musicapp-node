// importaar dependencias
const express = require("express");
const check = require("../middlewares/auth");

// cargar router
const router = express.Router();

// importar controlador
const ArtistController = require("../controllers/artist");

// definir rutas
router.get("/prueba", ArtistController.prueba);
router.post("/save",check.auth,ArtistController.save);
router.get("/one/:id", check.auth, ArtistController.one);
router.get("/list/:page?", check.auth, ArtistController.list);
router.put("/update/:id",check.auth,ArtistController.update);
router.delete("/remove/:id",check.auth,ArtistController.remove);
// exportar router
module.exports = router;

