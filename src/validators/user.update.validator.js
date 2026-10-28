param("id")
                .isInt({ min: 1 })
                .withMessage("El ID debe ser un entero positivo."),

            body("rol_id")
                .notEmpty()
                .withMessage("El rol es obligatorio.")
                .isInt({ min: 1 })
                .withMessage("El rol debe ser un número entero positivo."),

            body("nombre")
                .trim()
                .notEmpty()
                .withMessage("El nombre es obligatorio.")
                .isLength({ max: 60 })
                .withMessage("El nombre no puede superar los 60 caracteres."),

            body("apellido")
                .trim()
                .notEmpty()
                .withMessage("El apellido es obligatorio.")
                .isLength({ max: 60 })
                .withMessage("El apellido no puede superar los 60 caracteres."),

            body("correo")
                .trim()
                .notEmpty()
                .withMessage("El correo es obligatorio.")
                .isEmail()
                .withMessage("El correo no tiene un formato válido.")
                .isLength({ max: 150 })
                .withMessage("El correo no puede superar los 150 caracteres.")