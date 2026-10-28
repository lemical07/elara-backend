export function rutaNoEncontrada(req, res) {
    return res.status(404).json({
        error: "Ruta no encontrada",
        metodo: req.method,
        url: req.originalUrl
    });
}

export function manejarError(error, req, res, next) {
    console.error("[API Error]", error);
    const status = error.statusCode || error.status || 500;

    return res.status(status).json({
        error: status >= 500
            ? "Error interno del servidor"
            : error.message || "Error en la solicitud",
        errores: status >= 500
            ? null
            : error.details || null
    });
}
