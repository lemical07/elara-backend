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