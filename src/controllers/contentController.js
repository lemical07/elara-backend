import { ContentService } from '../services/contentService.js';

export class ContentController {
    constructor() {
        this.contentService = new ContentService();
    }

    getDetail = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.contentService.getContentDetail(id);
            res.status(200).json({
                exito: true,
                mensaje: 'Detalle de contenido obtenido exitosamente',
                datos: result
            });
        } catch (error) {
            next(error);
        }
    };
}