// importaar dependencias
const express = require("express");


// cargar router
const router = express.Router();
const check = require("../middlewares/auth");

// importar controlador
const AlbumController = require("../controllers/album");

// conf multer
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/albums/");
    },
    filename: (req, file, cb) => {
        cb(null,"album-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});

// definir rutas
router.get("/prueba", AlbumController.prueba);
router.post("/save",check.auth,AlbumController.save);
router.get("/one/:id", check.auth, AlbumController.one);
router.get("/list/:artistId", check.auth, AlbumController.list);
router.put("/update/:albumId", check.auth, AlbumController.update);
router.post("/upload/:id",[check.auth, uploads.single("file0")], AlbumController.upload);
router.get("/image/:file", AlbumController.image );
router.delete("/remove/:id", check.auth, AlbumController.remove);

// exportar router
module.exports = router;

