
import express from 'express';
import 'dotenv/config';

const app = express();
const PORT = process.env.SERVER_PORT || 3000;

//configuración de la aplicación
app.use(express.json());

// ruta estandar, unicamenete para la comprovación del servidor
app.get('/health', (req, res) => {
    res.status(200).json({
        estado: 'Prueba Aprovado',
        mensaje: 'ELARA Backend en funcionamiento'
    });
});

// registro de rutas - quí se agregarán las rutas del catálogo.

// manejo de rutas inexistentes
app.use((req, res) => {
    res.status(404).json({ mensaje: 'Ruta no encontrada'});
});

// manejador de errores
app.use(manejadorErrores)
function manejadorErrores(err, req, res, next){
    res.status(err.statusCode || 500).json({
        mensaje: err.message || 'Error interno del Servidor',
        errores: err.details || null
    })
};

// iniciar servidor
app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor ELARA ejecutándose en el puerto ${PORT}`);
});
