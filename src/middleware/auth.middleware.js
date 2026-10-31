import passport from '../config/passport.js';

export function autenticarLocal(req, res, next) {
    passport.authenticate('local', { session: false }, (error, usuario, info) => {
        if (error) {
            return next(error);
        }

        if (!usuario) {
            return res.status(401).json({
                exito: false,
                mensaje: info?.message || 'Correo o contraseña incorrectos.'
            });
        }

        req.user = usuario;
        return next();
    })(req, res, next);
}

export function autenticarJWT(req, res, next) {
    const encabezadoAutorizacion = req.headers.authorization;
    if (!encabezadoAutorizacion || !/^Bearer\s+\S+$/i.test(encabezadoAutorizacion)) {
        return res.status(401).json({
            exito: false,
            mensaje: 'Debes enviar el token en el encabezado Authorization: Bearer <token>.'
        });
    }

    passport.authenticate('jwt', { session: false }, (error, usuario, info) => {
        if (error) {
            return next(error);
        }

        if (!usuario) {
            return res.status(401).json({
                exito: false,
                mensaje: info?.message || 'Token inválido, expirado o asociado a un usuario inactivo.'
            });
        }

        req.user = usuario;
        return next();
    })(req, res, next);
}

export function autorizarAdmin(req, res, next) {
    const usuario = req.user;
    if (!usuario) {
        return res.status(401).json({
            exito: false,
            mensaje: 'Debes autenticarte para acceder a este recurso.'
        });
    }

    const rolActual = usuario.nombre_rol?.trim().toLowerCase();
    if (rolActual !== 'admin' && rolActual !== 'administrador') {
        return res.status(403).json({
            exito: false,
            mensaje: 'Acceso prohibido. Se requieren privilegios de administrador.'
        });
    }

    return next();
}

export const verificarToken = autenticarJWT;
export const verificarAdmin = autorizarAdmin;
