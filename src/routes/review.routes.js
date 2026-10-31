import { Router } from 'express';
import { ResenaControlador } from '../controllers/review.controller.js';
import { autenticarJWT } from '../middleware/auth.middleware.js';
import { validarSolicitud } from '../middleware/validation.middleware.js';
import {ResenaActualizarValidaciones, ResenaContenidoIdValidaciones, ResenaCrearValidaciones, ResenaIdValidaciones} from '../validators/review.validator.js';

const router = Router();
const resenaControlador = new ResenaControlador();

router.post('/', autenticarJWT, ResenaCrearValidaciones, validarSolicitud, resenaControlador.crear);
router.get('/contenido/:contenidoId', ResenaContenidoIdValidaciones, validarSolicitud, resenaControlador.listarPorContenido);
router.get('/mis-reviews', autenticarJWT, resenaControlador.listarPropias);
router.get('/:id', ResenaIdValidaciones, validarSolicitud, resenaControlador.obtenerPorId);
router.put('/:id', autenticarJWT, ResenaIdValidaciones, ResenaActualizarValidaciones, validarSolicitud, resenaControlador.actualizar);
router.delete('/:id', autenticarJWT, ResenaIdValidaciones, validarSolicitud, resenaControlador.eliminar);

export default router;
