import { body } from 'express-validator';

const UsuarioEliminarValidaciones = [
    body().custom((_, { req }) => {
        const datos = req.body;
        if (
            !datos ||
            typeof datos !== 'object' ||
            Array.isArray(datos) ||
            Object.keys(datos).length !== 1 ||
            !Object.hasOwn(datos, 'contrasena_actual')
        ) {
            throw new Error('Envía únicamente contrasena_actual.');
        }
        return true;
    }),
    body('contrasena_actual')
        .isString().withMessage('La contraseña actual debe ser texto.')
        .notEmpty().withMessage('La contraseña actual es obligatoria.')
];

export default UsuarioEliminarValidaciones;
