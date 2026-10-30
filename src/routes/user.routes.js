import { Router } from 'express';
import { UsuarioController } from '../controllers/user.controller.js';
import { autenticarJWT, autorizarAdmin } from '../middleware/auth.middleware.js';
import { validarSolicitud } from '../middleware/validation.middleware.js';
import UsuarioPerfilValidaciones from '../validators/user.profile.validator.js';
import UsuarioCambiarContrasenaValidaciones from '../validators/user.password.validator.js';
import UsuarioBuscarPorIdValidaciones from '../validators/user.per.id.validator.js';
import UsuarioActualizarEstadoValidaciones from '../validators/user.update.status.validator.js';

const router = Router();
const usuarioController = new UsuarioController();

router.get('/me', autenticarJWT, usuarioController.obtenerMiPerfil);
router.put('/me', autenticarJWT, UsuarioPerfilValidaciones, validarSolicitud, usuarioController.actualizarMiPerfil);
router.patch('/me/contrasena', autenticarJWT, UsuarioCambiarContrasenaValidaciones, validarSolicitud, usuarioController.cambiarMiContrasena);
router.delete('/me', autenticarJWT, usuarioController.desactivarMiCuenta);

router.get('/', autenticarJWT, autorizarAdmin, usuarioController.obtenerUsuarios);
router.get('/:id', autenticarJWT, autorizarAdmin, UsuarioBuscarPorIdValidaciones, validarSolicitud, usuarioController.obtenerUsuario);
router.patch('/:id', autenticarJWT, autorizarAdmin, UsuarioBuscarPorIdValidaciones, UsuarioPerfilValidaciones, validarSolicitud, usuarioController.actualizarUsuario);
router.patch('/:id/estado', autenticarJWT, autorizarAdmin, UsuarioActualizarEstadoValidaciones, validarSolicitud, usuarioController.actualizarEstadoUsuario);

export default router;
