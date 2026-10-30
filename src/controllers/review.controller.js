import reviewService from '../services/review.service.js';

export class ReviewController {
    constructor(service = reviewService) {
        this.reviewService = service;
    }

    crear = async (req, res, next) => {
        try {
            const resena = await this.reviewService.crear(
                req.user.id,
                Number(req.body.contenido_id),
                req.body
            );
            return res.status(201).json({
                exito: true,
                mensaje: 'Reseña creada correctamente.',
                datos: resena
            });
        } catch (error) {
            return next(error);
        }
    };

    listarPorContenido = async (req, res, next) => {
        try {
            const resenas = await this.reviewService.listarPorContenido(Number(req.params.contenidoId));
            return res.status(200).json({ exito: true, datos: resenas });
        } catch (error) {
            return next(error);
        }
    };

    obtenerPorId = async (req, res, next) => {
        try {
            const resena = await this.reviewService.obtenerPorId(Number(req.params.id));
            return res.status(200).json({ exito: true, datos: resena });
        } catch (error) {
            return next(error);
        }
    };

    listarPropias = async (req, res, next) => {
        try {
            const resenas = await this.reviewService.listarPropias(req.user.id);
            return res.status(200).json({ exito: true, datos: resenas });
        } catch (error) {
            return next(error);
        }
    };

    actualizar = async (req, res, next) => {
        try {
            const resena = await this.reviewService.actualizar(
                Number(req.params.id),
                req.user.id,
                req.body
            );
            return res.status(200).json({
                exito: true,
                mensaje: 'Reseña actualizada correctamente.',
                datos: resena
            });
        } catch (error) {
            return next(error);
        }
    };

    eliminar = async (req, res, next) => {
        try {
            await this.reviewService.eliminar(Number(req.params.id), req.user.id);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    };
}
