import express from 'express';
import 'dotenv/config';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import configuracionSwagger from '../docs/swagger.js';

import { EstrategiasPassport } from './config/passport.js';
import { rutaNoEncontrada, manejarError } from './middleware/error.middleware.js';
import { limitarAPI } from './middleware/rate-limit.middleware.js';
import { validarVersionAPI } from './middleware/api-version.middleware.js';
import { VersionAPIValidaciones } from './validators/api-version.validator.js';
import { validarSolicitud } from './middleware/validation.middleware.js';
import rutasAutenticacion from './routes/auth.routes.js';
import rutasCategoria from './routes/category.route.js';
import rutasContenido from './routes/content.routes.js';
import rutasUsuario from './routes/user.routes.js';

import rutasResena from './routes/review.routes.js';
import rutasReaccion from './routes/reaction.routes.js';
import rutasPropuesta from './routes/proposal.routes.js';

class Aplicacion {
    constructor() {
        this.app = express();
        this.puerto = process.env.PORT || process.env.SERVER_PORT || 3000;
        this.configurar();
    }

    configurar() {
        EstrategiasPassport.configurar();

        const confianzaProxy = process.env.TRUST_PROXY;
        if (confianzaProxy) {
            this.app.set(
                'trust proxy',
                /^\d+$/.test(confianzaProxy) ? Number(confianzaProxy) : confianzaProxy
            );
        }

        this.app.use(express.json());
        this.app.use(cookieParser());
        this.app.use(passport.initialize());
        this.app.use('/api', limitarAPI, VersionAPIValidaciones, validarSolicitud, validarVersionAPI);

        this.app.use('/api/auth', rutasAutenticacion);
        this.app.use('/api/usuarios', rutasUsuario);
        this.app.use('/api/categorias', rutasCategoria);
        this.app.use('/api/contenidos', rutasContenido);
        this.app.use('/api/reviews', rutasResena);
        this.app.use('/api/reacciones', rutasReaccion);
        this.app.use('/api/propuestas', rutasPropuesta);

        this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(configuracionSwagger));
        this.app.get("/health", this.estadoSalud);
        this.app.use(rutaNoEncontrada);
        this.app.use(manejarError);
    }

    estadoSalud = (req, res) => {
        res.status(200).json({
            estado: "Prueba Aprobada",
            mensaje: "ELARA Backend en funcionamiento"
        });
    };

    iniciar() {
        this.app.listen(this.puerto, "0.0.0.0", () => this.mostrarInicio());
    }

    mostrarInicio() {
        console.log(`Servidor ELARA ejecutándose en el puerto http://localhost:${this.puerto}`);
    }
}

new Aplicacion().iniciar();
