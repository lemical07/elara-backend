
import pool from "../config/db.js";

class UsuarioRepository {
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
            `SELECT id, rol_id, nombre, apellido, correo, activo
             FROM usuario`
        );

        return filas;
    }

    async buscarPorId(id) {
        const [filas] = await pool.execute(
            `SELECT id, rol_id, nombre, apellido, correo, activo FROM usuario WHERE id = ?`,
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

    async actualizar(id, { rol_id, nombre, apellido, correo}) {
        const [resultado] = await pool.execute(
            `UPDATE usuario SET rol_id = ?, nombre = ?, apellido = ?, correo = ? WHERE id = ?`,
            [rol_id, nombre, apellido, correo, id]
        );

        if (resultado.affectedRows === 0) {
            return null;
        }

        return this.buscarPorId(id);
    }

    async actualizarEstado(id, activo) {
        const [resultado] = await pool.execute(
            `UPDATE usuario SET activo = ? WHERE id = ?`,
            [activo, id]
        );

        if (resultado.affectedRows === 0) {
            return null;
        }

        return this.buscarPorId(id);
    }

    async eliminar(id) {
        const [resultado] = await pool.execute(
            `DELETE FROM usuario WHERE id = ?`,
            [id]
        );

        return resultado.affectedRows > 0;
    }
}

export default new UsuarioRepository();
