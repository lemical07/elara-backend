import { body } from 'express-validator';

const UsuarioActualizarRolValidaciones = [
    body().custom((_, { req }) => {
        const datos = req.body;
        if (
            !datos ||
            typeof datos !== 'object' ||
            Array.isArray(datos) ||
            Object.keys(datos).length !== 1 ||
            !Object.hasOwn(datos, 'rol')
        ) {
            throw new Error('Envía únicamente el campo rol.');
        }
        return true;
    }),
    body('rol')
        .isIn(['ADMIN', 'USUARIO'])
        .withMessage('El rol debe ser ADMIN o USUARIO.')
];

export default UsuarioActualizarRolValidaciones;
