import { Router } from 'express';
import { ReactionController } from '../controllers/reaction.controller.js';
import { autenticarJWT } from '../middleware/auth.middleware.js';
import { validarSolicitud } from '../middleware/validation.middleware.js';
import {ReactionActualizarValidaciones, ReactionCrearValidaciones, ReactionReviewIdValidaciones} from '../validators/reaction.validator.js';

const router = Router();
const reactionController = new ReactionController();

router.post('/', autenticarJWT, ReactionCrearValidaciones, validarSolicitud, reactionController.registrar);
router.get('/review/:reviewId', ReactionReviewIdValidaciones, validarSolicitud, reactionController.obtenerTotales);
router.get('/mis-reacciones', autenticarJWT, reactionController.listarPropias);
router.put('/:reviewId', autenticarJWT, ReactionReviewIdValidaciones, ReactionActualizarValidaciones, validarSolicitud, reactionController.actualizar);
router.delete('/:reviewId', autenticarJWT, ReactionReviewIdValidaciones, validarSolicitud, reactionController.eliminar);

export default router;
