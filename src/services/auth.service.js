import { randomInt } from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import usuarioRepositorio from '../repositories/user.repository.js';

const ROL_ADMIN_NOMBRE = 'Administrador';
const ROL_USUARIO_NOMBRE = 'Usuario';
const CARACTERES_MAYUSCULAS = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
const CARACTERES_MINUSCULAS = 'abcdefghijkmnpqrstuvwxyz';
const CARACTERES_NUMERICOS = '23456789';
const CARACTERES_ESPECIALES = '!@#$%&*+-_=';
const LONGITUD_CONTRASENA_TEMPORAL = 13;

export function generarContrasenaTemporal() {
    const caracteres = [
        CARACTERES_MAYUSCULAS[randomInt(CARACTERES_MAYUSCULAS.length)],
        CARACTERES_MINUSCULAS[randomInt(CARACTERES_MINUSCULAS.length)],
        CARACTERES_NUMERICOS[randomInt(CARACTERES_NUMERICOS.length)],
        CARACTERES_ESPECIALES[randomInt(CARACTERES_ESPECIALES.length)]
    ];
    const conjunto = CARACTERES_MAYUSCULAS
        + CARACTERES_MINUSCULAS
        + CARACTERES_NUMERICOS
        + CARACTERES_ESPECIALES;

    while (caracteres.length < LONGITUD_CONTRASENA_TEMPORAL) {
        caracteres.push(conjunto[randomInt(conjunto.length)]);
    }

    for (let indice = caracteres.length - 1; indice > 0; indice -= 1) {
        const indiceAleatorio = randomInt(indice + 1);
        [caracteres[indice], caracteres[indiceAleatorio]] =
            [caracteres[indiceAleatorio], caracteres[indice]];
    }

    return caracteres.join('');
}

class AutenticacionServicio {
    constructor(
        repositorio = usuarioRepositorio,
        generadorContrasena = generarContrasenaTemporal
    ) {
        this.usuarioRepositorio = repositorio;
        this.generadorContrasena = generadorContrasena;
    }

    async registrar(entrada) {
        const datos = {
            nombre: entrada.nombre.trim(),
            apellido: entrada.apellido.trim(),
            correo: entrada.correo.trim().toLowerCase()
        };

        try {
            return await this.usuarioRepositorio.registrarAtomico(async conexion => {
                const usuarioExistente = await this.usuarioRepositorio.buscarPorCorreo(datos.correo, conexion);
                if (usuarioExistente) {
                    throw this.crearError('El correo electrónico ya está registrado.', 409);
                }

                const [conteoUsuarios] = await conexion.execute(
                    'SELECT COUNT(*) AS total FROM usuario'
                );
                const esPrimerAdministrador = Number(conteoUsuarios[0].total) === 0;
                let contrasena;
                let nombreRol;

                if (esPrimerAdministrador) {
                    if (Object.hasOwn(entrada, 'contrasena')) {
                        throw this.crearError('La contraseña del primer administrador se genera automáticamente.', 400);
                    }
                    contrasena = this.generadorContrasena();
                    nombreRol = ROL_ADMIN_NOMBRE;
                } else {
                    if (typeof entrada.contrasena !== 'string' || !entrada.contrasena) {
                        throw this.crearError('La contraseña es obligatoria para registrar una cuenta.', 400);
                    }
                    contrasena = entrada.contrasena;
                    nombreRol = ROL_USUARIO_NOMBRE;
                }

                const rol = await this.usuarioRepositorio.buscarRolPorNombre(nombreRol, conexion);
                if (!rol) {
                    throw this.crearError(`No está configurado el rol ${nombreRol} para registrar cuentas.`, 503);
                }

                const contrasenaHash = await bcrypt.hash(contrasena, 10);
                const usuarioCreado = await this.usuarioRepositorio.crear({
                    rol_id: rol.id,
                    nombre: datos.nombre,
                    apellido: datos.apellido,
                    correo: datos.correo,
                    contrasena: contrasenaHash
                }, conexion);
                const usuario = await this.usuarioRepositorio.buscarPorIdConRol(usuarioCreado.id, conexion);

                if (!usuario) {
                    throw new Error('No fue posible recuperar el usuario recién registrado.');
                }

                return {
                    usuario: this.usuarioPublico(usuario),
                    token: this.crearToken(usuario),
                    ...(esPrimerAdministrador
                        ? {
                            primer_administrador: true,
                            contrasena_temporal: contrasena
                        }
                        : {})
                };
            });
        } catch (causa) {
            if (causa.code === 'ER_DUP_ENTRY') {
                throw this.crearError('El correo electrónico ya está registrado.', 409);
            }
            throw causa;
        }
    }

    usuarioPublico(usuario) {
        const { id, rol_id, nombre, apellido, correo, activo, nombre_rol } = usuario;
        return { id, rol_id, nombre, apellido, correo, activo, rol: nombre_rol };
    }

    crearToken(usuario) {
        const secreto = process.env.JWT_SECRET;
        if (!secreto) {
            throw new Error('La variable de entorno JWT_SECRET no está configurada.');
        }

        return jwt.sign(
            { id: usuario.id },
            secreto,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );
    }

    crearError(mensaje, status) {
        const error = new Error(mensaje);
        error.status = status;
        return error;
    }
}

export default AutenticacionServicio;
