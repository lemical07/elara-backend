import { Router } from 'express';
import { ReviewController } from '../controllers/review.controller.js';
import { autenticarJWT } from '../middleware/auth.middleware.js';
import { validarSolicitud } from '../middleware/validation.middleware.js';
import {ReviewActualizarValidaciones, ReviewContenidoIdValidaciones, ReviewCrearValidaciones, ReviewIdValidaciones} from '../validators/review.validator.js';

const router = Router();
const reviewController = new ReviewController();

router.post('/', autenticarJWT, ReviewCrearValidaciones, validarSolicitud, reviewController.crear);
router.get('/contenido/:contenidoId', ReviewContenidoIdValidaciones, validarSolicitud, reviewController.listarPorContenido);
router.get('/mis-reviews', autenticarJWT, reviewController.listarPropias);
router.get('/:id', ReviewIdValidaciones, validarSolicitud, reviewController.obtenerPorId);
router.put('/:id', autenticarJWT, ReviewIdValidaciones, ReviewActualizarValidaciones, validarSolicitud, reviewController.actualizar);
router.delete('/:id', autenticarJWT, ReviewIdValidaciones, validarSolicitud, reviewController.eliminar);

export default router;
