import { randomUUID } from 'node:crypto';
import visitanteRepositorio from '../repositories/visitor.repository.js';

class VisitanteServicio {
    constructor(repositorio = visitanteRepositorio) {
        this.visitanteRepositorio = repositorio;
    }

    async obtenerOCrear(token) {
        if (typeof token === 'string') {
            const visitante = await this.visitanteRepositorio.buscarPorToken(token);
            if (visitante) {
                return { visitante, creado: false };
            }
        }

        const visitante = await this.visitanteRepositorio.crear(randomUUID());
        return { visitante, creado: true };
    }
}

export default new VisitanteServicio();
