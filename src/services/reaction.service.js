import reaccionRepositorio from '../repositories/reaction.repository.js';
import ReaccionCrearDTO from '../dtos/reaction.create.dto.js';
import ReaccionObtenerDTO from '../dtos/reaction.read.dto.js';
import ReaccionResumenDTO from '../dtos/reaction.summary.dto.js';
import ReaccionActualizarDTO from '../dtos/reaction.update.dto.js';

function crearError(mensaje, status) {
    const error = new Error(mensaje);
    error.status = status;
    return error;
}

function mapearReaccion(reaccion) {
    return new ReaccionObtenerDTO(reaccion).data;
}

export class ReaccionServicio {
    constructor(repositorio = reaccionRepositorio) {
        this.reaccionRepositorio = repositorio;
    }

    obtenerIdsIdentidad(identidad) {
        const usuarioId = identidad.usuarioId ?? null;
        const visitanteId = identidad.visitanteId ?? null;
        if (Boolean(usuarioId) === Boolean(visitanteId)) {
            throw crearError('Se requiere una sola identidad para esta operación.', 401);
        }
        return { usuarioId, visitanteId };
    }

    async verificarResena(resenaId, usuarioId) {
        const resena = await this.reaccionRepositorio.buscarResenaVisible(resenaId);
        if (!resena) {
            throw crearError('Reseña no encontrada.', 404);
        }
        if (usuarioId !== null && usuarioId !== undefined &&
            Number(resena.usuario_id) === Number(usuarioId)) {
            throw crearError('No puedes reaccionar a tu propia reseña.', 403);
        }
        return resena;
    }

    async registrar(identidad, datos) {
        const { usuarioId, visitanteId } = this.obtenerIdsIdentidad(identidad);
        const reaccionDTO = new ReaccionCrearDTO(datos);
        await this.verificarResena(reaccionDTO.review_id, usuarioId);

        const resultado = await this.reaccionRepositorio.registrarOActualizar(
            usuarioId,
            visitanteId,
            reaccionDTO.review_id,
            reaccionDTO.tipo
        );

        return {
            creada: resultado.creada,
            mensaje: resultado.creada
                ? 'Reacción registrada correctamente.'
                : resultado.cambio
                    ? 'Reacción actualizada correctamente.'
                    : 'La reacción ya tenía ese tipo; no hubo cambios.',
            datos: mapearReaccion(reaccionDTO)
        };
    }

    async actualizar(identidad, resenaId, datos) {
        const { usuarioId, visitanteId } = this.obtenerIdsIdentidad(identidad);
        await this.verificarResena(resenaId, usuarioId);

        const reaccionActual = await this.reaccionRepositorio.buscarPropia(usuarioId, visitanteId, resenaId);
        if (!reaccionActual) {
            throw crearError('No tienes una reacción para esta reseña.', 404);
        }

        const actualizacion = new ReaccionActualizarDTO(datos).data;
        const cambio = await this.reaccionRepositorio.actualizarPropia(
            usuarioId,
            visitanteId,
            resenaId,
            actualizacion.tipo
        );
        if (!cambio && !(await this.reaccionRepositorio.buscarPropia(usuarioId, visitanteId, resenaId))) {
            throw crearError('No tienes una reacción para esta reseña.', 404);
        }

        return {
            mensaje: cambio
                ? 'Reacción actualizada correctamente.'
                : 'La reacción ya tenía ese tipo; no hubo cambios.',
            datos: mapearReaccion({ review_id: resenaId, tipo: actualizacion.tipo })
        };
    }

    async eliminar(identidad, resenaId) {
        const { usuarioId, visitanteId } = this.obtenerIdsIdentidad(identidad);
        await this.verificarResena(resenaId, usuarioId);

        const eliminada = await this.reaccionRepositorio.eliminarPropia(usuarioId, visitanteId, resenaId);
        if (!eliminada) {
            throw crearError('No tienes una reacción para esta reseña.', 404);
        }
    }

    async obtenerTotales(resenaId) {
        await this.verificarResena(resenaId);
        const totales = await this.reaccionRepositorio.obtenerTotales(resenaId);
        return new ReaccionResumenDTO(totales).data;
    }

    async listarPropias(identidad) {
        const { usuarioId, visitanteId } = this.obtenerIdsIdentidad(identidad);
        const reacciones = await this.reaccionRepositorio.listarPropias(usuarioId, visitanteId);
        return reacciones.map(reaccion => new ReaccionObtenerDTO(reaccion).data);
    }
}

export default new ReaccionServicio();
