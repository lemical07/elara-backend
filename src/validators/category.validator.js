import { body, param } from 'express-validator';

const camposPermitidos = new Set(['nombre', 'descripcion']);

const validarCuerpoCategoria = body().custom((_, { req }) => {
    const datos = req.body;
    if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
        throw new Error('El cuerpo debe ser un objeto JSON.');
    }

    const campos = Object.keys(datos);
    if (campos.length === 0 || campos.some(campo => !camposPermitidos.has(campo))) {
        throw new Error('Envía únicamente los campos nombre y descripcion.');
    }
    return true;
});

export const CategoriaIdValidaciones = [
    param('id')
        .isInt({ min: 1 }).withMessage('El id debe ser un entero positivo.')
];

export const CategoriaCrearValidaciones = [
    validarCuerpoCategoria,
    body('nombre')
        .isString().withMessage('El nombre debe ser texto.')
        .trim()
        .notEmpty().withMessage('El nombre es obligatorio.')
        .isLength({ max: 50 }).withMessage('El nombre no puede superar 50 caracteres.'),
    body('descripcion')
        .optional({ nullable: true })
        .isString().withMessage('La descripción debe ser texto.')
];

export const CategoriaActualizarValidaciones = [
    ...CategoriaIdValidaciones,
    ...CategoriaCrearValidaciones
];
