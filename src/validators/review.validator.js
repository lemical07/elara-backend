import { body, param } from 'express-validator';

const camposPermitidos = new Set(['contenido_id', 'titulo', 'comentario', 'calificacion', 'nombre_visitante']);
const camposActualizables = new Set(['titulo', 'comentario', 'calificacion']);

class ResenaValidaciones {
    static validarCuerpo(campos) {
        return body().custom((_, { req }) => {
            const datos = req.body;
            if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
                throw new Error('El cuerpo debe ser un objeto JSON.');
            }

            const claves = Object.keys(datos);
            if (claves.length === 0 || claves.some(campo => !campos.has(campo))) {
                throw new Error(`Envía únicamente los campos permitidos: ${[...campos].join(', ')}.`);
            }
            return true;
        });
    }
}

export const ResenaCrearValidaciones = [
    ResenaValidaciones.validarCuerpo(camposPermitidos),
    body('contenido_id')
        .isInt({ min: 1 }).withMessage('El contenido_id debe ser un entero positivo.'),
    body('titulo')
        .isString().withMessage('El título debe ser texto.')
        .trim()
        .notEmpty().withMessage('El título es obligatorio.')
        .isLength({ max: 25 }).withMessage('El título no puede superar 25 caracteres.'),
    body('comentario')
        .optional({ nullable: true })
        .isString().withMessage('El comentario debe ser texto.'),
    body('calificacion')
        .custom(valor => typeof valor === 'number' && Number.isInteger(valor) && valor >= 1 && valor <= 10)
        .withMessage('La calificación debe ser un número entero entre 1 y 10.'),
    body('nombre_visitante')
        .optional()
        .isString().withMessage('El nombre del visitante debe ser texto.')
        .trim()
        .notEmpty().withMessage('El nombre del visitante no puede estar vacío.')
        .isLength({ max: 60 }).withMessage('El nombre del visitante no puede superar 60 caracteres.')
];

export const ResenaIdValidaciones = [
    param('id')
        .isInt({ min: 1 }).withMessage('El id debe ser un entero positivo.')
];

export const ResenaContenidoIdValidaciones = [
    param('contenidoId')
        .isInt({ min: 1 }).withMessage('El contenidoId debe ser un entero positivo.')
];

export const ResenaActualizarValidaciones = [
    ResenaValidaciones.validarCuerpo(camposActualizables),
    body('titulo')
        .optional()
        .isString().withMessage('El título debe ser texto.')
        .trim()
        .notEmpty().withMessage('El título no puede estar vacío.')
        .isLength({ max: 25 }).withMessage('El título no puede superar 25 caracteres.'),
    body('comentario')
        .optional({ nullable: true })
        .isString().withMessage('El comentario debe ser texto.'),
    body('calificacion')
        .optional()
        .custom(valor => typeof valor === 'number' && Number.isInteger(valor) && valor >= 1 && valor <= 10)
        .withMessage('La calificación debe ser un número entero entre 1 y 10.')
];
