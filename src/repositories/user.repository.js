
import pool from "../config/db.js";

const BLOQUEO_ADMINISTRADORES = 'elara:registro-y-admins';

function crearError(mensaje, status) {
    const error = new Error(mensaje);
    error.status = status;
    return error;
}

export class UsuarioRepositorio {
    constructor(conexionPool = pool) {
        this.pool = conexionPool;
    }

    async ejecutarConBloqueo(operacion) {
        const conexion = await this.pool.getConnection();
        let bloqueoAdquirido = false;
        let transaccionIniciada = false;
        let errorOperacion = null;
        let conexionDestruida = false;

        try {
            const [bloqueos] = await conexion.execute(
                'SELECT GET_LOCK(?, 10) AS adquirido',
                [BLOQUEO_ADMINISTRADORES]
            );
            if (bloqueos[0]?.adquirido !== 1) {
                throw crearError('El servicio de cuentas está ocupado. Inténtalo de nuevo.', 503);
            }
            bloqueoAdquirido = true;

            await conexion.beginTransaction();
            transaccionIniciada = true;
            const resultado = await operacion(conexion);
            await conexion.commit();
            transaccionIniciada = false;
            return resultado;
        } catch (error) {
            errorOperacion = error;
            if (transaccionIniciada) {
                try {
                    await conexion.rollback();
                } catch (errorRollback) {
                    error.cause ??= errorRollback;
                    conexion.destroy();
                    conexionDestruida = true;
                }
            }
            throw error;
        } finally {
            if (bloqueoAdquirido && !conexionDestruida) {
                try {
                    await conexion.execute(
                        'SELECT RELEASE_LOCK(?) AS liberado',
                        [BLOQUEO_ADMINISTRADORES]
                    );
                } catch (errorLiberacion) {
                    conexion.destroy();
                    conexionDestruida = true;
                    if (errorOperacion) {
                        errorOperacion.cause ??= errorLiberacion;
                    } else {
                        console.error('[DB] No fue posible liberar el bloqueo de cuentas.');
                    }
                }
            }
            if (!conexionDestruida) {
                conexion.release();
            }
        }
    }

    async registrarAtomico(operacion) {
        return this.ejecutarConBloqueo(operacion);
    }

    async crear({rol_id, nombre, apellido, correo, contrasena}, conexion = this.pool) {
        const [resultado] = await conexion.execute(
            `INSERT INTO usuario(rol_id, nombre, apellido, correo, contrasena)
             VALUES (?, ?, ?, ?, ?)`,
            [rol_id, nombre, apellido, correo, contrasena]
        );
        return this.buscarPorId(resultado.insertId, conexion);
    }

    async obtenerTodos() {
        const [filas] = await pool.execute(
            `SELECT u.id, u.rol_id, u.nombre, u.apellido, u.correo, u.activo, r.nombre_rol
             FROM usuario u
             INNER JOIN rol r ON r.id = u.rol_id
             ORDER BY u.id`
        );

        return filas;
    }

    async buscarPorId(id, conexion = this.pool) {
        const [filas] = await conexion.execute(
            `SELECT u.id, u.rol_id, u.nombre, u.apellido, u.correo, u.activo, r.nombre_rol
             FROM usuario u
             INNER JOIN rol r ON r.id = u.rol_id
             WHERE u.id = ?`,
            [id]
        );

        return filas[0] ?? null;
    }

    async buscarPorIdConContrasena(id) {
        const [filas] = await pool.execute(
            `SELECT id, contrasena, activo
             FROM usuario
             WHERE id = ?`,
            [id]
        );
        return filas[0] ?? null;
    }

    async buscarPorCorreo(correo, conexion = this.pool) {
        const [filas] = await conexion.execute(
            `SELECT u.id, u.rol_id, u.nombre, u.apellido, u.correo, u.contrasena, u.activo,
                    r.nombre_rol
             FROM usuario u
             INNER JOIN rol r ON r.id = u.rol_id
             WHERE u.correo = ?`,
            [correo]
        );
        return filas[0] ?? null;
    }

    async buscarPorIdConRol(id, conexion = this.pool) {
        const [filas] = await conexion.execute(
            `SELECT u.id, u.rol_id, u.nombre, u.apellido, u.correo, u.activo, r.nombre_rol
             FROM usuario u
             INNER JOIN rol r ON r.id = u.rol_id
             WHERE u.id = ?`,
            [id]
        );
        return filas[0] ?? null;
    }

    async buscarRolPorNombre(nombreRol, conexion = this.pool) {
        const [filas] = await conexion.execute(
            `SELECT id, nombre_rol
             FROM rol
             WHERE LOWER(nombre_rol) = LOWER(?)
             LIMIT 1`,
            [nombreRol]
        );
        return filas[0] ?? null;
    }

