import pool from '../config/db.js';

class ReactionRepository {
    async buscarResenaVisible(reviewId) {
        const [filas] = await pool.execute(
            `SELECT r.id, r.usuario_id, r.titulo, r.calificacion, c.titulo AS contenido_titulo
             FROM review r
             INNER JOIN contenido c ON c.id = r.contenido_id
             WHERE r.id = ? AND c.estado = 'aprobado'`,
            [reviewId]
        );
        return filas[0] ?? null;
    }

    async registrarOActualizar(usuarioId, reviewId, tipo) {
        const [resultado] = await pool.execute(
            `INSERT INTO reaccion (usuario_id, review_id, tipo)
             VALUES (?, ?, ?)
             ON DUPLICATE KEY UPDATE tipo = IF(tipo <> VALUES(tipo), VALUES(tipo), tipo)`,
            [usuarioId, reviewId, tipo]
        );

        return {
            creada: resultado.affectedRows === 1,
            cambio: resultado.affectedRows !== 0
        };
    }

    async buscarPropia(usuarioId, reviewId) {
        const [filas] = await pool.execute(
            `SELECT review_id, tipo
             FROM reaccion
             WHERE usuario_id = ? AND review_id = ?`,
            [usuarioId, reviewId]
        );
        return filas[0] ?? null;
    }

    async actualizarPropia(usuarioId, reviewId, tipo) {
        const [resultado] = await pool.execute(
            `UPDATE reaccion
             SET tipo = ?
             WHERE usuario_id = ? AND review_id = ?`,
            [tipo, usuarioId, reviewId]
        );
        return resultado.affectedRows > 0;
    }

    async eliminarPropia(usuarioId, reviewId) {
        const [resultado] = await pool.execute(
            `DELETE FROM reaccion
             WHERE usuario_id = ? AND review_id = ?`,
            [usuarioId, reviewId]
        );
        return resultado.affectedRows > 0;
    }

    async obtenerTotales(reviewId) {
        const [filas] = await pool.execute(
            `SELECT ? AS review_id,
                    COALESCE(SUM(tipo = 'like'), 0) AS total_likes,
                    COALESCE(SUM(tipo = 'dislike'), 0) AS total_dislikes
             FROM reaccion
             WHERE review_id = ?`,
            [reviewId, reviewId]
        );
        return filas[0];
    }

    async listarPropias(usuarioId) {
        const [filas] = await pool.execute(
            `SELECT r.review_id, r.tipo,
                    v.titulo AS review_titulo,
                    v.calificacion AS review_calificacion,
                    c.titulo AS contenido_titulo
             FROM reaccion r
             INNER JOIN review v ON v.id = r.review_id
             INNER JOIN contenido c ON c.id = v.contenido_id
             WHERE r.usuario_id = ? AND c.estado = 'aprobado'
             ORDER BY r.review_id DESC`,
            [usuarioId]
        );
        return filas;
    }
}

export default new ReactionRepository();
