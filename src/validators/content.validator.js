import { body, param, query } from 'express-validator';

const camposContenido = new Set([
    'categoria_id',
    'titulo',
    'tipo',
    'descripcion',
    'anio',
    'director',
    'url_imagen',
    'url_trailer'
]);
const tiposPermitidos = ['pelicula', 'serie', 'anime'];

class ContenidoValidaciones {
    static validarCuerpo() {
        return body().custom((_, { req }) => {
            const datos = req.body;
            if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
                throw new Error('El cuerpo debe ser un objeto JSON.');
            }
            const claves = Object.keys(datos);
            if (claves.length === 0 || claves.some(campo => !camposContenido.has(campo))) {
                throw new Error(`Envía únicamente los campos permitidos: ${[...camposContenido].join(', ')}.`);
            }
            return true;
        });
    }

    static validarCamposObligatorios() {
        return body().custom((_, { req }) => {
            if (camposObligatorios.some(campo => !Object.hasOwn(req.body, campo))) {
                throw new Error('Para reemplazar el contenido envía categoria_id, titulo, tipo y anio.');
            }
            return true;
        });
    }

    static validarCuerpoPersonaje() {
        return body().custom((_, { req }) => {
            const datos = req.body;
            if (!datos || typeof datos !== 'object' || Array.isArray(datos) ||
                Object.keys(datos).length !== 2 ||
                !Object.hasOwn(datos, 'nombre') ||
                !Object.hasOwn(datos, 'tipo')) {
                throw new Error('Envía únicamente nombre y tipo.');
            }
            return true;
        });
    }
}

export const ContenidoIdValidaciones = [
    param('id')
        .isInt({ min: 1 }).withMessage('El id de contenido debe ser un entero positivo.')
];

export const PersonajeIdValidaciones = [
    ...ContenidoIdValidaciones,
    param('personajeId')
        .isInt({ min: 1 }).withMessage('El id del personaje debe ser un entero positivo.')
];

export const ContenidoCatalogoValidaciones = [
    query('titulo').optional().isString().trim().isLength({ max: 50 })
        .withMessage('El filtro titulo debe ser texto de hasta 50 caracteres.'),
    query('tipo').optional().isIn(tiposPermitidos)
        .withMessage('El tipo debe ser pelicula, serie o anime.'),
    query('categoria').optional().isString().trim().notEmpty()
        .withMessage('La categoría debe ser texto no vacío.'),
    query('anio').optional().isInt({ min: 1901, max: 2155 }).toInt()
        .withMessage('El año debe ser un entero entre 1901 y 2155.'),
    query('orden').optional().isIn(['anio_desc', 'anio_asc', 'titulo_asc', 'titulo_desc'])
        .withMessage('El orden solicitado no está permitido.')
];

const camposObligatorios = ['categoria_id', 'titulo', 'tipo', 'anio'];
const validacionesCamposContenido = [
    body('categoria_id')
        .isInt({ min: 1 }).withMessage('El categoria_id debe ser un entero positivo.')
        .toInt(),
    body('titulo')
        .isString().withMessage('El título debe ser texto.')
        .trim()
        .notEmpty().withMessage('El título es obligatorio.')
        .isLength({ max: 50 }).withMessage('El título no puede superar 50 caracteres.'),
    body('tipo').isIn(tiposPermitidos)
        .withMessage('El tipo debe ser pelicula, serie o anime.'),
    body('descripcion').optional({ nullable: true })
        .isString().withMessage('La descripción debe ser texto.'),
    body('anio')
        .isInt({ min: 1901, max: 2155 }).withMessage('El año debe ser un entero entre 1901 y 2155.')
        .toInt(),
    body('director').optional({ nullable: true }).isString().trim().isLength({ max: 150 })
        .withMessage('El director debe ser texto de hasta 150 caracteres.'),
    body('url_imagen').optional({ nullable: true }).isURL({ require_protocol: true }).isLength({ max: 500 })
        .withMessage('La url_imagen debe ser válida y no superar 500 caracteres.'),
    body('url_trailer').optional({ nullable: true }).isURL({ require_protocol: true }).isLength({ max: 500 })
        .withMessage('La url_trailer debe ser válida y no superar 500 caracteres.')
];

export const ContenidoCrearValidaciones = [
    ContenidoValidaciones.validarCuerpo(),
    ...validacionesCamposContenido
];

export const ContenidoActualizarValidaciones = [
    ...ContenidoIdValidaciones,
    ContenidoValidaciones.validarCuerpo(),
    ...validacionesCamposContenido,
    ContenidoValidaciones.validarCamposObligatorios()
];

export const PersonajeCrearValidaciones = [
    ...ContenidoIdValidaciones,
    ContenidoValidaciones.validarCuerpoPersonaje(),
    body('nombre').isString().trim().notEmpty().isLength({ max: 100 })
        .withMessage('El nombre es obligatorio y no puede superar 100 caracteres.'),
    body('tipo').isIn(['principal', 'secundario'])
        .withMessage('El tipo debe ser principal o secundario.')
];

export const PersonajeActualizarValidaciones = [
    ...PersonajeIdValidaciones,
    ...PersonajeCrearValidaciones.slice(1)
];
