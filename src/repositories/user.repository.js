
import pool from "../config/database.js";

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
            `SELECT id, rol_id, nombre, apellido, correo, contrasena, activo FROM usuario WHERE correo = ?`,
            [correo]
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
