import pool from '../config/db.js';

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


    async buscarAprobadosPerCatoegorias(categoriaFiltro) {
        let consulta = `
             SELECT c.titulo AS titulo, cat.nombre AS nombre_categoria, c.anio AS anio_lanzamiento, c.tipo AS tipo 
            FROM contenido c
            JOIN categoria cat ON c.id = cat.id
            WHERE c.estado = 'aprobado';
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