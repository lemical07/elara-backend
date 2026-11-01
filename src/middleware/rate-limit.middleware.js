import { rateLimit } from 'express-rate-limit';

export const limitarAPI = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 200,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        exito: false,
        mensaje: 'Se alcanzó el límite de solicitudes. Inténtalo más tarde.'
    }
});

export const limitarAutenticacion = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    message: {
        exito: false,
        mensaje: 'Demasiados intentos de autenticación. Inténtalo más tarde.'
    }
});
