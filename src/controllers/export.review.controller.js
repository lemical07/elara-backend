import exporarResenaCVS from '../repositories/review.repository.js'


const path = require('path');

export class exportarResenasControlador {
    constructor(reviewRepository = exporarResenaCVS) {
        this.reviewRepository = reviewRepository;
    }

    exportarResenaSVC = async (req, res) => {
        try {
            const { id } = req.params; // id  contenido
            const reviews = await this.reviewRepository.exporarResenaCVS(id);

            if (!reviews || reviews.length === 0) {
                return res.status(404).json({ message: 'No se encontraron reseñas para esta película.' });
            }

            // confi de archivo
            const filePath = path.join(__dirname, '../../exports', `reviews_movie_${id}.csv`);
            const csvWriter = createObjectCsvWriter({
                path: filePath,
                header: [
                    { id: 'nombreUsuario', title: 'Nombre del Usuario' },
                    { id: 'Calificacion', title: 'Calificación' },
                    { id: 'Cometario', title: 'Comentario' },
                    { id: 'fecha_Creacion', title: 'Fecha de Creación' },
            ],
        });

        //escritura para el SCV
        await csvWriter.writeRecords(reviews.map(review => ({
            nombreUsuario: review.nombreUsuario,
            Calificacion: review.Calificacion,
            Cometario: review.Cometario,
            fecha_Creacion: review.fecha_Creacion,
        })));
        return res.status(200).json({ message: 'Archivo CSV generado exitosamente.', filePath });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error al generar el archivo CSV.' });
    }
}
}