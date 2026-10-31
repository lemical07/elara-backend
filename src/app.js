import express from 'express'
import 'dotenv/config';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import configuracionSwagger from '../docs/swagger.js';

import { configurarEstrategiasPassport } from './config/passport.js';
import { rutaNoEncontrada, manejarError } from './middleware/error.middleware.js';
import rutasAutenticacion from './routes/auth.routes.js';
import rutasCategoria from './routes/category.route.js';
import rutasContenido from './routes/content.routes.js';
import rutasUsuario from './routes/user.routes.js';
import rutasResena from './routes/review.routes.js';
import rutasReaccion from './routes/reaction.routes.js';

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

configurarEstrategiasPassport();

// configuracion de la app
app.use(express.json());
app.use(passport.initialize());

// otras rutas
app.use('/api/auth', rutasAutenticacion);
app.use('/api/usuarios', rutasUsuario);
app.use('/api/categorias', rutasCategoria);
app.use('/api/contenidos', rutasContenido);
app.use('/api/reviews', rutasResena);
app.use('/api/reacciones', rutasReaccion);

// doc. Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(configuracionSwagger));

// ruta estandar servidor
app.get("/health", (req, res) => {
    res.status(200).json({
        estado: "Prueba Aprobada",
        mensaje: "ELARA Backend en funcionamiento"
    });
});


app.use(rutaNoEncontrada);// rutas inexistentes
app.use(manejarError);//manejo de errores

// iniciar servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor ELARA ejecutándose en el puerto http://localhost:${PORT}`);
});