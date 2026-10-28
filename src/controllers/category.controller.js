import categoriaService from '../services/category.services.js';

export const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await categoriaService.ListarCategorias();
        res.status(200).json({ exito: true, datos: categorias });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error al obtener categorías', error: error.message });
    }
};

export const crearCategoria = async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const id = await categoriaService.CrearCategoria(nombre, descripcion);
        res.status(201).json({ exito: true, mensaje: 'Categoría creada con éxito', id });
    } catch (error) {
        if (error.message === 'EL_NOMBRE_ES_REQUERIDO') {
            return res.status(400).json({ exito: false, mensaje: 'El nombre es obligatorio' });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ exito: false, mensaje: 'Ya existe una categoría con este nombre' });
        }
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor', error: error.message });
    }
};

export const actualizarCategoria = async (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;
    try {
        await categoriaService.ActualizarCategoria(id, nombre, descripcion);
        res.status(200).json({ exito: true, mensaje: 'Categoría actualizada con éxito' });
    } catch (error) {
        if (error.message === 'CATEGORIA_NO_ENCONTRADA') {
            return res.status(404).json({ exito: false, mensaje: 'Categoría no encontrada' });
        }
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ exito: false, mensaje: 'El nombre de la categoría ya está en uso' });
        }
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor', error: error.message });
    }
};

export const eliminarCategoria = async (req, res) => {
    const { id } = req.params;
    try {
        await categoriaService.eliminarCategoria(id);
        res.status(200).json({ exito: true, mensaje: 'Categoría eliminada con éxito' });
    } catch (error) {
        if (error.message === 'CATEGORIA_NO_ENCONTRADA') {
            return res.status(404).json({ exito: false, mensaje: 'Categoría no encontrada' });
        }
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ exito: false, mensaje: 'No se puede eliminar la categoría porque tiene contenidos asociados' });
        }
        res.status(500).json({ exito: false, mensaje: 'Error interno del servidor', error: error.message });
    }
};