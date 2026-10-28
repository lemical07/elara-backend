import { body } from 'express-validator';

const UsuarioCrearValidaciones =[
    body("rol_id")
        .notEmpty().withMessage("El rol es obligatorio.")
        .isInt({ min: 1 }).withMessage("El rol debe ser un número entero positivo."),

    body("nombre")
        .notEmpty().withMessage("El nombre es obligatorio.")
        .isLength({ max: 60 }).withMessage("El nombre no puede superar los 60 caracteres.").trim(),

    body("apellido")
        .notEmpty().withMessage("El apellido es obligatorio.")
        .isLength({ max: 60 }).withMessage("El apellido no puede superar los 60 caracteres.").trim(),

    body("correo")
        .notEmpty().withMessage("El correo es obligatorio.")
        .isEmail().withMessage("El correo no tiene un formato válido.")
        .isLength({ max: 150 }).withMessage("El correo no puede superar los 150 caracteres.").trim(),

    body("contrasena")
        .notEmpty().withMessage("La contraseña es obligatoria.")
        .isString().withMessage("La contraseña debe ser texto.")
        .isLength({ min: 8, max: 255 }).withMessage("La contraseña debe tener entre 8 y 255 caracteres.")
];

export default UsuarioCrearValidaciones;