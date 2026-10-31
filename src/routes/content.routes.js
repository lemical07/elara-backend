import { Router } from 'express';
import { ContentController } from '../controllers/content.controller.js';

import { obtenerCatalogoPublicoControlador } from '../controllers/content.controller.js';

const router = Router();
const contentController = new ContentController();

router.get('/:id', contentController.obtenerDetalleProducto);

router.get('/catalogo', obtenerCatalogoPublicoControlador);


export default router;