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
       const existe = await categoriaRepository.listarCategoria(id);
       if (!existe) {
           throw new Error('CATEGORIA_NO_ENCONTRADA');
       }
       return await categoriaRepository.actualizarCategoria(id, nombre.trim(), descripcion);
   }


   async EliminarCategoria(id) {
       const existe = await categoriaRepository.listarCategorias(id);
       if (!existe) {
           throw new Error('CATEGORIA_NO_ENCONTRADA');
       }
       return await categoriaRepository.eliminarCategoria(id);
   }


}


export default new CategoriaService();

