import { param } from 'express-validator';

const UsuarioBuscarPorIdValidaciones = [
    param("id")
        .isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo.")
];

export default UsuarioBuscarPorIdValidaciones;