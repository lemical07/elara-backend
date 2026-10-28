import categoriaRepository from '../repositories/category.repository.js';

class CategoriaService {

    async ListarCategorias() {
        return await categoriaRepository.listarCategorias();
    }

    async CrearCategoria(nombre, descripcion) {
        if (!nombre || nombre.trim() === '') {
            throw new Error('EL_NOMBRE_ES_REQUERIDO');
        }
        return await categoriaRepository.crearCategoria(nombre.trim(), descripcion);
    }

}

export default new CategoriaService();