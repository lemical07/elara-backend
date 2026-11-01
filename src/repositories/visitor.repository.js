import pool from '../config/db.js';

class VisitanteRepositorio {
    async buscarPorToken(token) {
        const [filas] = await pool.execute(
            `SELECT id, token
             FROM visitante
             WHERE token = ?`,
            [token]
        );
        return filas[0] ?? null;
    }

    async crear(token) {
        const [resultado] = await pool.execute(
            `INSERT INTO visitante (token)
             VALUES (?)`,
            [token]
        );
        return { id: resultado.insertId, token };
    }
}

export default new VisitanteRepositorio();
