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

    obtenerIdsIdentidad(identidad) {
        const usuarioId = identidad.usuarioId ?? null;
        const visitanteId = identidad.visitanteId ?? null;
        if (Boolean(usuarioId) === Boolean(visitanteId)) {
            throw crearError('Se requiere una sola identidad para publicar esta reseña.', 401);
        }
        return { usuarioId, visitanteId };
    }

    async crear(identidad, contenidoId, datos) {
        const { usuarioId, visitanteId } = this.obtenerIdsIdentidad(identidad);
        const contenido = await this.resenaRepositorio.buscarContenidoPorId(contenidoId);
        if (!contenido) {
            throw crearError('Contenido no encontrado.', 404);
        }
        if (contenido.estado !== 'aprobado') {
            throw crearError('El contenido aún no está disponible para recibir reseñas.', 409);
        }

        if (await this.resenaRepositorio.buscarPorIdentidadYContenido(usuarioId, visitanteId, contenidoId)) {
            throw crearError('Ya publicaste una reseña para este contenido.', 409);
        }

        const resenaDTO = new ResenaCrearDTO(datos);
        let id;
        try {
            id = await this.resenaRepositorio.crear({
                usuario_id: usuarioId,
                visitante_id: visitanteId,
                contenido_id: contenidoId,
                nombre_visitante: visitanteId ? resenaDTO.nombre_visitante : null,
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

        const resena = await this.resenaRepositorio.buscarPropiaPorId(id, usuarioId, visitanteId);
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

    async listarPropias(identidad) {
        const { usuarioId, visitanteId } = this.obtenerIdsIdentidad(identidad);
        const resenas = await this.resenaRepositorio.buscarResenasPorIdentidad(usuarioId, visitanteId);
        return resenas.map(mapearResena);
    }

    async actualizar(id, identidad, datos) {
        const { usuarioId, visitanteId } = this.obtenerIdsIdentidad(identidad);
        const propietario = await this.resenaRepositorio.buscarPropietario(id);
        if (!propietario) {
            throw crearError('Reseña no encontrada.', 404);
        }
        const propietarioId = usuarioId ? propietario.usuario_id : propietario.visitante_id;
        const identidadActual = usuarioId || visitanteId;
        if (Number(propietarioId) !== Number(identidadActual)) {
            throw crearError('No tienes permiso para modificar esta reseña.', 403);
        }

        const datosActualizar = new ResenaActualizarDTO(datos);
        await this.resenaRepositorio.actualizarPropia(id, usuarioId, visitanteId, datosActualizar.data);

        const resena = await this.resenaRepositorio.buscarPropiaPorId(id, usuarioId, visitanteId);
        if (!resena) {
            throw crearError('Reseña no encontrada.', 404);
        }
        return mapearResena(resena);
    }

    async eliminar(id, identidad) {
        const { usuarioId, visitanteId } = this.obtenerIdsIdentidad(identidad);
        const propietario = await this.resenaRepositorio.buscarPropietario(id);
        if (!propietario) {
            throw crearError('Reseña no encontrada.', 404);
        }
        const propietarioId = usuarioId ? propietario.usuario_id : propietario.visitante_id;
        const identidadActual = usuarioId || visitanteId;
        if (Number(propietarioId) !== Number(identidadActual)) {
            throw crearError('No tienes permiso para eliminar esta reseña.', 403);
        }

        const eliminada = await this.resenaRepositorio.eliminarPropia(id, usuarioId, visitanteId);
        if (!eliminada) {
            throw crearError('Reseña no encontrada.', 404);
        }
    }
}

export default new ResenaServicio();
