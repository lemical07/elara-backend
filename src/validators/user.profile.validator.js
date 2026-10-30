import { body } from 'express-validator';

const camposPermitidos = new Set(['nombre', 'apellido', 'correo']);

const UsuarioPerfilValidaciones = [
    body().custom((_, { req }) => {
        const datos = req.body;
        if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
            throw new Error('El cuerpo debe ser un objeto JSON.');
        }

        const campos = Object.keys(datos);
        if (campos.length === 0 || campos.some(campo => !camposPermitidos.has(campo))) {
            throw new Error('Solo se permiten nombre, apellido y correo; envía al menos uno.');
        }
        return true;
    }),
    body('nombre')
        .optional()
        .isString().withMessage('El nombre debe ser texto.')
        .trim()
        .notEmpty().withMessage('El nombre no puede estar vacío.')
        .isLength({ max: 60 }).withMessage('El nombre no puede superar 60 caracteres.'),
    body('apellido')
        .optional()
        .isString().withMessage('El apellido debe ser texto.')
        .trim()
        .notEmpty().withMessage('El apellido no puede estar vacío.')
        .isLength({ max: 60 }).withMessage('El apellido no puede superar 60 caracteres.'),
    body('correo')
        .optional()
        .isString().withMessage('El correo debe ser texto.')
        .trim()
        .isEmail().withMessage('El correo no tiene un formato válido.')
        .isLength({ max: 150 }).withMessage('El correo no puede superar 150 caracteres.')
];

export default UsuarioPerfilValidaciones;
