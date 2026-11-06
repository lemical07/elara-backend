import resenaRepositorio from '../repositories/review.repository.js';

function escaparCampoCSV(valor) {
    let texto = valor == null ? '' : String(valor);
    if (/^[\u0000-\u0020]*[=+\-@]/.test(texto)) {
        texto = `'${texto}`;
    }
    return `"${texto.replaceAll('"', '""')}"`;
}

export class ExportarResenasControlador {
    constructor(repositorio = resenaRepositorio) {
        this.repositorio = repositorio;
    }

    exportarCSV = async (req, res, next) => {
        try {
            const id = Number(req.params.id);
            const resenas = await this.repositorio.exportarResenasCSV(id);
            if (resenas.length === 0) {
                return res.status(404).json({
                    exito: false,
                    mensaje: 'No se encontraron reseñas para este contenido.'
                });
            }

            const encabezados = ['Nombre del usuario', 'Calificación', 'Comentario', 'Fecha de creación'];
            const filas = resenas.map(resena => [
                resena.nombreUsuario,
                resena.calificacion,
                resena.comentario,
                resena.fechaCreacion
            ]);
            const contenidoCSV = [encabezados, ...filas]
                .map(fila => fila.map(escaparCampoCSV).join(','))
                .join('\r\n');

            return res
                .status(200)
                .type('text/csv')
                .attachment(`resenas-${id}.csv`)
                .send(`\uFEFF${contenidoCSV}`);
        } catch (error) {
            return next(error);
        }
    };
}

export default new ExportarResenasControlador();
