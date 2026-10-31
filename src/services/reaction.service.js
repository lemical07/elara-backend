import reactionRepository from '../repositories/reaction.repository.js';
import ReactionCreateDto from '../dtos/reaction.create.dto.js';
import ReactionReadDto from '../dtos/reaction.read.dto.js';
import ReactionSummaryDto from '../dtos/reaction.summary.dto.js';
import ReactionUpdateDto from '../dtos/reaction.update.dto.js';

function crearError(mensaje, status) {
    const error = new Error(mensaje);
    error.status = status;
    return error;
}

function mapearReaccion(reaccion) {
    return new ReactionReadDto(reaccion).data;
}

export class ReactionService {
    constructor(repository = reactionRepository) {
        this.reactionRepository = repository;
    }

    async verificarResena(reviewId, usuarioId) {
        const resena = await this.reactionRepository.buscarResenaVisible(reviewId);
        if (!resena) {
            throw crearError('Reseña no encontrada.', 404);
        }
        if (usuarioId !== undefined && Number(resena.usuario_id) === Number(usuarioId)) {
            throw crearError('No puedes reaccionar a tu propia reseña.', 403);
        }
        return resena;
    }

    async registrar(usuarioId, datos) {
        const datosReaccion = new ReactionCreateDto(datos).data;
        await this.verificarResena(datosReaccion.review_id, usuarioId);

        const resultado = await this.reactionRepository.registrarOActualizar(
            usuarioId,
            datosReaccion.review_id,
            datosReaccion.tipo
        );

        return {
            creada: resultado.creada,
            mensaje: resultado.creada
                ? 'Reacción registrada correctamente.'
                : resultado.cambio
                    ? 'Reacción actualizada correctamente.'
                    : 'La reacción ya tenía ese tipo; no hubo cambios.',
            datos: mapearReaccion(datosReaccion)
        };
    }

    async actualizar(usuarioId, reviewId, datos) {
        await this.verificarResena(reviewId, usuarioId);

        const reaccionActual = await this.reactionRepository.buscarPropia(usuarioId, reviewId);
        if (!reaccionActual) {
            throw crearError('No tienes una reacción para esta reseña.', 404);
        }

        const actualizacion = new ReactionUpdateDto(datos).data;
        const cambio = await this.reactionRepository.actualizarPropia(
            usuarioId,
            reviewId,
            actualizacion.tipo
        );
        if (!cambio && !(await this.reactionRepository.buscarPropia(usuarioId, reviewId))) {
            throw crearError('No tienes una reacción para esta reseña.', 404);
        }

        return {
            mensaje: cambio
                ? 'Reacción actualizada correctamente.'
                : 'La reacción ya tenía ese tipo; no hubo cambios.',
            datos: mapearReaccion({ review_id: reviewId, tipo: actualizacion.tipo })
        };
    }

    async eliminar(usuarioId, reviewId) {
        await this.verificarResena(reviewId, usuarioId);

        const eliminada = await this.reactionRepository.eliminarPropia(usuarioId, reviewId);
        if (!eliminada) {
            throw crearError('No tienes una reacción para esta reseña.', 404);
        }
    }

    async obtenerTotales(reviewId) {
        await this.verificarResena(reviewId);
        const totales = await this.reactionRepository.obtenerTotales(reviewId);
        return new ReactionSummaryDto(totales).data;
    }

    async listarPropias(usuarioId) {
        const reacciones = await this.reactionRepository.listarPropias(usuarioId);
        return reacciones.map(reaccion => new ReactionReadDto(reaccion).data);
    }
}

export default new ReactionService();
