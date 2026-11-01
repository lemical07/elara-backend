import proposalService from '../services/proposal.service.js';

export class PropuestaControlador {
    constructor(servicio = proposalService) {
        this.servicio = servicio;
    }

    enviar = async (req, res, next) => {
        try {
            const propuesta = await this.servicio.procesarPropuesta(req.body, req.user.id);
            return res.status(201).json({
                exito: true,
                mensaje: 'Propuesta enviada correctamente. Está pendiente de revisión.',
                datos: propuesta
            });
        } catch (error) {
            return next(error);
        }
    };

    listarPendientes = async (req, res, next) => {
        try {
            const propuestas = await this.servicio.listarPendientes();
            return res.status(200).json({ exito: true, datos: propuestas });
        } catch (error) {
            return next(error);
        }
    };

    resolver = async (req, res, next) => {
        try {
            const propuesta = await this.servicio.resolverPropuesta(
                Number(req.params.id),
                req.body.estado,
                req.user.id
            );
            return res.status(200).json({
                exito: true,
                mensaje: 'Estado de la propuesta actualizado.',
                datos: propuesta
            });
        } catch (error) {
            return next(error);
        }
    };
}