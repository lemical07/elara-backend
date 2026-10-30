import { Router } from 'express';
import { ContentController } from '../controllers/contentController.js';

import { obtenerCatalogoPublicoControlador } from '../controllers/contentController.js';

const router = Router();
const contentController = new ContentController();

router.get('/', contentController.getApproved);
router.get('/:id', contentController.getDetail);

router.get('/catalogo', obtenerCatalogoPublicoControlador);


export default router;