import resenaServicio from '../services/review.service.js';

export class ResenaControlador {
    constructor(servicio = resenaServicio) {
        this.resenaServicio = servicio;
    }

    crear = async (req, res, next) => {
        try {
            const resena = await this.resenaServicio.crear(
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
            const resenas = await this.resenaServicio.listarPorContenido(Number(req.params.contenidoId));
            return res.status(200).json({ exito: true, datos: resenas });
        } catch (error) {
            return next(error);
        }
    };

    obtenerPorId = async (req, res, next) => {
        try {
            const resena = await this.resenaServicio.obtenerPorId(Number(req.params.id));
            return res.status(200).json({ exito: true, datos: resena });
        } catch (error) {
            return next(error);
        }
    };

    listarPropias = async (req, res, next) => {
        try {
            const resenas = await this.resenaServicio.listarPropias(req.user.id);
            return res.status(200).json({ exito: true, datos: resenas });
        } catch (error) {
            return next(error);
        }
    };

    actualizar = async (req, res, next) => {
        try {
            const resena = await this.resenaServicio.actualizar(
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
            await this.resenaServicio.eliminar(Number(req.params.id), req.user.id);
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    };
}
