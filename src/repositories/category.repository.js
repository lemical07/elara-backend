import pool from '../config/database.js';

class CategoriaRepository {
    async listarCatetgorias() {
        const [rows] = await pool.query('SELECT id, nombre, descripcion FROM categoria');
        return rows;
    }
    async listarCategorriasId (id) {
        const [rows] = await pool.query('SELECT id, nombre, descripcion FROM categoria WHERE id = ?', [id]);
        return rows[0];
    }

    }

export default new CategoriaRepository();