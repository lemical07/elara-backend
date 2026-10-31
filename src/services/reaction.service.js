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

    async verificarResena(resenaId, usuarioId) {
        const resena = await this.reaccionRepositorio.buscarResenaVisible(resenaId);
        if (!resena) {
            throw crearError('Reseña no encontrada.', 404);
        }
        if (usuarioId !== undefined && Number(resena.usuario_id) === Number(usuarioId)) {
            throw crearError('No puedes reaccionar a tu propia reseña.', 403);
        }
        return resena;
    }

    async registrar(usuarioId, datos) {
        const reaccionDTO = new ReaccionCrearDTO(datos);
        await this.verificarResena(reaccionDTO.review_id, usuarioId);

        const resultado = await this.reaccionRepositorio.registrarOActualizar(
            usuarioId,
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

    async actualizar(usuarioId, resenaId, datos) {
        await this.verificarResena(resenaId, usuarioId);

        const reaccionActual = await this.reaccionRepositorio.buscarPropia(usuarioId, resenaId);
        if (!reaccionActual) {
            throw crearError('No tienes una reacción para esta reseña.', 404);
        }

        const actualizacion = new ReaccionActualizarDTO(datos).data;
        const cambio = await this.reaccionRepositorio.actualizarPropia(
            usuarioId,
            resenaId,
            actualizacion.tipo
        );
        if (!cambio && !(await this.reaccionRepositorio.buscarPropia(usuarioId, resenaId))) {
            throw crearError('No tienes una reacción para esta reseña.', 404);
        }

        return {
            mensaje: cambio
                ? 'Reacción actualizada correctamente.'
                : 'La reacción ya tenía ese tipo; no hubo cambios.',
            datos: mapearReaccion({ review_id: resenaId, tipo: actualizacion.tipo })
        };
    }

    async eliminar(usuarioId, resenaId) {
        await this.verificarResena(resenaId, usuarioId);

        const eliminada = await this.reaccionRepositorio.eliminarPropia(usuarioId, resenaId);
        if (!eliminada) {
            throw crearError('No tienes una reacción para esta reseña.', 404);
        }
    }

    async obtenerTotales(resenaId) {
        await this.verificarResena(resenaId);
        const totales = await this.reaccionRepositorio.obtenerTotales(resenaId);
        return new ReaccionResumenDTO(totales).data;
    }

    async listarPropias(usuarioId) {
        const reacciones = await this.reaccionRepositorio.listarPropias(usuarioId);
        return reacciones.map(reaccion => new ReaccionObtenerDTO(reaccion).data);
    }
}

export default new ReaccionServicio();
