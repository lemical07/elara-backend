import { Router } from 'express';
import {obtenerCategorias, crearCategoria, actualizarCategoria, eliminarCategoria} from '../controllers/category.controller.js';
import { verificarToken, verificarAdmin } from '../middleware/auth.middleware.js';
import { validarSolicitud } from '../middleware/validation.middleware.js';
import { CategoriaActualizarValidaciones, CategoriaCrearValidaciones, CategoriaIdValidaciones } from '../validators/category.validator.js';

const router = Router();
router.get('/', obtenerCategorias);

// enpoints protegidos solo para admin
router.post('/', verificarToken, verificarAdmin, CategoriaCrearValidaciones, validarSolicitud, crearCategoria);
router.put('/:id', verificarToken, verificarAdmin, CategoriaActualizarValidaciones, validarSolicitud, actualizarCategoria);
router.delete('/:id', verificarToken, verificarAdmin, CategoriaIdValidaciones, validarSolicitud, eliminarCategoria);

export default router;