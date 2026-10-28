import categoriaRepository from '../repositories/category.repository.js';

class CategoriaService {

    async listarCategorias() {
        return await categoriaRepository.listarCategorias();
    }

}

export default new CategoriaService();