import { Router } from 'express';
import { AutenticacionControlador } from '../controllers/auth.controller.js';
import { autenticarJWT, autenticarLocal } from '../middleware/auth.middleware.js';
import { limitarAutenticacion } from '../middleware/rate-limit.middleware.js';
import { validarSolicitud } from '../middleware/validation.middleware.js';
import { InicioSesionValidaciones, RegistroValidaciones } from '../validators/auth.validator.js';

const router = Router();
const autenticacionControlador = new AutenticacionControlador();

router.post('/register', limitarAutenticacion, RegistroValidaciones, validarSolicitud, autenticacionControlador.registrar);
router.post('/login', limitarAutenticacion, InicioSesionValidaciones, validarSolicitud, autenticarLocal, autenticacionControlador.iniciarSesion);
router.get('/me', autenticarJWT, autenticacionControlador.obtenerSesion);

export default router;
