import pool from '../config/db.js';

export class ContenidoRepositorio {
    async buscarPorId(id) {
        const [filas] = await pool.execute(
            `SELECT c.*, cat.nombre AS categoria_nombre 
             FROM contenido c 
             JOIN categoria cat ON c.categoria_id = cat.id 
             WHERE c.id = ? AND c.estado = 'aprobado'`,
            [id]
        );
        return filas[0] || null;
    }

    async listarPersonajesPorContenidoId(contenidoId) {
        const [filas] = await pool.execute(
            `SELECT nombre, tipo FROM personaje WHERE contenido_id = ?`,
            [contenidoId]
        );
        return filas;
    
    }

    async listarAprobados() {
        const [filas] = await pool.execute(
            `SELECT c.id, c.titulo, c.descripcion, c.tipo, c.anio, c.director,
                    c.url_imagen, c.url_trailer, c.estado,
                    cat.nombre AS categoria_nombre
             FROM contenido c 
             JOIN categoria cat ON c.categoria_id = cat.id 
             WHERE c.estado = 'aprobado' 
             ORDER BY c.anio DESC`
        );
        return filas;
    }


    async listarAprobadosPorCategoria(categoriaFiltro) {
        let consulta = `
             SELECT c.titulo AS titulo, cat.nombre AS nombre_categoria, c.anio AS anio_lanzamiento, c.tipo AS tipo 
            FROM contenido c
            JOIN categoria cat ON c.categoria_id = cat.id
            WHERE c.estado = 'aprobado'
        `;
        const parametros = [];

        if (categoriaFiltro) {
            consulta += ` AND cat.nombre = ?`;
            parametros.push(categoriaFiltro);
        }

        consulta += ` ORDER BY c.anio DESC`;

        const [filas] = await pool.execute(consulta, parametros);
        return filas;
    }


}