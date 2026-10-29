import bcrypt from 'bcrypt';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import usuarioRepository from '../repositories/user.repository.js';

const  credencialesInvalidas = 'Correo o contraseña incorrectos.';
let estrategiasConfiguradas = false;

export function configurarEstrategiasPassport() {
    if (estrategiasConfiguradas) {
        return;
    }

    const secreto = process.env.JWT_SECRET;
    if (!secreto) {
        throw new Error('La variable de entorno JWT_SECRET no está configurada.');
    }

    passport.use('local', new LocalStrategy(
        {
            usernameField: 'correo',
            passwordField: 'contrasena'
        },
        (correo, contrasena, done) => {
            Promise.resolve()
                .then(async () => {
                    if (typeof correo !== 'string' || typeof contrasena !== 'string' || !correo.trim() || !contrasena) {
                        return done(null, false, { message:  credencialesInvalidas });
                    }

                    const usuario = await usuarioRepository.buscarPorCorreo(correo.trim().toLowerCase());
                    if (!usuario || !usuario.activo || !(await bcrypt.compare(contrasena, usuario.contrasena))) {
                        return done(null, false, { message:  credencialesInvalidas });
                    }

                    const { id, rol_id, nombre, apellido, correo: correoUsuario, activo, nombre_rol } = usuario;
                    return done(null, { id, rol_id, nombre, apellido, correo: correoUsuario, activo, nombre_rol });
                })
                .catch(error => done(error));
        }
    ));
    
    passport.use('jwt', new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: secreto,
            algorithms: ['HS256']
        },
        async (payload, done) => {
            try {
                if (!Number.isInteger(payload?.id) || payload.id < 1) {
                    return done(null, false);
                }

                const usuario = await usuarioRepository.buscarPorIdConRol(payload.id);
                if (!usuario || !usuario.activo) {
                    return done(null, false);
                }

                return done(null, usuario);
            } catch (error) {
                return done(error);
            }
        }
    ));

    estrategiasConfiguradas = true;
}

export default passport;
