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

const contenidoServicio = new ContentService();

export const obtenerCatalogoPublicoControlador = async (req, res, next) => {
    try {
        const { categoria } = req.query; 
        const catalogo = await contenidoServicio.obtenerCatalogoPublico(categoria);
        
        return res.status(200).json({
            exito: true,
            total: catalogo.length,
            datos: catalogo
        });
    } catch (error) {
        next(error);
    }
};