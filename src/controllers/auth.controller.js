import AutenticacionServicio from '../services/auth.service.js';

export class AutenticacionControlador {
    constructor(servicioAutenticacion = new AutenticacionServicio()) {
        this.servicioAutenticacion = servicioAutenticacion;
    }

    registrar = async (req, res, next) => {
        try {
            if (
                process.env.NODE_ENV === 'production' &&
                req.secure !== true
            ) {
                const error = new Error('El registro de cuentas requiere una conexión HTTPS.');
                error.status = 426;
                throw error;
            }
            const datos = await this.servicioAutenticacion.registrar(req.body);
            if (datos.primer_administrador === true) {
                res.set('Cache-Control', 'no-store, private');
            }
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
                usuario: this.servicioAutenticacion.usuarioPublico(usuario),
                token: this.servicioAutenticacion.crearToken(usuario)
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
