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

    async ActualizarCategoria(id, nombre, descripcion) {
        const existe = await categoriaRepository.actualizarCategoria(id);
        if (!existe) {
            throw new Error('CATEGORIA_NO_ENCONTRADA');
        }
        return await categoriaRepository.update(id, nombre.trim(), descripcion);
    }

}

export default new CategoriaService();