import AuthService from '../services/auth.service.js';

export class AuthController {
    constructor(authService = new AuthService()) {
        this.authService = authService;
    }

    registrar = async (req, res, next) => {
        try {
            const datos = await this.authService.registrar(req.body);
            return res.status(201).json({
                exito: true,
                mensaje: 'Usuario registrado correctamente.',
                datos
            });
        } catch (error) {
            return next(error);
        }
    };

    iniciarSesion = async (req, res, next) => {
        try {
            const usuario = req.user;
            const datos = {
                usuario: this.authService.usuarioPublico(usuario),
                token: this.authService.crearToken(usuario)
            };
            return res.status(200).json({
                exito: true,
                mensaje: 'Inicio de sesión correcto.',
                datos
            });
        } catch (error) {
            return next(error);
        }
    };

    obtenerSesion = (req, res) => {
        const { id, rol_id, nombre, apellido, correo, activo, nombre_rol } = req.user;
        return res.status(200).json({
            exito: true,
            datos: { id, rol_id, nombre, apellido, correo, activo, rol: nombre_rol }
        });
    };
}
