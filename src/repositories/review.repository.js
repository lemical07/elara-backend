import pool from '../config/db.js';

class ResenaRepositorio {
    async buscarContenidoPorId(id) {
        const [filas] = await pool.execute(
            `SELECT id, estado
             FROM contenido
             WHERE id = ?`,
            [id]
        );
        return filas[0] ?? null;
    }

    async buscarContenidoAprobadoPorId(id) {
        const [filas] = await pool.execute(
            `SELECT id
             FROM contenido
             WHERE id = ? AND estado = 'aprobado'`,
            [id]
        );
        return filas[0] ?? null;
    }

    async buscarPorUsuarioYContenido(usuarioId, contenidoId) {
        const [filas] = await pool.execute(
            `SELECT id
             FROM review
             WHERE usuario_id = ? AND contenido_id = ?`,
            [usuarioId, contenidoId]
        );
        return filas[0] ?? null;
    }

    async crear({ usuario_id, contenido_id, titulo, comentario, calificacion }) {
        const [resultado] = await pool.execute(
            `INSERT INTO review (usuario_id, contenido_id, titulo, comentario, calificacion)
             VALUES (?, ?, ?, ?, ?)`,
            [usuario_id, contenido_id, titulo, comentario, calificacion]
        );
        return resultado.insertId;
    }

    async buscarResenasPorContenido(contenidoId) {
        const [filas] = await pool.execute(
            `SELECT r.id, r.contenido_id, c.titulo AS contenido_titulo,
                    r.titulo, r.comentario, r.calificacion, r.creado_en, r.actualizado_en,
                    u.nombre AS autor_nombre, u.apellido AS autor_apellido
             FROM review r
             INNER JOIN usuario u ON u.id = r.usuario_id
             INNER JOIN contenido c ON c.id = r.contenido_id
             WHERE r.contenido_id = ? AND c.estado = 'aprobado'
             ORDER BY r.creado_en DESC, r.id DESC`,
            [contenidoId]
        );
        return filas;
    }

    async buscarResenasPorUsuario(usuarioId) {
        const [filas] = await pool.execute(
            `SELECT r.id, r.contenido_id, c.titulo AS contenido_titulo,
                    r.titulo, r.comentario, r.calificacion, r.creado_en, r.actualizado_en,
                    u.nombre AS autor_nombre, u.apellido AS autor_apellido
             FROM review r
             INNER JOIN usuario u ON u.id = r.usuario_id
             INNER JOIN contenido c ON c.id = r.contenido_id
             WHERE r.usuario_id = ? AND c.estado = 'aprobado'
             ORDER BY r.creado_en DESC, r.id DESC`,
            [usuarioId]
        );
        return filas;
    }

    async buscarPorIdVisible(id) {
        const [filas] = await pool.execute(
            `SELECT r.id, r.contenido_id, c.titulo AS contenido_titulo,
                    r.titulo, r.comentario, r.calificacion, r.creado_en, r.actualizado_en,
                    u.nombre AS autor_nombre, u.apellido AS autor_apellido
             FROM review r
             INNER JOIN usuario u ON u.id = r.usuario_id
             INNER JOIN contenido c ON c.id = r.contenido_id
             WHERE r.id = ? AND c.estado = 'aprobado'`,
            [id]
        );
        return filas[0] ?? null;
    }

    async buscarPropietario(id) {
        const [filas] = await pool.execute(
            `SELECT usuario_id
             FROM review
             WHERE id = ?`,
            [id]
        );
        return filas[0] ?? null;
    }

    async actualizarPropia(id, usuarioId, datos) {
        const valores = [];
        const asignaciones = [];

        for (const campo of ['titulo', 'comentario', 'calificacion']) {
            if (Object.hasOwn(datos, campo)) {
                asignaciones.push(`${campo} = ?`);
                valores.push(datos[campo]);
            }
        }

        valores.push(id, usuarioId);
        const [resultado] = await pool.execute(
            `UPDATE review
             SET ${asignaciones.join(', ')}
             WHERE id = ? AND usuario_id = ?`,
            valores
        );
        return resultado.affectedRows > 0;
    }

    async buscarPropiaPorId(id, usuarioId) {
        const [filas] = await pool.execute(
            `SELECT r.id, r.contenido_id, c.titulo AS contenido_titulo,
                    r.titulo, r.comentario, r.calificacion, r.creado_en, r.actualizado_en,
                    u.nombre AS autor_nombre, u.apellido AS autor_apellido
             FROM review r
             INNER JOIN usuario u ON u.id = r.usuario_id
             INNER JOIN contenido c ON c.id = r.contenido_id
             WHERE r.id = ? AND r.usuario_id = ?`,
            [id, usuarioId]
        );
        return filas[0] ?? null;
    }

    async eliminarPropia(id, usuarioId) {
        const [resultado] = await pool.execute(
            `DELETE FROM review
             WHERE id = ? AND usuario_id = ?`,
            [id, usuarioId]
        );
        return resultado.affectedRows > 0;
    }
}

export default new ResenaRepositorio();
