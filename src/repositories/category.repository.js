import pool from '../config/database.js';

class CategoriaRepository {
    async listarCatetgorias() {
        const [rows] = await pool.query('SELECT id, nombre, descripcion FROM categoria');
        return rows;
    }

    }

export default new CategoriaRepository();