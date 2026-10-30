import usuarioService from '../services/user.service.js';

export class UsuarioController {
    constructor(service = usuarioService) {
        this.usuarioService = service;
    }

    obtenerMiPerfil = async (req, res, next) => {
        try {
            const usuario = await this.usuarioService.obtenerPorId(req.user.id);
            return res.status(200).json({ exito: true, datos: usuario });
        } catch (error) {
            return next(error);
        }
    };

    actualizarMiPerfil = async (req, res, next) => {
        try {
            const usuario = await this.usuarioService.actualizarPerfil(req.user.id, req.body);
            return res.status(200).json({
                exito: true,
                mensaje: 'Perfil actualizado correctamente.',
                datos: usuario
            });
        } catch (error) {
            return next(error);
        }
    };

    cambiarMiContrasena = async (req, res, next) => {
        try {
            const resultado = await this.usuarioService.cambiarContrasena(req.user.id, req.body);
            return res.status(200).json({ exito: true, ...resultado });
        } catch (error) {
            return next(error);
        }
    };

    desactivarMiCuenta = async (req, res, next) => {
        try {
            const resultado = await this.usuarioService.desactivarCuenta(req.user.id);
            return res.status(200).json({ exito: true, ...resultado });
        } catch (error) {
            return next(error);
        }
    };

    obtenerUsuarios = async (req, res, next) => {
        try {
            const usuarios = await this.usuarioService.obtenerTodos();
            return res.status(200).json({ exito: true, datos: usuarios });
        } catch (error) {
            return next(error);
        }
    };

    obtenerUsuario = async (req, res, next) => {
        try {
            const usuario = await this.usuarioService.obtenerPorId(req.params.id);
            return res.status(200).json({ exito: true, datos: usuario });
        } catch (error) {
            return next(error);
        }
    };

    actualizarUsuario = async (req, res, next) => {
        try {
            const usuario = await this.usuarioService.actualizar(req.params.id, req.body);
            return res.status(200).json({
                exito: true,
                mensaje: 'Usuario actualizado correctamente.',
                datos: usuario
            });
        } catch (error) {
            return next(error);
        }
    };

    actualizarEstadoUsuario = async (req, res, next) => {
        try {
            const usuario = await this.usuarioService.actualizarEstado(req.params.id, req.body.activo);
            return res.status(200).json({
                exito: true,
                mensaje: 'Estado del usuario actualizado correctamente.',
                datos: usuario
            });
        } catch (error) {
            return next(error);
        }
    };
}
