-- 1. Inserción de Roles
INSERT INTO rol (id, nombre_rol) VALUES
(1, 'Administrador'),
(2, 'Usuario');

-- 2. Inserción de Usuarios
INSERT INTO usuario (id, rol_id, nombre, apellido, correo, contrasena, activo) VALUES
(1, 1, 'Carlos', 'Mendoza', 'carlos.admin@elara.com', '$2b$10$E...hashedpassword1', TRUE),
(2, 2, 'Ana', 'Pérez', 'ana.perez@gmail.com', '$2b$10$E...hashedpassword2', TRUE),
(3, 2, 'Luis', 'Gómez', 'luis.gomez@gmail.com', '$2b$10$E...hashedpassword3', TRUE),
(4, 2, 'María', 'Rodríguez', 'maria.rodriguez@gmail.com', '$2b$10$E...hashedpassword4', TRUE);

-- 3. Inserción de Categorías
INSERT INTO categoria (id, nombre, descripcion) VALUES
(1, 'Ciencia Ficción', 'Películas y series basadas en avances científicos y tecnológicos hipotéticos, viajes espaciales y futuros distópicos.'),
(2, 'Acción y Aventura', 'Contenido enfocado en secuencias dinámicas, persecuciones, artes marciales y misiones épicas.'),
(3, 'Drama', 'Historias centradas en el desarrollo profundo de personajes, dilemas morales y relaciones emocionales.'),
(4, 'Anime', 'Producciones de animación japonesa con diversos géneros y estilos narrativos.'),
(5, 'Fantasía', 'Obras con elementos mágicos, mundos imaginarios, criaturas míticas y eventos sobrenaturales.');

-- 4. Inserción de Contenidos (Películas Reales adaptadas al límite de 50 caracteres en título)
INSERT INTO contenido (id, categoria_id, propuesto_por, titulo, tipo, descripcion, anio, estado, director, url_imagen, url_trailer) VALUES
(1, 1, NULL, 'Interstellar', 'pelicula', 'Un grupo de exploradores viaja a través de un agujero de gusano en el espacio en un intento por asegurar la supervivencia de la humanidad.', 2014, 'aprobado', 'Christopher Nolan', NULL, NULL),
(2, 1, NULL, 'Blade Runner 2049', 'pelicula', 'Un joven cazador de replicantes descubre un secreto oculto desde hace mucho tiempo que podría sumir en el caos a lo que queda de la sociedad.', 2017, 'aprobado', 'Denis Villeneuve', NULL, NULL),
(3, 2, NULL, 'The Dark Knight', 'pelicula', 'Batman se enfrenta al Guasón, un criminal caótico que busca sumergir a Ciudad Gótica en el anarquía.', 2008, 'aprobado', 'Christopher Nolan', NULL, NULL),
(4, 2, NULL, 'Mad Max: Fury Road', 'pelicula', 'En un desierto posapocalíptico, una mujer se rebela contra un tirano en búsqueda de su hogar con la ayuda de un vagabundo.', 2015, 'aprobado', 'George Miller', NULL, NULL),
(5, 3, NULL, 'The Shawshank Redemption', 'pelicula', 'Dos hombres encarcelados entablan una amistad a lo largo de los años, encontrando consuelo y redención eventual a través de actos de decencia común.', 1994, 'aprobado', 'Frank Darabont', NULL, NULL),
(6, 3, NULL, 'Oppenheimer', 'pelicula', 'La historia del físico teórico J. Robert Oppenheimer y su papel en el desarrollo de la bomba atómica durante la Segunda Guerra Mundial.', 2023, 'aprobado', 'Christopher Nolan', NULL, NULL),
(7, 4, NULL, 'El viaje de Chihiro', 'pelicula', 'Una niña de diez años se adentra en un mundo gobernado por dioses, brujas y espíritus donde sus padres son transformados en cerdos.', 2001, 'aprobado', 'Hayao Miyazaki', NULL, NULL),
(8, 4, NULL, 'Your Name', 'pelicula', 'Dos estudiantes de secundaria que no se conocen intercambian cuerpos de manera aleatoria, desencadenando una conexión a través del tiempo y el espacio.', 2016, 'aprobado', 'Makoto Shinkai', NULL, NULL),
(9, 5, NULL, 'The Lord of the Rings: Return of King', 'pelicula', 'Gandalf y Aragorn lideran el mundo de los hombres contra el ejército de Sauron para distraerlo mientras Frodo y Sam se aproximan al Monte del Destino con el Anillo Único.', 2003, 'aprobado', 'Peter Jackson', NULL, NULL),
(10, 5, NULL, 'Pan''s Labyrinth', 'pelicula', 'En la España de 1944, la joven hija de un oficial fascista se refugia en un mundo de fantasía lleno de criaturas misteriosas.', 2006, 'aprobado', 'Guillermo del Toro', NULL, NULL);

-- 5. Inserción de Personajes (Tabla nueva)
INSERT INTO personaje (contenido_id, nombre, tipo) VALUES
(1, 'Joseph Cooper', 'principal'),
(1, 'Amelia Brand', 'principal'),
(3, 'Bruce Wayne / Batman', 'principal'),
(3, 'The Joker', 'principal'),
(7, 'Chihiro Ogino', 'principal'),
(7, 'Haku', 'principal'),
(9, 'Aragorn', 'principal'),
(9, 'Frodo Bolsón', 'principal');

-- 6. Inserción de Reseñas (Reviews - Títulos adaptados al límite de 25 caracteres)
INSERT INTO review (usuario_id, contenido_id, titulo, comentario, calificacion) VALUES
(2, 1, 'Obra maestra', 'La banda sonora de Hans Zimmer y los conceptos científicos hacen que esta película sea inolvidable.', 10),
(3, 1, 'Muy compleja', 'Es una gran película de ciencia ficción, aunque el desarrollo del tercer acto requiere mucha atención.', 8),
(2, 3, 'Insuperable', 'Heath Ledger como el Guasón ofrece una de las mejores actuaciones de la historia del cine.', 10),
(4, 3, 'Excelente acción', 'El ritmo no decae en ningún momento y la tensión se mantiene de principio a fin.', 9),
(3, 5, 'Emotiva', 'Una lección de vida sobre la esperanza y la amistad en las circunstancias más oscuras.', 10),
(4, 7, 'Mágica y única', 'La animación de Studio Ghibli es perfecta y la historia atrapa desde el primer minuto.', 9);

-- 7. Inserción de Reacciones (Likes / Dislikes)
INSERT INTO reaccion (usuario_id, review_id, tipo) VALUES
(3, 1, 'like'),
(4, 1, 'like'),
(2, 2, 'like'),
(4, 3, 'like'),
(2, 5, 'like');