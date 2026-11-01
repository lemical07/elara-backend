import { body, param } from 'express-validator';

const tiposPermitidos = ['like', 'dislike'];

function validarCamposPermitidos(campos) {
    return body().custom((_, { req }) => {
        const datos = req.body;
        if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
            throw new Error('El cuerpo debe ser un objeto JSON.');
        }

        const claves = Object.keys(datos);
        if (claves.length === 0 || claves.some(campo => !campos.includes(campo))) {
            throw new Error(`Envía únicamente los campos permitidos: ${campos.join(', ')}.`);
        }
        return true;
    });
}

export const ReaccionCrearValidaciones = [
    validarCamposPermitidos(['review_id', 'tipo']),
    body('review_id')
        .custom(valor => typeof valor === 'number' && Number.isInteger(valor) && valor > 0)
        .withMessage('El review_id debe ser un entero positivo.'),
    body('tipo')
        .isIn(tiposPermitidos).withMessage('El tipo debe ser like o dislike.')
];

export const ReaccionActualizarValidaciones = [
    validarCamposPermitidos(['tipo']),
    body('tipo')
        .isIn(tiposPermitidos).withMessage('El tipo debe ser like o dislike.')
];

export const ReaccionResenaIdValidaciones = [
    param('reviewId')
        .isInt({ min: 1 }).withMessage('El id de reseña debe ser un entero positivo.')
];
