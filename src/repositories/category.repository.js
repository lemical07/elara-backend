import pool from '../config/db.js';

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

    async actualizarCategoria(id, nombre, descripcion) {
        const [result] = await pool.query(
            'UPDATE categoria SET nombre = ?, descripcion = ? WHERE id = ?',
            [nombre, descripcion, id]
        );
        return result.affectedRows > 0;
    }

    async eliminarCategoria(id) {
        const [result] = await pool.query('DELETE FROM categoria WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    }

export default new CategoriaRepository();