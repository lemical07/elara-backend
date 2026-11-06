import { Router } from 'express';
import { UsuarioControlador } from '../controllers/user.controller.js';
import { autenticarJWT, autorizarAdmin } from '../middleware/auth.middleware.js';
import { validarSolicitud } from '../middleware/validation.middleware.js';
import UsuarioPerfilValidaciones from '../validators/user.profile.validator.js';
import UsuarioCambiarContrasenaValidaciones from '../validators/user.password.validator.js';
import UsuarioBuscarPorIdValidaciones from '../validators/user.per.id.validator.js';
import UsuarioActualizarEstadoValidaciones from '../validators/user.update.status.validator.js';
import UsuarioActualizarRolValidaciones from '../validators/user.role.validator.js';
import UsuarioEliminarValidaciones from '../validators/user.delete.validator.js';

const router = Router();
const usuarioControlador = new UsuarioControlador();

router.get('/me', autenticarJWT, usuarioControlador.obtenerMiPerfil);
router.put('/me', autenticarJWT, UsuarioPerfilValidaciones, validarSolicitud, usuarioControlador.actualizarMiPerfil);
router.patch('/me/contrasena', autenticarJWT, UsuarioCambiarContrasenaValidaciones, validarSolicitud, usuarioControlador.cambiarMiContrasena);
router.delete('/me', autenticarJWT, usuarioControlador.desactivarMiCuenta);
router.delete('/me/permanente', autenticarJWT, UsuarioEliminarValidaciones, validarSolicitud, usuarioControlador.eliminarMiCuenta);

router.get('/', autenticarJWT, autorizarAdmin, usuarioControlador.obtenerUsuarios);
router.get('/:id', autenticarJWT, autorizarAdmin, UsuarioBuscarPorIdValidaciones, validarSolicitud, usuarioControlador.obtenerUsuario);
router.patch('/:id', autenticarJWT, autorizarAdmin, UsuarioBuscarPorIdValidaciones, UsuarioPerfilValidaciones, validarSolicitud, usuarioControlador.actualizarUsuario);
router.patch('/:id/rol', autenticarJWT, autorizarAdmin, UsuarioBuscarPorIdValidaciones, UsuarioActualizarRolValidaciones, validarSolicitud, usuarioControlador.actualizarRolUsuario);
router.patch('/:id/estado', autenticarJWT, autorizarAdmin, UsuarioActualizarEstadoValidaciones, validarSolicitud, usuarioControlador.actualizarEstadoUsuario);

export default router;
