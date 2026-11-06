import categoriaServicio from '../services/category.services.js';

export class CategoriaControlador {
    constructor(servicio = categoriaServicio) {
        this.categoriaServicio = servicio;
    }

    obtenerCategorias = async (req, res, next) => {
        try {
            const categorias = await this.categoriaServicio.listarCategorias();
            return res.status(200).json({ exito: true, datos: categorias });
        } catch (error) {
            return next(error);
        }
    };

    crearCategoria = async (req, res, next) => {
        const { nombre, descripcion } = req.body;
        try {
            const id = await this.categoriaServicio.crearCategoria(nombre, descripcion);
            return res.status(201).json({ exito: true, mensaje: 'Categoría creada con éxito', id });
        } catch (error) {
            return next(error);
        }
    };

    actualizarCategoria = async (req, res, next) => {
        const { id } = req.params;
        const { nombre, descripcion } = req.body;
        try {
            await this.categoriaServicio.actualizarCategoria(id, nombre, descripcion);
            return res.status(200).json({ exito: true, mensaje: 'Categoría actualizada con éxito' });
        } catch (error) {
            return next(error);
        }
    };

    eliminarCategoria = async (req, res, next) => {
        const { id } = req.params;
        try {
            await this.categoriaServicio.eliminarCategoria(id);
            return res.status(200).json({ exito: true, mensaje: 'Categoría eliminada con éxito' });
        } catch (error) {
            return next(error);
        }
    }
}

export default new CategoriaControlador();