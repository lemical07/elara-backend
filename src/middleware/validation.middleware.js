import { validationResult } from 'express-validator';

export function validarSolicitud(req, res, next) {
    const errores = validationResult(req);
    if (errores.isEmpty()) {
        return next();
    }

    return res.status(400).json({
        exito: false,
        mensaje: 'La solicitud contiene datos inválidos.',
        errores: errores.array().map(({ path, msg }) => ({ campo: path, mensaje: msg }))
    });
}
