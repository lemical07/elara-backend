import { ContenidoServicio } from '../services/content.service.js';

export class ContenidoControlador {
    constructor(servicio = new ContenidoServicio()) {
        this.contenidoServicio = servicio;
    }

    obtenerCatalogoPublico = async (req, res, next) => {
        try {
            const filtros = {
                titulo: req.query.titulo,
                tipo: req.query.tipo,
                categoria: req.query.categoria,
                anio: req.query.anio,
                orden: req.query.orden
            };
            const catalogo = await this.contenidoServicio.obtenerCatalogoPublico(filtros);
            return res.status(200).json({
                exito: true,
                total: catalogo.length,
                datos: catalogo
            });
        } catch (error) {
            return next(error);
        }
    };

    obtenerDetalle = async (req, res, next) => {
        try {
            const { id } = req.params;
            const resultado = await this.contenidoServicio.obtenerDetalle(id);
            return res.status(200).json({
                exito: true,
                mensaje: 'Detalle de contenido obtenido exitosamente',
                datos: resultado
            });
        } catch (error) {
            return next(error);
        }
    };

    crear = async (req, res, next) => {
        try {
            const contenido = await this.contenidoServicio.crearAprobado(req.body);
            return res.status(201).json({
                exito: true,
                mensaje: 'Contenido creado correctamente.',
                datos: contenido
            });
        } catch (error) {
            return next(error);
        }
    };

    actualizar = async (req, res, next) => {
        try {
            const contenido = await this.contenidoServicio.actualizar(Number(req.params.id), req.body);
            return res.status(200).json({
                exito: true,
                mensaje: 'Contenido actualizado correctamente.',
                datos: contenido
            });
        } catch (error) {
            return next(error);
        }
    };

    eliminar = async (req, res, next) => {
        try {
            await this.contenidoServicio.eliminar(Number(req.params.id));
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    };

    listarPersonajes = async (req, res, next) => {
        try {
            const personajes = await this.contenidoServicio.listarPersonajes(Number(req.params.id));
            return res.status(200).json({ exito: true, datos: personajes });
        } catch (error) {
            return next(error);
        }
    };

    crearPersonaje = async (req, res, next) => {
        try {
            const personaje = await this.contenidoServicio.crearPersonaje(Number(req.params.id), req.body);
            return res.status(201).json({ exito: true, datos: personaje });
        } catch (error) {
            return next(error);
        }
    };

    actualizarPersonaje = async (req, res, next) => {
        try {
            const personaje = await this.contenidoServicio.actualizarPersonaje(
                Number(req.params.id),
                Number(req.params.personajeId),
                req.body
            );
            return res.status(200).json({ exito: true, datos: personaje });
        } catch (error) {
            return next(error);
        }
    };

    eliminarPersonaje = async (req, res, next) => {
        try {
            await this.contenidoServicio.eliminarPersonaje(
                Number(req.params.id),
                Number(req.params.personajeId)
            );
            return res.status(204).send();
        } catch (error) {
            return next(error);
        }
    };
}