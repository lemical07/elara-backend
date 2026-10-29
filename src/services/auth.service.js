import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usuarioRepository from '../repositories/user.repository.js';

const ROL_USUARIO_NOMBRE = 'Usuario';

class AuthService {
    constructor(repository = usuarioRepository) {
        this.usuarioRepository = repository;
    }

    async registrar({ nombre, apellido, correo, contrasena } = {}) {
        const datos = {
            nombre: typeof nombre === 'string' ? nombre.trim() : '',
            apellido: typeof apellido === 'string' ? apellido.trim() : '',
            correo: typeof correo === 'string' ? correo.trim().toLowerCase() : '',
            contrasena
        };

        if (!datos.nombre || !datos.apellido || !datos.correo || typeof datos.contrasena !== 'string') {
            throw this.crearError('nombre, apellido, correo y contrasena son obligatorios.', 400);
        }

        if (datos.nombre.length > 60 || datos.apellido.length > 60) {
            throw this.crearError('El nombre y el apellido no pueden superar 60 caracteres.', 400);
        }

        if (datos.correo.length > 150 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(datos.correo)) {
            throw this.crearError('Debes proporcionar un correo electrónico válido.', 400);
        }

        if (datos.contrasena.length < 8 || Buffer.byteLength(datos.contrasena, 'utf8') > 72) {
            throw this.crearError('La contraseña debe tener al menos 8 caracteres y un máximo de 72 bytes.', 400);
        }

        const usuarioExistente = await this.usuarioRepository.buscarPorCorreo(datos.correo);
        if (usuarioExistente) {
            throw this.crearError('El correo electrónico ya está registrado.', 409);
        }

        const rolUsuario = await this.usuarioRepository.buscarRolPorNombre(ROL_USUARIO_NOMBRE);
        if (!rolUsuario) {
            throw this.crearError('No está configurado el rol Usuario para registrar cuentas.', 503);
        }

        const contrasenaHash = await bcrypt.hash(datos.contrasena, 10);
        const usuarioCreado = await this.usuarioRepository.crear({
            rol_id: rolUsuario.id,
            nombre: datos.nombre,
            apellido: datos.apellido,
            correo: datos.correo,
            contrasena: contrasenaHash
        });
        const usuario = await this.usuarioRepository.buscarPorIdConRol(usuarioCreado.id);

        if (!usuario) {
            throw new Error('No fue posible recuperar el usuario recién registrado.');
        }

        return {
            usuario: this.usuarioPublico(usuario),
            token: this.crearToken(usuario)
        };
    }

    usuarioPublico(usuario) {
        const { id, rol_id, nombre, apellido, correo, activo, nombre_rol } = usuario;
        return { id, rol_id, nombre, apellido, correo, activo, rol: nombre_rol };
    }

    crearToken(usuario) {
        const secreto = process.env.JWT_SECRET;
        if (!secreto) {
            throw new Error('La variable de entorno JWT_SECRET no está configurada.');
        }

        return jwt.sign(
            { id: usuario.id },
            secreto,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );
    }

    crearError(mensaje, status) {
        const error = new Error(mensaje);
        error.status = status;
        return error;
    }
}

export default AuthService;
