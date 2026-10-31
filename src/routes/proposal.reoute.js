import { Router } from 'express';
import { enviarPropuesta } from '../controllers/proposal.controller.js';
import { verificarToken } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/', verificarToken, enviarPropuesta);

export default router;