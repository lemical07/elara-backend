import proposalRepository from '../repositories/proposal.repository.js';
import { formatearRespuestaPropuestaDto } from '../dtos/proposal.dto.js';
import { validarDatosPropuesta } from '../validators/proposal.validator.js';

class ProposalService {

    async procesarPropuesta(datosPropuesta, usuarioId) {
        const errorValidacion = validarDatosPropuesta(datosPropuesta);
        if (errorValidacion) {
            throw new Error(errorValidacion);
        }
        const contenidoCreado = await proposalRepository.guardarPropuesta(datosPropuesta, usuarioId);
        return formatearRespuestaPropuestaDto(contenidoCreado);
    }
}

export default new ProposalService();