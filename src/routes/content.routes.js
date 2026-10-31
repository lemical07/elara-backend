import { Router } from 'express';
import { ContenidoControlador } from '../controllers/content.controller.js';
import { obtenerCatalogoPublico } from '../controllers/content.controller.js';

const router = Router();
const contenidoControlador = new ContenidoControlador();

router.get('/catalogo', obtenerCatalogoPublico);
router.get('/:id', contenidoControlador.obtenerDetalle);

export default router;