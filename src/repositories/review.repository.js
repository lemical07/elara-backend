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

    async buscarPorIdentidadYContenido(usuarioId, visitanteId, contenidoId) {
        const columnaIdentidad = usuarioId ? 'usuario_id' : 'visitante_id';
        const idIdentidad = usuarioId || visitanteId;
        const [filas] = await pool.execute(
            `SELECT id
             FROM review
             WHERE ${columnaIdentidad} = ? AND contenido_id = ?`,
            [idIdentidad, contenidoId]
        );
        return filas[0] ?? null;
    }

    async crear({ usuario_id, visitante_id, contenido_id, nombre_visitante, titulo, comentario, calificacion }) {
        const [resultado] = await pool.execute(
            `INSERT INTO review
                (usuario_id, visitante_id, contenido_id, nombre_visitante, titulo, comentario, calificacion)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [usuario_id, visitante_id, contenido_id, nombre_visitante, titulo, comentario, calificacion]
        );
        return resultado.insertId;
    }

    async buscarResenasPorContenido(contenidoId) {
        const [filas] = await pool.execute(
            `SELECT r.id, r.contenido_id, c.titulo AS contenido_titulo,
                    r.titulo, r.comentario, r.calificacion, r.creado_en, r.actualizado_en,
                    COALESCE(
                        NULLIF(r.nombre_visitante, ''),
                        NULLIF(CONCAT_WS(' ', u.nombre, u.apellido), ''),
                        'Anónimo'
                    ) AS autor_nombre,
                    u.apellido AS autor_apellido
             FROM review r
             LEFT JOIN usuario u ON u.id = r.usuario_id
             INNER JOIN contenido c ON c.id = r.contenido_id
             WHERE r.contenido_id = ? AND c.estado = 'aprobado'
             ORDER BY r.creado_en DESC, r.id DESC`,
            [contenidoId]
        );
        return filas;
    }

    async buscarResenasPorIdentidad(usuarioId, visitanteId) {
        const columnaIdentidad = usuarioId ? 'r.usuario_id' : 'r.visitante_id';
        const idIdentidad = usuarioId || visitanteId;
        const [filas] = await pool.execute(
            `SELECT r.id, r.contenido_id, c.titulo AS contenido_titulo,
                    r.titulo, r.comentario, r.calificacion, r.creado_en, r.actualizado_en,
                    COALESCE(
                        NULLIF(r.nombre_visitante, ''),
                        NULLIF(CONCAT_WS(' ', u.nombre, u.apellido), ''),
                        'Anónimo'
                    ) AS autor_nombre,
                    u.apellido AS autor_apellido
             FROM review r
             LEFT JOIN usuario u ON u.id = r.usuario_id
             INNER JOIN contenido c ON c.id = r.contenido_id
             WHERE ${columnaIdentidad} = ? AND c.estado = 'aprobado'
             ORDER BY r.creado_en DESC, r.id DESC`,
            [idIdentidad]
        );
        return filas;
    }

    async buscarPorIdVisible(id) {
        const [filas] = await pool.execute(
            `SELECT r.id, r.contenido_id, c.titulo AS contenido_titulo,
                    r.titulo, r.comentario, r.calificacion, r.creado_en, r.actualizado_en,
                    COALESCE(
                        NULLIF(r.nombre_visitante, ''),
                        NULLIF(CONCAT_WS(' ', u.nombre, u.apellido), ''),
                        'Anónimo'
                    ) AS autor_nombre,
                    u.apellido AS autor_apellido
             FROM review r
             LEFT JOIN usuario u ON u.id = r.usuario_id
             INNER JOIN contenido c ON c.id = r.contenido_id
             WHERE r.id = ? AND c.estado = 'aprobado'`,
            [id]
        );
        return filas[0] ?? null;
    }

    async buscarPropietario(id) {
        const [filas] = await pool.execute(
            `SELECT usuario_id, visitante_id
             FROM review
             WHERE id = ?`,
            [id]
        );
        return filas[0] ?? null;
    }

    async actualizarPropia(id, usuarioId, visitanteId, datos) {
        const valores = [];
        const asignaciones = [];

        for (const campo of ['titulo', 'comentario', 'calificacion']) {
            if (Object.hasOwn(datos, campo)) {
                asignaciones.push(`${campo} = ?`);
                valores.push(datos[campo]);
            }
        }

        const columnaIdentidad = usuarioId ? 'usuario_id' : 'visitante_id';
        const idIdentidad = usuarioId || visitanteId;
        valores.push(id, idIdentidad);
        const [resultado] = await pool.execute(
            `UPDATE review
             SET ${asignaciones.join(', ')}
             WHERE id = ? AND ${columnaIdentidad} = ?`,
            valores
        );
        return resultado.affectedRows > 0;
    }

    async buscarPropiaPorId(id, usuarioId, visitanteId) {
        const columnaIdentidad = usuarioId ? 'r.usuario_id' : 'r.visitante_id';
        const idIdentidad = usuarioId || visitanteId;
        const [filas] = await pool.execute(
            `SELECT r.id, r.contenido_id, c.titulo AS contenido_titulo,
                    r.titulo, r.comentario, r.calificacion, r.creado_en, r.actualizado_en,
                    COALESCE(
                        NULLIF(r.nombre_visitante, ''),
                        NULLIF(CONCAT_WS(' ', u.nombre, u.apellido), ''),
                        'Anónimo'
                    ) AS autor_nombre,
                    u.apellido AS autor_apellido
             FROM review r
             LEFT JOIN usuario u ON u.id = r.usuario_id
             INNER JOIN contenido c ON c.id = r.contenido_id
             WHERE r.id = ? AND ${columnaIdentidad} = ? AND c.estado = 'aprobado'`,
            [id, idIdentidad]
        );
        return filas[0] ?? null;
    }

    async eliminarPropia(id, usuarioId, visitanteId) {
        const columnaIdentidad = usuarioId ? 'usuario_id' : 'visitante_id';
        const idIdentidad = usuarioId || visitanteId;
        const [resultado] = await pool.execute(
            `DELETE FROM review
             WHERE id = ? AND ${columnaIdentidad} = ?`,
            [id, idIdentidad]
        );
        return resultado.affectedRows > 0;
    }
}

export default new ResenaRepositorio();
