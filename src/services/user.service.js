import bcrypt from "bcrypt";

import usuarioRepository from '../repositories/user.repository.js';
import UsuarioCrearDTO from '../dtos/user.create.dto.js';
import UsuarioObtenerDTO from '../dtos/user.read.dto.js';
import UsuarioActualizarDTO from '../dtos/user.update.dto.js';

class UsuarioService {
    async obtenerTodos() {
        const usuarios = await usuarioRepository.obtenerTodos();
        return usuarios.map(usuario => new UsuarioObtenerDTO(usuario).data);
    }

    async obtenerPorId(id) {
        const usuario = await usuarioRepository.buscarPorId(id);
        if (!usuario) {
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;
        }
        return new UsuarioObtenerDTO(usuario).data;
    }

    
async crear(datos) {
    const usuarioDTO = new UsuarioCrearDTO(datos);
    const usuarioExistente = await usuarioRepository.buscarPorCorreo(usuarioDTO.correo);

    if (usuarioExistente) {
        const error = new Error("El correo electrónico ya está registrado");
        error.status = 409;
        throw error;
    }
//hasheo de contraseña 
    const contrasenaHash = await bcrypt.hash(usuarioDTO.contrasena,10);

//enviamos al repo unicamente contraseña hasheada
    const usuario = await usuarioRepository.crear({
        rol_id: usuarioDTO.rol_id,
        nombre: usuarioDTO.nombre,
        apellido: usuarioDTO.apellido,
        correo: usuarioDTO.correo,
        contrasena: contrasenaHash
    });

    return new UsuarioObtenerDTO(usuario).data;
}


    async actualizar(id, datos) {
        const usuarioExistente = await usuarioRepository.buscarPorId(id);
        if (!usuarioExistente) {
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;
        }
        const usuarioDTO = new UsuarioActualizarDTO(datos);
        const datosActualizar = usuarioDTO.data;

        if (Object.keys(datosActualizar).length === 0) {
            const error = new Error("Debes proporcionar al menos un campo para actualizar");
            error.status = 400;
            throw error;
        }

        const datosCompletos = {
            nombre: datosActualizar.nombre ?? usuarioExistente.nombre,
            apellido: datosActualizar.apellido ?? usuarioExistente.apellido,
            correo: datosActualizar.correo ?? usuarioExistente.correo.toLowerCase()
        };

        if (datosCompletos.correo !== usuarioExistente.correo.toLowerCase()){
            const correoExistente = await usuarioRepository.buscarPorCorreo(datosActualizar.correo);
            if (correoExistente && correoExistente.id !== Number(id)) {
                const error = new Error("El correo electrónico ya está registrado");
                error.status = 409;
                throw error;
            }
        }

        try {
            const usuarioActualizado = await usuarioRepository.actualizar(id, datosCompletos);
            if (!usuarioActualizado) {
                const error = new Error("Usuario no encontrado");
                error.status = 404;
                throw error;
            }
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                const conflicto = new Error("El correo electrónico ya está registrado");
                conflicto.status = 409;
                throw conflicto;
            }
            throw error;
        }

        return this.obtenerPorId(id);
    }

    async actualizarPerfil(id, datos) {
        return this.actualizar(id, datos);
    }

    async cambiarContrasena(id, { contrasena_actual, contrasena_nueva } = {}) {
        if (typeof contrasena_actual !== 'string' || typeof contrasena_nueva !== 'string') {
            const error = new Error("Debes proporcionar la contraseña actual y la nueva contraseña.");
            error.status = 400;
            throw error;
        }

        if (
            contrasena_nueva.length < 8 ||
            Buffer.byteLength(contrasena_nueva, 'utf8') > 72
        ) {
            const error = new Error("La nueva contraseña debe tener al menos 8 caracteres y un máximo de 72 bytes.");
            error.status = 400;
            throw error;
        }

        const usuario = await usuarioRepository.buscarPorIdConContrasena(id);
        if (!usuario || !usuario.activo) {
            const error = new Error("Usuario no encontrado o inactivo.");
            error.status = 404;
            throw error;
        }

        if (!(await bcrypt.compare(contrasena_actual, usuario.contrasena))) {
            const error = new Error("La contraseña actual es incorrecta.");
            error.status = 401;
            throw error;
        }

        const hash = await bcrypt.hash(contrasena_nueva, 10);
        const actualizado = await usuarioRepository.actualizarContrasena(id, hash);
        if (!actualizado) {
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;
        }

        return { mensaje: "Contraseña actualizada correctamente." };
    }

    async desactivarCuenta(id) {
        const usuario = await usuarioRepository.actualizarEstado(id, false);
        if (!usuario) {
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;
        }

        return { id: usuario.id, mensaje: "Cuenta desactivada correctamente." };
    }

    async actualizarEstado(id, activo) {
        const usuario = await usuarioRepository.buscarPorId(id);
        if (!usuario) {
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;
        }

        await usuarioRepository.actualizarEstado(id, activo);
        return this.obtenerPorId(id);
    }

    async eliminar(id) {
        const usuario = await usuarioRepository.buscarPorId(id);
        if (!usuario) {
            const error = new Error("Usuario no encontrado");
            error.status = 404;
            throw error;
        }
        
        await usuarioRepository.eliminar(id);

        return {
            id,
            mensaje: "Usuario eliminado correctamente"
        };
    }
}

export default new UsuarioService();
