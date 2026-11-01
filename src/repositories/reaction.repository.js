import pool from '../config/db.js';

class ReaccionRepositorio {
    async buscarResenaVisible(resenaId) {
        const [filas] = await pool.execute(
            `SELECT r.id, r.usuario_id, r.titulo, r.calificacion, c.titulo AS contenido_titulo
             FROM review r
             INNER JOIN contenido c ON c.id = r.contenido_id
             WHERE r.id = ? AND c.estado = 'aprobado'`,
            [resenaId]
        );
        return filas[0] ?? null;
    }

    async registrarOActualizar(usuarioId, visitanteId, resenaId, tipo) {
        const [resultado] = await pool.execute(
            `INSERT INTO reaccion (usuario_id, visitante_id, review_id, tipo)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE tipo = IF(tipo <> VALUES(tipo), VALUES(tipo), tipo)`,
            [usuarioId, visitanteId, resenaId, tipo]
        );

        return {
            creada: resultado.affectedRows === 1,
            cambio: resultado.affectedRows !== 0
        };
    }

    async buscarPropia(usuarioId, visitanteId, resenaId) {
        const columnaIdentidad = usuarioId ? 'usuario_id' : 'visitante_id';
        const idIdentidad = usuarioId || visitanteId;
        const [filas] = await pool.execute(
            `SELECT review_id, tipo
             FROM reaccion
             WHERE ${columnaIdentidad} = ? AND review_id = ?`,
            [idIdentidad, resenaId]
        );
        return filas[0] ?? null;
    }

    async actualizarPropia(usuarioId, visitanteId, resenaId, tipo) {
        const columnaIdentidad = usuarioId ? 'usuario_id' : 'visitante_id';
        const idIdentidad = usuarioId || visitanteId;
        const [resultado] = await pool.execute(
            `UPDATE reaccion
             SET tipo = ?
             WHERE ${columnaIdentidad} = ? AND review_id = ?`,
            [tipo, idIdentidad, resenaId]
        );
        return resultado.affectedRows > 0;
    }

    async eliminarPropia(usuarioId, visitanteId, resenaId) {
        const columnaIdentidad = usuarioId ? 'usuario_id' : 'visitante_id';
        const idIdentidad = usuarioId || visitanteId;
        const [resultado] = await pool.execute(
            `DELETE FROM reaccion
             WHERE ${columnaIdentidad} = ? AND review_id = ?`,
            [idIdentidad, resenaId]
        );
        return resultado.affectedRows > 0;
    }

    async obtenerTotales(resenaId) {
        const [filas] = await pool.execute(
            `SELECT ? AS review_id,
                    COALESCE(SUM(tipo = 'like'), 0) AS total_likes,
                    COALESCE(SUM(tipo = 'dislike'), 0) AS total_dislikes
             FROM reaccion
             WHERE review_id = ?`,
            [resenaId, resenaId]
        );
        return filas[0];
    }

    async listarPropias(usuarioId, visitanteId) {
        const columnaIdentidad = usuarioId ? 'r.usuario_id' : 'r.visitante_id';
        const idIdentidad = usuarioId || visitanteId;
        const [filas] = await pool.execute(
            `SELECT r.review_id, r.tipo,
                    v.titulo AS review_titulo,
                    v.calificacion AS review_calificacion,
                    c.titulo AS contenido_titulo
             FROM reaccion r
             INNER JOIN review v ON v.id = r.review_id
             INNER JOIN contenido c ON c.id = v.contenido_id
             WHERE ${columnaIdentidad} = ? AND c.estado = 'aprobado'
             ORDER BY r.review_id DESC`,
            [idIdentidad]
        );
        return filas;
    }
}

export default new ReaccionRepositorio();
