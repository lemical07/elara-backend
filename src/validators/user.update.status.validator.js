import { body, param } from 'express-validator';

const UsuarioActualizarEstadoValidaciones = [
    param("id")
        .isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo."),

    body("activo")
        .isBoolean().withMessage("El estado debe ser verdadero o falso.")
        .toBoolean(),

    body().custom((_, { req }) => {
        if (
            !req.body ||
            typeof req.body !== 'object' ||
            Array.isArray(req.body) ||
            Object.keys(req.body).length !== 1 ||
            !Object.hasOwn(req.body, 'activo')
        ) {
            throw new Error('Envía únicamente el campo activo.');
        }
        return true;
    })
];
export default UsuarioActualizarEstadoValidaciones;