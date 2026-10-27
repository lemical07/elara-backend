
CREATE DATABASE elara_db;

USE elara_db;

CREATE TABLE rol(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre_rol VARCHAR(50) NOT NULL
);

CREATE TABLE usuario(
    id INT AUTO_INCREMENT PRIMARY KEY,
    rol_id INT NOT NULL,
    nombre VARCHAR(60) NOT NULL,
    apellido VARCHAR(60) NOT NULL,
    correo VARCHAR(150) NOT NULL UNIQUE,
    contrasena VARCHAR(255) NOT NULL,
    activo BOOLEAN NOT NULL DEFAULT TRUE,

    FOREIGN KEY (rol_id) REFERENCES rol(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE categoria(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT
);

CREATE TABLE contenido(
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria_id INT NOT NULL,
    propuesto_por INT NULL,
    titulo VARCHAR(50) NOT NULL,
    tipo VARCHAR(25) NOT NULL,
    descripcion TEXT,
    anio YEAR NOT NULL,
    estado ENUM('pendiente', 'aprobado', 'rechazado') NOT NULL DEFAULT 'pendiente',

    FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (propuesto_por) REFERENCES usuario(id) ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE review(
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    contenido_id INT NOT NULL,
    titulo VARCHAR(25) NOT NULL,
    comentario TEXT,
    calificacion TINYINT UNSIGNED NOT NULL CHECK (calificacion BETWEEN 1 AND 10),
    creado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (contenido_id) REFERENCES contenido(id) ON DELETE CASCADE ON UPDATE CASCADE,

    UNIQUE (usuario_id, contenido_id)
);

CREATE TABLE reaccion(
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    review_id INT NOT NULL,
    tipo ENUM('like', 'dislike') NOT NULL,

    FOREIGN KEY (usuario_id) REFERENCES usuario(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (review_id) REFERENCES review(id) ON DELETE CASCADE ON UPDATE CASCADE,

    UNIQUE (usuario_id, review_id)
);