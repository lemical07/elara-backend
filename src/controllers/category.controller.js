import categoriaService from '../services/category.services.js';

export const obtenerCategorias = async (req, res, next) => {
    try {
        const categorias = await categoriaService.ListarCategorias();
        return res.status(200).json({ exito: true, datos: categorias });
    } catch (error) {
        return next(error);
    }
};

export const crearCategoria = async (req, res, next) => {
    const { nombre, descripcion } = req.body;
    try {
        const id = await categoriaService.CrearCategoria(nombre, descripcion);
        return res.status(201).json({ exito: true, mensaje: 'Categoría creada con éxito', id });
    } catch (error) {
        return next(error);
    }
};

export const actualizarCategoria = async (req, res, next) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    try {
        await categoriaService.ActualizarCategoria(id, nombre, descripcion);
        return res.status(200).json({ exito: true, mensaje: 'Categoría actualizada con éxito' });
    } catch (error) {
        return next(error);
    }
};

export const eliminarCategoria = async (req, res, next) => {
    const { id } = req.params;
    try {
        await categoriaService.EliminarCategoria(id);
        return res.status(200).json({ exito: true, mensaje: 'Categoría eliminada con éxito' });
    } catch (error) {
        return next(error);
    }
};