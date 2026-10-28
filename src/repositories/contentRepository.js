import { pool } from '../config/database.js';

export class ContentRepository {
    async findById(id) {
        const [rows] = await pool.execute(
            `SELECT c.*, cat.nombre AS categoria_nombre 
             FROM contenido c 
             JOIN categoria cat ON c.categoria_id = cat.id 
             WHERE c.id = ? AND c.estado = 'aprobado'`,
            [id]
        );
        return rows[0] || null;
    }

    async findCharactersByContentId(contentId) {
        const [rows] = await pool.execute(
            `SELECT nombre, tipo FROM personaje WHERE contenido_id = ?`,
            [contentId]
        );
        return rows;
    }
}