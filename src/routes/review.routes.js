import { Router } from 'express';
import { ResenaControlador } from '../controllers/review.controller.js';
import { autenticarJWT, autenticarOpcional } from '../middleware/auth.middleware.js';
import { identificarVisitante } from '../middleware/visitor.middleware.js';
import { validarSolicitud } from '../middleware/validation.middleware.js';
import {ResenaActualizarValidaciones, ResenaContenidoIdValidaciones, ResenaCrearValidaciones, ResenaIdValidaciones} from '../validators/review.validator.js';

const router = Router();
const resenaControlador = new ResenaControlador();

router.post('/', autenticarOpcional, identificarVisitante, ResenaCrearValidaciones, validarSolicitud, resenaControlador.crear);
router.get('/contenido/:contenidoId', ResenaContenidoIdValidaciones, validarSolicitud, resenaControlador.listarPorContenido);
router.get('/mis-reviews', autenticarOpcional, identificarVisitante, resenaControlador.listarPropias);
router.get('/:id', ResenaIdValidaciones, validarSolicitud, resenaControlador.obtenerPorId);
router.put('/:id', autenticarOpcional, identificarVisitante, ResenaIdValidaciones, ResenaActualizarValidaciones, validarSolicitud, resenaControlador.actualizar);
router.delete('/:id', autenticarOpcional, identificarVisitante, ResenaIdValidaciones, validarSolicitud, resenaControlador.eliminar);

//ruta expoprtacion de reseñas a CSV
router.get('/export/:id', resenaControlador.exportarResenasACSV);

module.exports = router;