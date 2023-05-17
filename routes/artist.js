// importaar dependencias
const express = require("express");
const check = require("../middlewares/auth");

// cargar router
const router = express.Router();

// importar controlador
const ArtistController = require("../controllers/artist");

// conf multer
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/artists/");
    },
    filename: (req, file, cb) => {
        cb(null,"artist-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});

// definir rutas
router.get("/prueba", ArtistController.prueba);
router.post("/save",check.auth,ArtistController.save);
router.get("/one/:id", check.auth, ArtistController.one);
router.get("/list/:page?", check.auth, ArtistController.list);
router.put("/update/:id",check.auth,ArtistController.update);
router.delete("/remove/:id",check.auth,ArtistController.remove);
router.post("/upload/:id",[check.auth, uploads.single("file0")], ArtistController.upload);
router.get("/avatar/:file", ArtistController.image );
// exportar router
module.exports = router;

