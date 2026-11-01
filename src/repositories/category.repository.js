import pool from '../config/db.js';

class CategoriaRepositorio {
    async listarCategorias() {
        const [filas] = await pool.query('SELECT id, nombre, descripcion FROM categoria');
        return filas;
    }
    async buscarCategoriaPorId(id) {
        const [filas] = await pool.query('SELECT id, nombre, descripcion FROM categoria WHERE id = ?', [id]);
        return filas[0] ?? null;
    }

    async crearCategoria(nombre, descripcion) {
        const [resultado] = await pool.query(
            'INSERT INTO categoria (nombre, descripcion) VALUES (?, ?)',
            [nombre, descripcion || null]
        );
        return resultado.insertId;
    }

    async actualizarCategoria(id, nombre, descripcion) {
        const [resultado] = await pool.query(
            'UPDATE categoria SET nombre = ?, descripcion = ? WHERE id = ?',
            [nombre, descripcion, id]
        );
        return resultado.affectedRows > 0;
    }

    async eliminarCategoria(id) {
        const [resultado] = await pool.query('DELETE FROM categoria WHERE id = ?', [id]);
        return resultado.affectedRows > 0;
    }
}

export default new CategoriaRepositorio();