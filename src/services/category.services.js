import categoriaRepositorio from '../repositories/category.repository.js';


class CategoriaServicio {
   async listarCategorias() {
       return categoriaRepositorio.listarCategorias();
   }

   async crearCategoria(nombre, descripcion) {
       if (typeof nombre !== 'string' || nombre.trim() === '') {
           const error = new Error('El nombre es obligatorio.');
           error.status = 400;
           throw error;
       }

       try {
           return await categoriaRepositorio.crearCategoria(nombre.trim(), descripcion);
       } catch (causa) {
           if (causa.code === 'ER_DUP_ENTRY') {
               const error = new Error('Ya existe una categoría con este nombre.');
               error.status = 409;
               throw error;
           }
           throw causa;
       }
   }

   async actualizarCategoria(id, nombre, descripcion) {
       if (typeof nombre !== 'string' || nombre.trim() === '') {
           const error = new Error('El nombre es obligatorio.');
           error.status = 400;
           throw error;
       }

       const existe = await categoriaRepositorio.buscarCategoriaPorId(id);
       if (!existe) {
           const error = new Error('Categoría no encontrada.');
           error.status = 404;
           throw error;
       }

       try {
           return await categoriaRepositorio.actualizarCategoria(id, nombre.trim(), descripcion);
       } catch (causa) {
           if (causa.code === 'ER_DUP_ENTRY') {
               const error = new Error('El nombre de la categoría ya está en uso.');
               error.status = 409;
               throw error;
           }
           throw causa;
       }
   }

   async eliminarCategoria(id) {
       const existe = await categoriaRepositorio.buscarCategoriaPorId(id);
       if (!existe) {
           const error = new Error('Categoría no encontrada.');
           error.status = 404;
           throw error;
       }

       try {
           return await categoriaRepositorio.eliminarCategoria(id);
       } catch (causa) {
           if (causa.code === 'ER_ROW_IS_REFERENCED_2') {
               const error = new Error('No se puede eliminar la categoría porque tiene contenidos asociados.');
               error.status = 409;
               throw error;
           }
           throw causa;
       }
   }
}


export default new CategoriaServicio();
