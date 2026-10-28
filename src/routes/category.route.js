import { Router } from 'express';
import {
    ObtenerCategorias,
    CrearCategoria,
    ActualizarCategoria,
    EliminarCategoria
} from '../controllers/categoria.controller.js';
import { verificarToken, verificarAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.get('/', ObtenerCategorias);

// Endpoints protegidos exclusivamente para Administradores
router.post('/', verificarToken, verificarAdmin, crearCategoria);
router.put('/:id', verificarToken, verificarAdmin, actualizarCategoria);
router.delete('/:id', verificarToken, verificarAdmin, eliminarCategoria);

export default router;