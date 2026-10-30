import pool from '../config/db.js';

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

    async findApproved() {
        const [rows] = await pool.execute(
            `SELECT c.id, c.titulo, c.descripcion, c.tipo, c.anio, c.director,
                    c.url_imagen, c.url_trailer, c.estado,
                    cat.nombre AS categoria_nombre
             FROM contenido c 
             JOIN categoria cat ON c.categoria_id = cat.id 
             WHERE c.estado = 'aprobado' 
             ORDER BY c.anio DESC`
        );
        return rows;
    }


    async buscarAprobados(categoriaFiltro) {
        let consulta = `
            SELECT c.title AS titulo, cat.name AS nombre_categoria, c.release_year AS anio_lanzamiento, c.type AS tipo 
            FROM contents c
            JOIN categories cat ON c.category_id = cat.id
            WHERE c.status = 'approved'
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