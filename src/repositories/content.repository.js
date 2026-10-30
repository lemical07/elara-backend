import { pool } from '../config/database.js';

export class ContentRepository {
    async listarPerId(id) {
        const [rows] = await pool.execute(
            `SELECT c.*, cat.nombre AS categoria_nombre 
             FROM contenido c 
             JOIN categoria cat ON c.categoria_id = cat.id 
             WHERE c.id = ? AND c.estado = 'aprobado'`,
            [id]
        );
        return rows[0] || null;
    }

    async listarPersonajePerContenidoId(contentId) {
        const [rows] = await pool.execute(
            `SELECT nombre, tipo FROM personaje WHERE contenido_id = ?`,
            [contentId]
        );
        return rows;
    
    }

    async listarAprobados() {
        const [rows] = await pool.execute(
            `SELECT c.id, c.titulo, c.tipo, c.anio, cat.nombre AS categoria_nombre 
             FROM contenido c 
             JOIN categoria cat ON c.categoria_id = cat.id 
             WHERE c.estado = 'aprobado' 
             ORDER BY c.anio DESC`
        );
        return rows;
    }


    async buscarAprobadosPerCatoegorias(categoriaFiltro) {
        let consulta = `
            SELECT c.titulo AS titulo, cat.nombre AS nombre_categoria, c.release_year AS anio_lanzamiento, c.type AS tipo 
            FROM contents c
            JOIN categoria cat ON c.category_id = cat.id
            WHERE c.status = 'aprobado'
        `;
        const parametros = [];

        if (categoriaFiltro) {
            consulta += ` AND cat.name = ?`;
            parametros.push(categoriaFiltro);
        }

        consulta += ` ORDER BY c.created_at DESC`;

        const [filas] = await pool.query(consulta, parametros);
        return filas;
    }


}