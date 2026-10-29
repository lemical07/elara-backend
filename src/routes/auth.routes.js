import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { autenticarJWT, autenticarLocal } from '../middleware/auth.middleware.js';

const router = Router();
const authController = new AuthController();

router.post('/register', authController.registrar);
router.post('/login', autenticarLocal, authController.iniciarSesion);
router.get('/me', autenticarJWT, authController.obtenerSesion);

export default router;
