import { Router } from 'express';
import { ReaccionControlador } from '../controllers/reaction.controller.js';
import { autenticarJWT } from '../middleware/auth.middleware.js';
import { validarSolicitud } from '../middleware/validation.middleware.js';
import {ReaccionActualizarValidaciones, ReaccionCrearValidaciones, ReaccionResenaIdValidaciones } from '../validators/reaction.validator.js';

const router = Router();
const reaccionControlador = new ReaccionControlador();

router.post('/', autenticarJWT, ReaccionCrearValidaciones, validarSolicitud, reaccionControlador.registrar);
router.get('/review/:reviewId', ReaccionResenaIdValidaciones, validarSolicitud, reaccionControlador.obtenerTotales);
router.get('/mis-reacciones', autenticarJWT, reaccionControlador.listarPropias);
router.put('/:reviewId', autenticarJWT, ReaccionResenaIdValidaciones, ReaccionActualizarValidaciones, validarSolicitud, reaccionControlador.actualizar);
router.delete('/:reviewId', autenticarJWT, ReaccionResenaIdValidaciones, validarSolicitud, reaccionControlador.eliminar);

export default router;
