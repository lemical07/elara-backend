import { Router } from 'express';
import { ReaccionControlador } from '../controllers/reaction.controller.js';
import { autenticarOpcional } from '../middleware/auth.middleware.js';
import { validarSolicitud } from '../middleware/validation.middleware.js';
import { identificarVisitante } from '../middleware/visitor.middleware.js';
import {ReaccionActualizarValidaciones, ReaccionCrearValidaciones, ReaccionResenaIdValidaciones } from '../validators/reaction.validator.js';

const router = Router();
const reaccionControlador = new ReaccionControlador();

router.post('/', autenticarOpcional, identificarVisitante, ReaccionCrearValidaciones, validarSolicitud, reaccionControlador.registrar);
router.get('/review/:reviewId', ReaccionResenaIdValidaciones, validarSolicitud, reaccionControlador.obtenerTotales);
router.get('/mis-reacciones', autenticarOpcional, identificarVisitante, reaccionControlador.listarPropias);
router.put('/:reviewId', autenticarOpcional, identificarVisitante, ReaccionResenaIdValidaciones, ReaccionActualizarValidaciones, validarSolicitud, reaccionControlador.actualizar);
router.delete('/:reviewId', autenticarOpcional, identificarVisitante, ReaccionResenaIdValidaciones, validarSolicitud, reaccionControlador.eliminar);

export default router;
