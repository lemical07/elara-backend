import { Router } from 'express';
import { AutenticacionControlador } from '../controllers/auth.controller.js';
import { autenticarJWT, autenticarLocal } from '../middleware/auth.middleware.js';

const router = Router();
const autenticacionControlador = new AutenticacionControlador();

router.post('/register', autenticacionControlador.registrar);
router.post('/login', autenticarLocal, autenticacionControlador.iniciarSesion);
router.get('/me', autenticarJWT, autenticacionControlador.obtenerSesion);

export default router;
