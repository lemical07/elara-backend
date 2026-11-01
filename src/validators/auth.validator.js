import { body } from 'express-validator';

const camposRegistro = new Set(['nombre', 'apellido', 'correo', 'contrasena']);
const camposAcceso = new Set(['correo', 'contrasena']);

function validarCamposPermitidos(campos) {
    return body().custom((_, { req }) => {
        const datos = req.body;
        if (
            !datos ||
            typeof datos !== 'object' ||
            Array.isArray(datos) ||
            Object.keys(datos).length !== campos.size ||
            Object.keys(datos).some(campo => !campos.has(campo))
        ) {
            throw new Error(`Envía únicamente los campos requeridos: ${[...campos].join(', ')}.`);
        }
        return true;
    });
}

export const RegistroValidaciones = [
    validarCamposPermitidos(camposRegistro),
    body('nombre').isString().trim().notEmpty().isLength({ max: 60 })
        .withMessage('El nombre es obligatorio y no puede superar 60 caracteres.'),
    body('apellido').isString().trim().notEmpty().isLength({ max: 60 })
        .withMessage('El apellido es obligatorio y no puede superar 60 caracteres.'),
    body('correo').trim().isEmail().normalizeEmail().isLength({ max: 150 })
        .withMessage('Debes proporcionar un correo electrónico válido de hasta 150 caracteres.'),
    body('contrasena').isString().isLength({ min: 8 })
        .withMessage('La contraseña debe tener al menos 8 caracteres.')
        .custom(valor => {
            if (typeof valor === 'string' && Buffer.byteLength(valor, 'utf8') > 72) {
                throw new Error('La contraseña no puede superar 72 bytes.');
            }
            return true;
        })
];

export const InicioSesionValidaciones = [
    validarCamposPermitidos(camposAcceso),
    body('correo').trim().isEmail().normalizeEmail()
        .withMessage('Debes proporcionar un correo electrónico válido.'),
    body('contrasena').isString().notEmpty()
        .withMessage('La contraseña es obligatoria.')
];
