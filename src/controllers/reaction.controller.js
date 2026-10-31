import reactionService from '../services/reaction.service.js';

export class ReactionController {
    constructor(service = reactionService) {
        this.reactionService = service;
    }

    registrar = async (req, res, next) => {
        try {
            const resultado = await this.reactionService.registrar(req.user.id, req.body);
            return res.status(resultado.creada ? 201 : 200).json({
                exito: true,
                mensaje: resultado.mensaje,
                datos: resultado.datos
            });
        } catch (error) {
            return next(error);
        }
    };

    actualizar = async (req, res, next) => {
        try {
            const resultado = await this.reactionService.actualizar(
                req.user.id,
                Number(req.params.reviewId),
                req.body
            );
            return res.status(200).json({
                exito: true,
                mensaje: resultado.mensaje,
                datos: resultado.datos
            });
        } catch (error) {
            return next(error);
        }
    };

    eliminar = async (req, res, next) => {
        try {
            await this.reactionService.eliminar(req.user.id, Number(req.params.reviewId));
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    };

    obtenerTotales = async (req, res, next) => {
        try {
            const totales = await this.reactionService.obtenerTotales(Number(req.params.reviewId));
            return res.status(200).json({ exito: true, datos: totales });
        } catch (error) {
            return next(error);
        }
    };

    listarPropias = async (req, res, next) => {
        try {
            const reacciones = await this.reactionService.listarPropias(req.user.id);
            return res.status(200).json({ exito: true, datos: reacciones });
        } catch (error) {
            return next(error);
        }
    };
}
