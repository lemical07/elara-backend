import propuestaRepositorio from '../repositories/proposal.repository.js';
import { PropuestaRespuestaDTO } from '../dtos/proposal.dtos.js';

function crearError(mensaje, status) {
    const error = new Error(mensaje);
    error.status = status;
    return error;
}

class PropuestaServicio {
    constructor(repositorio = propuestaRepositorio) {
        this.propuestaRepositorio = repositorio;
    }

    async procesarPropuesta(datosPropuesta, usuarioId) {
        if (!(await this.propuestaRepositorio.existeCategoria(datosPropuesta.categoria_id))) {
            throw crearError('Categoría no encontrada.', 404);
        }
        const contenidoCreado = await this.propuestaRepositorio.guardarPropuesta(datosPropuesta, usuarioId);
        return new PropuestaRespuestaDTO(contenidoCreado).data;
    }

    async listarPendientes() {
        const propuestas = await this.propuestaRepositorio.listarPendientes();
        return propuestas;
    }

    async resolverPropuesta(id, estado, administradorId) {
        const propuesta = await this.propuestaRepositorio.actualizarEstado(id, estado, administradorId);
        if (!propuesta) {
            throw crearError('Propuesta no encontrada.', 404);
        }
        return propuesta;
    }
}

export default new PropuestaServicio();