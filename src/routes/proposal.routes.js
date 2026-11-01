import { Router } from 'express';
import { PropuestaControlador } from '../controllers/proposal.controller.js';
import { autenticarJWT, autorizarAdmin } from '../middleware/auth.middleware.js';
import { validarSolicitud } from '../middleware/validation.middleware.js';
import { PropuestaCrearValidaciones, PropuestaEstadoValidaciones, PropuestaIdValidaciones } from '../validators/proposal.validator.js';

const router = Router();
const propuestaControlador = new PropuestaControlador();

router.post('/', autenticarJWT, PropuestaCrearValidaciones, validarSolicitud, propuestaControlador.enviar);
router.get('/pendientes', autenticarJWT, autorizarAdmin, propuestaControlador.listarPendientes);
router.patch('/:id/estado', autenticarJWT, autorizarAdmin, PropuestaIdValidaciones, PropuestaEstadoValidaciones, validarSolicitud, propuestaControlador.resolver);

export default router;
