import visitanteServicio from '../services/visitor.service.js';

const nombreCookieVisitante = 'elara_visitante';
const duracionCookieVisitante = 365 * 24 * 60 * 60 * 1000;

export async function identificarVisitante(req, res, next) {
    if (req.user) {
        return next();
    }

    try {
        const resultado = await visitanteServicio.obtenerOCrear(req.cookies?.[nombreCookieVisitante]);
        req.visitante = resultado.visitante;

        if (resultado.creado) {
            res.cookie(nombreCookieVisitante, resultado.visitante.token, {
                httpOnly: true,
                secure: req.secure,
                sameSite: 'lax',
                maxAge: duracionCookieVisitante,
                path: '/'
            });
        }

        return next();
    } catch (error) {
        return next(error);
    }
}
