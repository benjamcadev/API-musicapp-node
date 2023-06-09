
// importar conexion a bbdd
const connection = require("./database/connection");

// importar dependencias
const express = require("express");
const cors = require("cors");

// mensaje de bienvenida
console.log("API REST con node para la app de musica");

// ejecutar conexion a la bd
connection();

// crear servidor de node
const app = express();
const port = 3911;

// configurar cors
app.use(cors());

// convertir los datos del body a objetos js
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// cargar configurar de rutas
const UserRoutes = require("./routes/user");
const ArtistRoutes = require("./routes/artist");
const AlbumRoutes = require("./routes/album");
const SongRoutes = require("./routes/song");

app.use("/api/user",UserRoutes);
app.use("/api/artist",ArtistRoutes);
app.use("/api/album",AlbumRoutes);
app.use("/api/song",SongRoutes);


// ruta de prueba
app.get("/ruta-probando",(req,res) => {
    return res.status(200).json({
        "nombre": "Benjamin"
    })
})

// poner el servidor a ecuchar peticiones https
app.listen(port,() => {
    console.info(`Servidor de node esta escuchando en el puerto: ${port}`)
})