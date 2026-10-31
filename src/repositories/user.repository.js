
import pool from "../config/db.js";

class UsuarioRepositorio {
    async crear({rol_id, nombre, apellido, correo, contrasena}) {
        const [resultado] = await pool.execute(
            `INSERT INTO usuario(rol_id, nombre, apellido, correo, contrasena)
             VALUES (?, ?, ?, ?, ?)`,
            [rol_id, nombre, apellido, correo, contrasena]
        );
        return this.buscarPorId(resultado.insertId);
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

    async buscarPorId(id) {
        const [filas] = await pool.execute(
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

    async buscarPorCorreo(correo) {
        const [filas] = await pool.execute(
            `SELECT u.id, u.rol_id, u.nombre, u.apellido, u.correo, u.contrasena, u.activo,
                    r.nombre_rol
             FROM usuario u
             INNER JOIN rol r ON r.id = u.rol_id
             WHERE u.correo = ?`,
            [correo]
        );
        return filas[0] ?? null;
    }

    async buscarPorIdConRol(id) {
        const [filas] = await pool.execute(
            `SELECT u.id, u.rol_id, u.nombre, u.apellido, u.correo, u.activo, r.nombre_rol
             FROM usuario u
             INNER JOIN rol r ON r.id = u.rol_id
             WHERE u.id = ?`,
            [id]
        );
        return filas[0] ?? null;
    }

    async buscarRolPorNombre(nombreRol) {
        const [filas] = await pool.execute(
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
        const conexion = await pool.getConnection();
        let transaccionIniciada = false;

        try {
            await conexion.beginTransaction();
            transaccionIniciada = true;

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
                await conexion.rollback();
                transaccionIniciada = false;
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
                    await conexion.rollback();
                    transaccionIniciada = false;
                    const error = new Error('No se puede desactivar la última cuenta administradora activa.');
                    error.status = 409;
                    throw error;
                }
            }

            await conexion.execute(
                `UPDATE usuario SET activo = ? WHERE id = ?`,
                [activo, id]
            );
            await conexion.commit();
            transaccionIniciada = false;
            return this.buscarPorId(id);
        } catch (error) {
            if (transaccionIniciada) {
                await conexion.rollback();
            }
            throw error;
        } finally {
            conexion.release();
        }
    }

    async eliminar(id) {
        const [resultado] = await pool.execute(
            `DELETE FROM usuario WHERE id = ?`,
            [id]
        );

        return resultado.affectedRows > 0;
    }
}

export default new UsuarioRepositorio();
