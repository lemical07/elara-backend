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

    async crearCategoria(nombre, descripcion) {
        const [result] = await pool.query(
            'INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion || null]
        );
        return result.insertId;
    }

    }

export default new CategoriaRepository();