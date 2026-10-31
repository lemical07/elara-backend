import proposalService from '../services/proposal.service.js';

export const enviarPropuesta = async (req, res) => {
    try {
        const datosPropuesta = req.body;
    
        const usuarioId = req.usuario.id;

        const resultado = await proposalService.procesarPropuesta(datosPropuesta, usuarioId);

        return res.status(201).json({
            exito: true,
            mensaje: 'Propuesta enviada exitosamente. Está pendiente de revisión.',
            datos: resultado
        });
    } catch (error) {
        if (
            error.message.includes('obligatorio') || 
            error.message.includes('debe ser') || 
            error.message.includes('tipo de contenido')
        ) {
            return res.status(400).json({
                exito: false,
                mensaje: error.message
            });
        }
        return res.status(500).json({
            exito: false,
            mensaje: 'Error interno al procesar la propuesta de contenido',
            errorDetallado: error.message
        });
    }
};