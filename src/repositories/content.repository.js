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

    async buscarAdministrativoPorId(id) {
        const [filas] = await pool.execute(
            `SELECT c.*, cat.nombre AS categoria_nombre
             FROM contenido c
             INNER JOIN categoria cat ON cat.id = c.categoria_id
             WHERE c.id = ?`,
            [id]
        );
        return filas[0] ?? null;
    }

    async listarPersonajesPorContenidoId(contenidoId) {
        const [filas] = await pool.execute(
            `SELECT id, nombre, tipo FROM personaje WHERE contenido_id = ? ORDER BY id`,
            [contenidoId]
        );
        return filas;
    }

    async listarAprobadosPorFiltros(filtros = {}) {
        const condiciones = [`c.estado = 'aprobado'`];
        const parametros = [];

        if (filtros.titulo) {
            condiciones.push('c.titulo LIKE ?');
            parametros.push(`%${filtros.titulo}%`);
        }
        if (filtros.tipo) {
            condiciones.push('c.tipo = ?');
            parametros.push(filtros.tipo);
        }
        if (filtros.categoria) {
            condiciones.push('cat.nombre = ?');
            parametros.push(filtros.categoria);
        }
        if (filtros.anio) {
            condiciones.push('c.anio = ?');
            parametros.push(filtros.anio);
        }

        const ordenes = {
            anio_desc: 'c.anio DESC, c.id DESC',
            anio_asc: 'c.anio ASC, c.id ASC',
            titulo_asc: 'c.titulo ASC, c.id ASC',
            titulo_desc: 'c.titulo DESC, c.id DESC'
        };
        const orden = ordenes[filtros.orden] || ordenes.anio_desc;
        const [filas] = await pool.execute(
            `SELECT c.id, c.titulo, c.tipo, c.anio AS anio_lanzamiento,
                    cat.nombre AS nombre_categoria
             FROM contenido c 
             JOIN categoria cat ON c.categoria_id = cat.id 
             WHERE ${condiciones.join(' AND ')}
             ORDER BY ${orden}`,
            parametros
        );
        return filas;
    }

    async existeCategoria(categoriaId) {
        const [filas] = await pool.execute(
            `SELECT id FROM categoria WHERE id = ?`,
            [categoriaId]
        );
        return filas.length > 0;
    }

    async crearAprobado(datos) {
        const [resultado] = await pool.execute(
            `INSERT INTO contenido
                (categoria_id, titulo, tipo, descripcion, anio, estado, director, url_imagen, url_trailer)
             VALUES (?, ?, ?, ?, ?, 'aprobado', ?, ?, ?)`,
            [
                datos.categoria_id,
                datos.titulo.trim(),
                datos.tipo,
                datos.descripcion?.trim() || null,
                datos.anio,
                datos.director?.trim() || null,
                datos.url_imagen?.trim() || null,
                datos.url_trailer?.trim() || null
            ]
        );
        return resultado.insertId;
    }

    async existeContenido(id) {
        const [filas] = await pool.execute(
            `SELECT id FROM contenido WHERE id = ?`,
            [id]
        );
        return filas.length > 0;
    }

    async actualizar(id, datos) {
        const [resultado] = await pool.execute(
            `UPDATE contenido
             SET categoria_id = ?, titulo = ?, tipo = ?, descripcion = ?, anio = ?,
                 director = ?, url_imagen = ?, url_trailer = ?
             WHERE id = ?`,
            [
                datos.categoria_id,
                datos.titulo.trim(),
                datos.tipo,
                datos.descripcion?.trim() || null,
                datos.anio,
                datos.director?.trim() || null,
                datos.url_imagen?.trim() || null,
                datos.url_trailer?.trim() || null,
                id
            ]
        );
        return resultado.affectedRows > 0;
    }

    async eliminar(id) {
        const [resultado] = await pool.execute(
            `DELETE FROM contenido WHERE id = ?`,
            [id]
        );
        return resultado.affectedRows > 0;
    }

    async crearPersonaje(contenidoId, nombre, tipo) {
        const [resultado] = await pool.execute(
            `INSERT INTO personaje (contenido_id, nombre, tipo)
             VALUES (?, ?, ?)`,
            [contenidoId, nombre.trim(), tipo]
        );
        return resultado.insertId;
    }

    async actualizarPersonaje(contenidoId, personajeId, nombre, tipo) {
        const [resultado] = await pool.execute(
            `UPDATE personaje
             SET nombre = ?, tipo = ?
             WHERE id = ? AND contenido_id = ?`,
            [nombre.trim(), tipo, personajeId, contenidoId]
        );
        return resultado.affectedRows > 0;
    }

    async eliminarPersonaje(contenidoId, personajeId) {
        const [resultado] = await pool.execute(
            `DELETE FROM personaje
             WHERE id = ? AND contenido_id = ?`,
            [personajeId, contenidoId]
        );
        return resultado.affectedRows > 0;
    }
}