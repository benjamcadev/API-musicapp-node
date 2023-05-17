// importaar dependencias
const express = require("express");

// cargar router
const router = express.Router();

const check = require("../middlewares/auth");

// importar controlador
const SongController = require("../controllers/song");


// conf multer
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/songs/");
    },
    filename: (req, file, cb) => {
        cb(null,"song-"+Date.now()+"-"+file.originalname);
    }
});

const uploads = multer({storage});


// definir rutas
router.get("/prueba", SongController.prueba);
router.post("/save", check.auth, SongController.save);
router.get("/one/:id",check.auth, SongController.one);
router.get("/list/:albumId", check.auth, SongController.list);
router.put("/update/:id", check.auth, SongController.update);
router.delete("/remove/:id", check.auth, SongController.remove);
router.post("/upload/:id",[check.auth, uploads.single("file0")], SongController.upload);
router.get("/audio/:file", SongController.audio );


// exportar router
module.exports = router;