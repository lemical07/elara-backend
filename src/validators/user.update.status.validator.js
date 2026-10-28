import { body } from 'express-validator';

const UsuarioActualizarEstadoValidaciones = [
    param("id")
        .isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo."),

    body("activo")
        .isBoolean().withMessage("El estado debe ser verdadero o falso.")
];
export default UsuarioActualizarEstadoValidaciones;