import { ContentService } from '../services/contentService.js';

export class ContentController {
    constructor() {
        this.contentService = new ContentService();
    }

<<<<<<< HEAD
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

=======
>>>>>>> feature/services
    getDetail = async (req, res, next) => {
        try {
            const { id } = req.params;
            const result = await this.contentService.getContentDetail(id);
<<<<<<< HEAD
            return res.status(200).json({
=======
            res.status(200).json({
>>>>>>> feature/services
                exito: true,
                mensaje: 'Detalle de contenido obtenido exitosamente',
                datos: result
            });
        } catch (error) {
<<<<<<< HEAD
            return next(error);
=======
            next(error);
>>>>>>> feature/services
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