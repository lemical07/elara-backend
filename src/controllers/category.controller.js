import categoriaService from '../services/category.services.js';

export const obtenerCategorias = async (req, res) => {
    try {
        const categorias = await categoriaService.ListarCategorias();
        res.status(200).json({ exito: true, datos: categorias });
    } catch (error) {
        res.status(500).json({ exito: false, mensaje: 'Error al obtener categorías', error: error.message });
    }
};