
import express from "express";
import "dotenv/config";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "../docs/swagger.js";

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

// configuracion de la app
app.use(express.json());

// doc. Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ruta estandar servidor
app.get("/health", (req, res) => {
    res.status(200).json({
        estado: "Prueba Aprobada",
        mensaje: "ELARA Backend en funcionamiento"
    });
});

// demás rutas

// rutas inexistentes
app.use((req, res) => {
    res.status(404).json({mensaje: "Ruta no encontrada"});
});

// manejo de errores
function manejadorErrores(err, req, res, next) {
    res.status(err.statusCode || 500).json({
        mensaje: err.message || "Error interno del servidor",
        errores: err.details || null
    });
}

app.use(manejadorErrores);

// iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor ELARA ejecutándose en el puerto ${PORT}`);
});
