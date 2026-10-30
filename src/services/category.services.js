import categoriaRepository from '../repositories/category.repository.js';


class CategoriaService {
   async ListarCategorias() {
       return categoriaRepository.listarCategorias();
   }

   async CrearCategoria(nombre, descripcion) {
       if (typeof nombre !== 'string' || nombre.trim() === '') {
           const error = new Error('El nombre es obligatorio.');
           error.status = 400;
           throw error;
       }

       try {
           return await categoriaRepository.crearCategoria(nombre.trim(), descripcion);
       } catch (cause) {
           if (cause.code === 'ER_DUP_ENTRY') {
               const error = new Error('Ya existe una categoría con este nombre.');
               error.status = 409;
               throw error;
           }
           throw cause;
       }
   }

   async ActualizarCategoria(id, nombre, descripcion) {
       if (typeof nombre !== 'string' || nombre.trim() === '') {
           const error = new Error('El nombre es obligatorio.');
           error.status = 400;
           throw error;
       }

       const existe = await categoriaRepository.buscarCategoriaPorId(id);
       if (!existe) {
           const error = new Error('Categoría no encontrada.');
           error.status = 404;
           throw error;
       }

       try {
           return await categoriaRepository.actualizarCategoria(id, nombre.trim(), descripcion);
       } catch (cause) {
           if (cause.code === 'ER_DUP_ENTRY') {
               const error = new Error('El nombre de la categoría ya está en uso.');
               error.status = 409;
               throw error;
           }
           throw cause;
       }
   }

   async EliminarCategoria(id) {
       const existe = await categoriaRepository.buscarCategoriaPorId(id);
       if (!existe) {
           const error = new Error('Categoría no encontrada.');
           error.status = 404;
           throw error;
       }

       try {
           return await categoriaRepository.eliminarCategoria(id);
       } catch (cause) {
           if (cause.code === 'ER_ROW_IS_REFERENCED_2') {
               const error = new Error('No se puede eliminar la categoría porque tiene contenidos asociados.');
               error.status = 409;
               throw error;
           }
           throw cause;
       }
   }
}


export default new CategoriaService();
