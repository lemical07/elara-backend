import bcrypt from "bcrypt";

import usuarioRepository from '../repositories/user.repository.js';
import UsuarioCrearDTO from '../dtos/user.create.dto.js';
import UsuarioObtenerDTO from '../dtos/user.create.dto.js';
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

        if (datosActualizar.correo && datosActualizar.correo !== usuarioExistente.correo){
            const correoExistente = await usuarioRepository.buscarPorCorreo(datosActualizar.correo);
            if (correoExistente) {
                const error = new Error("El correo electrónico ya está registrado");
                error.status = 409;
                throw error;
            }
        }
        await usuarioRepository.actualizar(id, datosActualizar);
        return this.obtenerPorId(id);
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
