import { body } from 'express-validator';

const UsuarioBusacarPoRIdValidaciones =[
    param("id")
        .isInt({ min: 1 }).withMessage("El ID debe ser un entero positivo.")
];

export default UsuarioBusacarPoRIdValidaciones;