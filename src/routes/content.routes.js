import { Router } from 'express';
import { ContenidoControlador } from '../controllers/content.controller.js';
import { autenticarJWT, autorizarAdmin } from '../middleware/auth.middleware.js';
import { validarSolicitud } from '../middleware/validation.middleware.js';
import { ContenidoActualizarValidaciones, ContenidoCatalogoValidaciones, ContenidoCrearValidaciones, ContenidoIdValidaciones, PersonajeActualizarValidaciones, PersonajeCrearValidaciones, PersonajeIdValidaciones } from '../validators/content.validator.js';

const router = Router();
const contenidoControlador = new ContenidoControlador();

router.get('/catalogo', ContenidoCatalogoValidaciones, validarSolicitud, contenidoControlador.obtenerCatalogoPublico);
router.get('/:id/personajes', ContenidoIdValidaciones, validarSolicitud, contenidoControlador.listarPersonajes);
router.get('/:id', ContenidoIdValidaciones, validarSolicitud, contenidoControlador.obtenerDetalle);
router.post('/', autenticarJWT, autorizarAdmin, ContenidoCrearValidaciones, validarSolicitud, contenidoControlador.crear);
router.put('/:id', autenticarJWT, autorizarAdmin, ContenidoActualizarValidaciones, validarSolicitud, contenidoControlador.actualizar);
router.delete('/:id', autenticarJWT, autorizarAdmin, ContenidoIdValidaciones, validarSolicitud, contenidoControlador.eliminar);
router.post('/:id/personajes', autenticarJWT, autorizarAdmin, PersonajeCrearValidaciones, validarSolicitud, contenidoControlador.crearPersonaje);
router.put('/:id/personajes/:personajeId', autenticarJWT, autorizarAdmin, PersonajeActualizarValidaciones, validarSolicitud, contenidoControlador.actualizarPersonaje);
router.delete('/:id/personajes/:personajeId', autenticarJWT, autorizarAdmin, PersonajeIdValidaciones, validarSolicitud, contenidoControlador.eliminarPersonaje);

export default router;