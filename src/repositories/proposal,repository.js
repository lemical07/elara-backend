import pool from '../config/database.js';

class ProposalRepository {

    async guardarPropuesta(datos, usuarioId) {
        const { titulo, descripcion, anio, tipo, categoriaId, director, urlImagen, urlTrailer } = datos;

        const [resultado] = await pool.query(
            `INSERT INTO contenido (titulo, descripcion, anio, tipo, estado, categoria_id, director, url_imagen, url_trailer, creado_en)
             VALUES (?, ?, ?, ?, 'pendiente', ?, ?, ?, ?, NOW())`,
            [
                titulo.trim(),
                descripcion.trim(),
                anio,
                tipo.toLowerCase(),
                categoriaId,
                director ? director.trim() : null,
                urlImagen ? urlImagen.trim() : null,
                urlTrailer ? urlTrailer.trim() : null
            ]
        );

        const [filasCreadas] = await pool.query(
            `SELECT id, titulo, tipo, estado, creado_en FROM contenido WHERE id = ?`,
            [resultado.insertId]
        );

        return filasCreadas[0];
    }
}

export default new ProposalRepository();