import { body } from 'express-validator';

const camposPermitidos = new Set(['contrasena_actual', 'contrasena_nueva']);

const UsuarioCambiarContrasenaValidaciones = [
    body().custom((_, { req }) => {
        const datos = req.body;
        if (
            !datos ||
            typeof datos !== 'object' ||
            Array.isArray(datos) ||
            Object.keys(datos).length !== camposPermitidos.size ||
            Object.keys(datos).some(campo => !camposPermitidos.has(campo))
        ) {
            throw new Error('Envía únicamente contrasena_actual y contrasena_nueva.');
        }
        return true;
    }),
    body('contrasena_actual')
        .isString().withMessage('La contraseña actual debe ser texto.')
        .notEmpty().withMessage('La contraseña actual es obligatoria.'),
    body('contrasena_nueva')
        .isString().withMessage('La nueva contraseña debe ser texto.')
        .isLength({ min: 8 }).withMessage('La nueva contraseña debe tener al menos 8 caracteres.')
        .custom(valor => {
            if (typeof valor === 'string' && Buffer.byteLength(valor, 'utf8') > 72) {
                throw new Error('La nueva contraseña no puede superar 72 bytes.');
            }
            return true;
        })
];

export default UsuarioCambiarContrasenaValidaciones;
