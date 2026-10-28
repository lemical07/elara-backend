import express from 'express'
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../docs/swagger.js';

import { rutaNoEncontrada, manejarError } from './middleware/error.middleware.js';

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


app.use(rutaNoEncontrada);// rutas inexistentes
app.use(manejarError);//manejo de errores

// iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor ELARA ejecutándose en el puerto http://localhost:${PORT}`);
});
