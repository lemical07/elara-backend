import { ContenidoServicio } from '../services/content.service.js';

export class ContenidoControlador {
    constructor() {
        this.contenidoServicio = new ContenidoServicio();
    }

    obtenerDetalle = async (req, res, next) => {
        try {
            const { id } = req.params;
            const resultado = await this.contenidoServicio.obtenerDetalle(id);
            res.status(200).json({
                exito: true,
                mensaje: 'Detalle de contenido obtenido exitosamente',
                datos: resultado
            });
        } catch (error) {
            next(error);
        }
    };
}

const contenidoServicio = new ContenidoServicio();

export const obtenerCatalogoPublico = async (req, res, next) => {
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