import pool from '../config/db.js';

class PropuestaRepositorio {
    async existeCategoria(categoriaId) {
        const [filas] = await pool.execute(
            `SELECT id FROM categoria WHERE id = ?`,
            [categoriaId]
        );
        return filas.length > 0;
    }

    async guardarPropuesta(datos, usuarioId) {
        const [resultado] = await pool.execute(
            `INSERT INTO contenido
                (titulo, descripcion, anio, tipo, estado, categoria_id, propuesto_por, director, url_imagen, url_trailer)
             VALUES (?, ?, ?, ?, 'pendiente', ?, ?, ?, ?, ?)`,
            [
                datos.titulo.trim(),
                datos.descripcion.trim(),
                datos.anio,
                datos.tipo,
                datos.categoria_id,
                usuarioId,
                datos.director?.trim() || null,
                datos.url_imagen?.trim() || null,
                datos.url_trailer?.trim() || null
            ]
        );

        const [filas] = await pool.execute(
            `SELECT id, titulo, tipo, estado
             FROM contenido
             WHERE id = ?`,
            [resultado.insertId]
        );
        return filas[0];
    }

    async listarPendientes() {
        const [filas] = await pool.execute(
            `SELECT c.id, c.titulo, c.descripcion, c.anio, c.tipo, c.estado,
                    c.categoria_id, cat.nombre AS categoria, c.propuesto_por,
                    c.director, c.url_imagen, c.url_trailer
             FROM contenido c
             INNER JOIN categoria cat ON cat.id = c.categoria_id
             WHERE c.estado = 'pendiente'
             ORDER BY c.id`
        );
        return filas;
    }

    async actualizarEstado(id, estado, administradorId) {
        const conexion = await pool.getConnection();
        let transaccionIniciada = false;

        try {
            await conexion.beginTransaction();
            transaccionIniciada = true;

            const [filas] = await conexion.execute(
                `SELECT estado, propuesto_por
                 FROM contenido
                 WHERE id = ?
                 FOR UPDATE`,
                [id]
            );
            const propuesta = filas[0];
            if (!propuesta) {
                await conexion.rollback();
                transaccionIniciada = false;
                return null;
            }

            if (propuesta.estado !== 'pendiente') {
                const error = new Error('Solo se pueden resolver propuestas pendientes.');
                error.status = 409;
                throw error;
            }
            if (estado === 'aprobado' && Number(propuesta.propuesto_por) === Number(administradorId)) {
                const error = new Error('No puedes aprobar tu propia propuesta.');
                error.status = 403;
                throw error;
            }

            await conexion.execute(
                `UPDATE contenido SET estado = ? WHERE id = ?`,
                [estado, id]
            );
            await conexion.commit();
            transaccionIniciada = false;
            return { id: Number(id), estado };
        } catch (error) {
            if (transaccionIniciada) {
                await conexion.rollback();
            }
            throw error;
        } finally {
            conexion.release();
        }
    }
}

export default new PropuestaRepositorio();