import { Router } from 'express';
import {obtenerCategorias, crearCategoria, actualizarCategoria, eliminarCategoria} from '../controllers/category.controller.js';
import { verificarToken, verificarAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', obtenerCategorias);

// enpoints protegidos solo para admin
router.post('/', verificarToken, verificarAdmin, crearCategoria);
router.put('/:id', verificarToken, verificarAdmin, actualizarCategoria);
router.delete('/:id', verificarToken, verificarAdmin, eliminarCategoria);

export default router;