    async actualizar(id, { nombre, apellido, correo }) {
        await pool.execute(
            `UPDATE usuario SET nombre = ?, apellido = ?, correo = ? WHERE id = ?`,
            [nombre, apellido, correo, id]
        );
        return this.buscarPorId(id);
    }

    async actualizarContrasena(id, contrasena) {
        const [resultado] = await pool.execute(
            `UPDATE usuario SET contrasena = ? WHERE id = ?`,
            [contrasena, id]
        );
        return resultado.affectedRows > 0;
    }

    async actualizarEstado(id, activo) {
        return this.ejecutarConBloqueo(async conexion => {
            const [usuarios] = await conexion.execute(
                `SELECT u.id, u.activo, r.nombre_rol
                 FROM usuario u
                 INNER JOIN rol r ON r.id = u.rol_id
                 WHERE u.id = ?
                 FOR UPDATE`,
                [id]
            );
            const usuario = usuarios[0];
            if (!usuario) {
                return null;
            }

            const esAdmin = ['admin', 'administrador'].includes(usuario.nombre_rol.trim().toLowerCase());
            if (!activo && usuario.activo && esAdmin) {
                const [administradoresActivos] = await conexion.execute(
                    `SELECT u.id
                     FROM usuario u
                     INNER JOIN rol r ON r.id = u.rol_id
                     WHERE u.activo = TRUE
                       AND LOWER(r.nombre_rol) IN ('admin', 'administrador')
                     ORDER BY u.id
                     FOR UPDATE`
                );

                if (administradoresActivos.length <= 1) {
                    throw crearError('No se puede desactivar la última cuenta administradora activa.', 409);
                }
            }

            await conexion.execute(
                `UPDATE usuario SET activo = ? WHERE id = ?`,
                [activo, id]
            );
            return this.buscarPorId(id, conexion);
        });
    }

    async eliminar(id) {
        return this.ejecutarConBloqueo(async conexion => {
            const [filas] = await conexion.execute(
                `SELECT u.activo, r.nombre_rol
                 FROM usuario u
                 INNER JOIN rol r ON r.id = u.rol_id
                 WHERE u.id = ?
                 FOR UPDATE`,
                [id]
            );
            const usuario = filas[0];
            if (!usuario) {
                return false;
            }

            const esAdmin = ['admin', 'administrador'].includes(usuario.nombre_rol.trim().toLowerCase());
            if (usuario.activo && esAdmin) {
                const [administradoresActivos] = await conexion.execute(
                    `SELECT u.id
                     FROM usuario u
                     INNER JOIN rol r ON r.id = u.rol_id
                     WHERE u.activo = TRUE
                       AND LOWER(r.nombre_rol) IN ('admin', 'administrador')
                     ORDER BY u.id
                     FOR UPDATE`
                );

                if (administradoresActivos.length <= 1) {
                    throw crearError('No se puede eliminar la última cuenta administradora activa.', 409);
                }
            }

            const [resultado] = await conexion.execute(
                `DELETE FROM usuario WHERE id = ?`,
                [id]
            );
            return resultado.affectedRows > 0;
        });
    }

    async actualizarRol(id, rol) {
        return this.ejecutarConBloqueo(async conexion => {
            const nombreRol = rol === 'ADMIN' ? 'Administrador' : 'Usuario';
            const [roles] = await conexion.execute(
                `SELECT id, nombre_rol
                 FROM rol
                 WHERE LOWER(nombre_rol) = LOWER(?)
                 LIMIT 1`,
                [nombreRol]
            );
            const nuevoRol = roles[0];
            if (!nuevoRol) {
                throw crearError('No está configurado el rol solicitado.', 503);
            }

            const [usuarios] = await conexion.execute(
                `SELECT u.id, u.rol_id, u.activo, r.nombre_rol
                 FROM usuario u
                 INNER JOIN rol r ON r.id = u.rol_id
                 WHERE u.id = ?
                 FOR UPDATE`,
                [id]
            );
            const usuario = usuarios[0];
            if (!usuario) {
                return null;
            }

            const esAdminActual = ['admin', 'administrador'].includes(usuario.nombre_rol.trim().toLowerCase());
            if (usuario.activo && esAdminActual && rol === 'USUARIO') {
                const [administradoresActivos] = await conexion.execute(
                    `SELECT u.id
                     FROM usuario u
                     INNER JOIN rol r ON r.id = u.rol_id
                     WHERE u.activo = TRUE
                       AND LOWER(r.nombre_rol) IN ('admin', 'administrador')
                     FOR UPDATE`
                );
                if (administradoresActivos.length <= 1) {
                    throw crearError('No se puede retirar el acceso al último administrador activo.', 409);
                }
            }

            await conexion.execute(
                `UPDATE usuario SET rol_id = ? WHERE id = ?`,
                [nuevoRol.id, id]
            );
            return this.buscarPorId(id, conexion);
        });
    }
}

export default new UsuarioRepositorio();
