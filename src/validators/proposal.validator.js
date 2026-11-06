import { body, param } from 'express-validator';

const camposPermitidos = new Set([
    'titulo',
    'descripcion',
    'anio',
    'tipo',
    'categoria_id',
    'director',
    'url_imagen',
    'url_trailer'
]);
const tiposPermitidos = ['pelicula', 'serie', 'anime'];

class PropuestaValidaciones {
    static validarCamposPermitidos() {
        return body().custom((_, { req }) => {
            const datos = req.body;
            if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
                throw new Error('El cuerpo debe ser un objeto JSON.');
            }

            const claves = Object.keys(datos);
            if (claves.length === 0 || claves.some(campo => !camposPermitidos.has(campo))) {
                throw new Error(`Envía únicamente los campos permitidos: ${[...camposPermitidos].join(', ')}.`);
            }
            return true;
        });
    }

    static validarEstado() {
        return body().custom((_, { req }) => {
            const datos = req.body;
            if (
                !datos ||
                typeof datos !== 'object' ||
                Array.isArray(datos) ||
                Object.keys(datos).length !== 1 ||
                !Object.hasOwn(datos, 'estado')
            ) {
                throw new Error('Envía únicamente el campo estado.');
            }
            return true;
        });
    }
}

export const PropuestaCrearValidaciones = [
    PropuestaValidaciones.validarCamposPermitidos(),
    body('titulo')
        .isString().withMessage('El título debe ser texto.')
        .trim()
        .notEmpty().withMessage('El título es obligatorio.')
        .isLength({ max: 50 }).withMessage('El título no puede superar 50 caracteres.'),
    body('descripcion')
        .isString().withMessage('La descripción debe ser texto.')
        .trim()
        .notEmpty().withMessage('La descripción es obligatoria.'),
    body('anio')
        .isInt({ min: 1901, max: 2155 }).withMessage('El año debe ser un entero entre 1901 y 2155.')
        .toInt(),
    body('tipo')
        .isIn(tiposPermitidos).withMessage('El tipo debe ser pelicula, serie o anime.'),
    body('categoria_id')
        .isInt({ min: 1 }).withMessage('El categoria_id debe ser un entero positivo.')
        .toInt(),
    body('director')
        .optional({ nullable: true })
        .isString().withMessage('El director debe ser texto.')
        .trim()
        .isLength({ max: 150 }).withMessage('El director no puede superar 150 caracteres.'),
    body('url_imagen')
        .optional({ nullable: true })
        .isURL({ require_protocol: true }).withMessage('La url_imagen debe ser una URL válida.')
        .isLength({ max: 500 }).withMessage('La url_imagen no puede superar 500 caracteres.'),
    body('url_trailer')
        .optional({ nullable: true })
        .isURL({ require_protocol: true }).withMessage('La url_trailer debe ser una URL válida.')
        .isLength({ max: 500 }).withMessage('La url_trailer no puede superar 500 caracteres.')
];

export const PropuestaIdValidaciones = [
    param('id')
        .isInt({ min: 1 }).withMessage('El id debe ser un entero positivo.')
];

export const PropuestaEstadoValidaciones = [
    PropuestaValidaciones.validarEstado(),
    body('estado')
        .isIn(['aprobado', 'rechazado']).withMessage('El estado debe ser aprobado o rechazado.')
];
