import reviewRepository from '../repositories/review.repository.js';
import ReviewCreateDto from '../dtos/review.create.dto.js';
import ReviewReadDto from '../dtos/review.read.dto.js';
import ReviewUpdateDto from '../dtos/review.update.dto.js';

function crearError(mensaje, status) {
    const error = new Error(mensaje);
    error.status = status;
    return error;
}

function mapearResena(resena) {
    return new ReviewReadDto(resena).data;
}

export class ReviewService {
    constructor(repository = reviewRepository) {
        this.reviewRepository = repository;
    }

    async crear(usuarioId, contenidoId, datos) {
        const contenido = await this.reviewRepository.buscarContenidoPorId(contenidoId);
        if (!contenido) {
            throw crearError('Contenido no encontrado.', 404);
        }
        if (contenido.estado !== 'aprobado') {
            throw crearError('El contenido aún no está disponible para recibir reseñas.', 409);
        }

        if (await this.reviewRepository.buscarPorUsuarioYContenido(usuarioId, contenidoId)) {
            throw crearError('Ya publicaste una reseña para este contenido.', 409);
        }

        const resenaDto = new ReviewCreateDto(datos);
        let id;
        try {
            id = await this.reviewRepository.crear({
                usuario_id: usuarioId,
                contenido_id: contenidoId,
                ...resenaDto.data
            });
        } catch (cause) {
            if (cause.code === 'ER_DUP_ENTRY') {
                throw crearError('Ya publicaste una reseña para este contenido.', 409);
            }
            throw cause;
        }

        const resena = await this.reviewRepository.buscarPropiaPorId(id, usuarioId);
        if (!resena) {
            throw new Error('No fue posible recuperar la reseña recién creada.');
        }
        return mapearResena(resena);
    }

    async listarPorContenido(contenidoId) {
        if (!(await this.reviewRepository.buscarContenidoAprobadoPorId(contenidoId))) {
            throw crearError('Contenido no encontrado.', 404);
        }
        const resenas = await this.reviewRepository.buscarResenasPorContenido(contenidoId);
        return resenas.map(mapearResena);
    }

    async obtenerPorId(id) {
        const resena = await this.reviewRepository.buscarPorIdVisible(id);
        if (!resena) {
            throw crearError('Reseña no encontrada.', 404);
        }
        return mapearResena(resena);
    }

    async listarPropias(usuarioId) {
        const resenas = await this.reviewRepository.buscarResenasPorUsuario(usuarioId);
        return resenas.map(mapearResena);
    }

    async actualizar(id, usuarioId, datos) {
        const propietario = await this.reviewRepository.buscarPropietario(id);
        if (!propietario) {
            throw crearError('Reseña no encontrada.', 404);
        }
        if (Number(propietario.usuario_id) !== Number(usuarioId)) {
            throw crearError('No tienes permiso para modificar esta reseña.', 403);
        }

        const datosActualizar = new ReviewUpdateDto(datos);
        await this.reviewRepository.actualizarPropia(id, usuarioId, datosActualizar.data);

        const resena = await this.reviewRepository.buscarPropiaPorId(id, usuarioId);
        if (!resena) {
            throw crearError('Reseña no encontrada.', 404);
        }
        return mapearResena(resena);
    }

    async eliminar(id, usuarioId) {
        const propietario = await this.reviewRepository.buscarPropietario(id);
        if (!propietario) {
            throw crearError('Reseña no encontrada.', 404);
        }
        if (Number(propietario.usuario_id) !== Number(usuarioId)) {
            throw crearError('No tienes permiso para eliminar esta reseña.', 403);
        }

        const eliminada = await this.reviewRepository.eliminarPropia(id, usuarioId);
        if (!eliminada) {
            throw crearError('Reseña no encontrada.', 404);
        }
    }
}

export default new ReviewService();
