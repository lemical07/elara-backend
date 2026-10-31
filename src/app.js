import express from 'express'
import 'dotenv/config';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from '../docs/swagger.js';

import { configurarEstrategiasPassport } from './config/passport.js';
import { rutaNoEncontrada, manejarError } from './middleware/error.middleware.js';
import authRoutes from './routes/auth.routes.js';
import categoryRoutes from './routes/category.route.js';
import contentRoutes from './routes/content.routes.js';
import userRoutes from './routes/user.routes.js';
import reviewRoutes from './routes/review.routes.js';
import reactionRoutes from './routes/reaction.routes.js';

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

configurarEstrategiasPassport();

// configuracion de la app
app.use(express.json());
app.use(passport.initialize());

// otras rutas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api/categorias', categoryRoutes);
app.use('/api/contenidos', contentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reacciones', reactionRoutes);

// doc. Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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