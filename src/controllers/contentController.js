import { ContentService } from '../services/contentService.js';

export class ContentController {
    constructor() {
        this.contentService = new ContentService();
    }

    getApproved = async (req, res, next) => {
        try {
            const result = await this.contentService.getApprovedContent();
            return res.status(200).json({
                exito: true,
                mensaje: 'Contenido aprobado obtenido exitosamente',
                datos: result
            });
        } catch (error) {
            return next(error);
        }
    };

    getDetail = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.contentService.getContentDetail(id);
            return res.status(200).json({
                exito: true,
                mensaje: 'Detalle de contenido obtenido exitosamente',
                datos: result
            });
        } catch (error) {
            return next(error);
        }
    };
}