import resenaRepositorio from '../repositories/review.repository.js';
import ResenaCrearDTO from '../dtos/review.create.dto.js';
import ResenaObtenerDTO from '../dtos/review.read.dto.js';
import ResenaActualizarDTO from '../dtos/review.update.dto.js';

function crearError(mensaje, status) {
    const error = new Error(mensaje);
    error.status = status;
    return error;
}

function mapearResena(resena) {
    return new ResenaObtenerDTO(resena).data;
}

export class ResenaServicio {
    constructor(repositorio = resenaRepositorio) {
        this.resenaRepositorio = repositorio;
    }

    async crear(usuarioId, contenidoId, datos) {
        const contenido = await this.resenaRepositorio.buscarContenidoPorId(contenidoId);
        if (!contenido) {
            throw crearError('Contenido no encontrado.', 404);
        }
        if (contenido.estado !== 'aprobado') {
            throw crearError('El contenido aún no está disponible para recibir reseñas.', 409);
        }

        if (await this.resenaRepositorio.buscarPorUsuarioYContenido(usuarioId, contenidoId)) {
            throw crearError('Ya publicaste una reseña para este contenido.', 409);
        }

        const resenaDTO = new ResenaCrearDTO(datos);
        let id;
        try {
            id = await this.resenaRepositorio.crear({
                usuario_id: usuarioId,
                contenido_id: contenidoId,
                titulo: resenaDTO.titulo,
                comentario: resenaDTO.comentario,
                calificacion: resenaDTO.calificacion
            });
        } catch (causa) {
            if (causa.code === 'ER_DUP_ENTRY') {
                throw crearError('Ya publicaste una reseña para este contenido.', 409);
            }
            throw causa;
        }

        const resena = await this.resenaRepositorio.buscarPropiaPorId(id, usuarioId);
        if (!resena) {
            throw new Error('No fue posible recuperar la reseña recién creada.');
        }
        return mapearResena(resena);
    }

    async listarPorContenido(contenidoId) {
        if (!(await this.resenaRepositorio.buscarContenidoAprobadoPorId(contenidoId))) {
            throw crearError('Contenido no encontrado.', 404);
        }
        const resenas = await this.resenaRepositorio.buscarResenasPorContenido(contenidoId);
        return resenas.map(mapearResena);
    }

    async obtenerPorId(id) {
        const resena = await this.resenaRepositorio.buscarPorIdVisible(id);
        if (!resena) {
            throw crearError('Reseña no encontrada.', 404);
        }
        return mapearResena(resena);
    }

    async listarPropias(usuarioId) {
        const resenas = await this.resenaRepositorio.buscarResenasPorUsuario(usuarioId);
        return resenas.map(mapearResena);
    }

    async actualizar(id, usuarioId, datos) {
        const propietario = await this.resenaRepositorio.buscarPropietario(id);
        if (!propietario) {
            throw crearError('Reseña no encontrada.', 404);
        }
        if (Number(propietario.usuario_id) !== Number(usuarioId)) {
            throw crearError('No tienes permiso para modificar esta reseña.', 403);
        }

        const datosActualizar = new ResenaActualizarDTO(datos);
        await this.resenaRepositorio.actualizarPropia(id, usuarioId, datosActualizar.data);

        const resena = await this.resenaRepositorio.buscarPropiaPorId(id, usuarioId);
        if (!resena) {
            throw crearError('Reseña no encontrada.', 404);
        }
        return mapearResena(resena);
    }

    async eliminar(id, usuarioId) {
        const propietario = await this.resenaRepositorio.buscarPropietario(id);
        if (!propietario) {
            throw crearError('Reseña no encontrada.', 404);
        }
        if (Number(propietario.usuario_id) !== Number(usuarioId)) {
            throw crearError('No tienes permiso para eliminar esta reseña.', 403);
        }

        const eliminada = await this.resenaRepositorio.eliminarPropia(id, usuarioId);
        if (!eliminada) {
            throw crearError('Reseña no encontrada.', 404);
        }
    }
}

export default new ResenaServicio();
