import swaggerJsdoc from 'swagger-jsdoc';
import packageJson from '../package.json' with { type: 'json' };

const respuesta = descripcion => ({ description: descripcion });
const respuestaJSON = descripcion => ({
    description: descripcion,
    content: {
        'application/json': {
            schema: { type: 'object' }
        }
    }
});
const cuerpoJSON = schema => ({
    required: true,
    content: {
        'application/json': { schema }
    }
});
const parametroId = (name, description) => ({
    name,
    in: 'path',
    required: true,
    description,
    schema: { type: 'integer', minimum: 1 }
});
const jwt = [{ BearerAuth: [] }];
const identidadOpcional = [{ BearerAuth: [] }, { VisitanteCookie: [] }, {}];
const objeto = (properties, required = []) => ({
    type: 'object',
    properties,
    required,
    additionalProperties: false
});
const texto = { type: 'string' };
const entero = { type: 'integer' };

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'ELARA API',
            version: packageJson.version,
            description: 'API REST para consultar y administrar el catálogo de ELARA. Las rutas /api aceptan el encabezado opcional X-API-Version; si se omite se usa la versión del servidor.'
        },
        servers: [{
            url: 'http://localhost:3000',
            description: 'Servidor local'
        }],
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                },
                VisitanteCookie: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'elara_visitante',
                    description: 'Cookie emitida automáticamente al usar las rutas de visitante.'
                }
            },
            schemas: {
                Error: objeto({
                    exito: { type: 'boolean', example: false },
                    mensaje: texto
                }),
                Registro: objeto({
                    nombre: texto,
                    apellido: texto,
                    correo: { type: 'string', format: 'email' },
                    contrasena: { type: 'string', minLength: 8, description: 'Obligatoria salvo durante la inicialización de la primera cuenta.' }
                }, ['nombre', 'apellido', 'correo']),
                RolUsuario: objeto({
                    rol: { type: 'string', enum: ['ADMIN', 'USUARIO'] }
                }, ['rol']),
                Credenciales: objeto({
                    correo: { type: 'string', format: 'email' },
                    contrasena: texto
                }, ['correo', 'contrasena']),
                Contenido: objeto({
                    categoria_id: { type: 'integer', minimum: 1 },
                    titulo: { type: 'string', maxLength: 50 },
                    tipo: { type: 'string', enum: ['pelicula', 'serie', 'anime'] },
                    descripcion: texto,
                    anio: { type: 'integer', minimum: 1901, maximum: 2155 },
                    director: { type: 'string', maxLength: 150 },
                    url_imagen: { type: 'string', format: 'uri', maxLength: 500 },
                    url_trailer: { type: 'string', format: 'uri', maxLength: 500 }
                }, ['categoria_id', 'titulo', 'tipo', 'anio']),
                PropuestaContenido: objeto({
                    categoria_id: { type: 'integer', minimum: 1 },
                    titulo: { type: 'string', maxLength: 50 },
                    tipo: { type: 'string', enum: ['pelicula', 'serie', 'anime'] },
                    descripcion: { type: 'string', minLength: 1 },
                    anio: { type: 'integer', minimum: 1901, maximum: 2155 },
                    director: { type: 'string', maxLength: 150 },
                    url_imagen: { type: 'string', format: 'uri', maxLength: 500 },
                    url_trailer: { type: 'string', format: 'uri', maxLength: 500 }
                }, ['categoria_id', 'titulo', 'tipo', 'descripcion', 'anio']),
                Personaje: objeto({
                    nombre: { type: 'string', maxLength: 100 },
                    tipo: { type: 'string', enum: ['principal', 'secundario'] }
                }, ['nombre', 'tipo']),
                Resena: objeto({
                    contenido_id: { type: 'integer', minimum: 1 },
                    titulo: { type: 'string', maxLength: 25 },
                    comentario: texto,
                    calificacion: { type: 'integer', minimum: 1, maximum: 10 },
                    nombre_visitante: { type: 'string', maxLength: 60 }
                }, ['contenido_id', 'titulo', 'calificacion']),
                Reaccion: objeto({
                    review_id: { type: 'integer', minimum: 1 },
                    tipo: { type: 'string', enum: ['like', 'dislike'] }
                }, ['review_id', 'tipo']),
                EstadoPropuesta: objeto({
                    estado: { type: 'string', enum: ['aprobado', 'rechazado'] }
                }, ['estado']),
                Categoria: objeto({
                    nombre: { type: 'string', maxLength: 50 },
                    descripcion: texto
                }, ['nombre']),
                CambioContrasena: objeto({
                    contrasena_actual: texto,
                    contrasena_nueva: { type: 'string', minLength: 8 },
                    contrasena_nueva_confirmacion: { type: 'string', minLength: 8 }
                }, ['contrasena_actual', 'contrasena_nueva', 'contrasena_nueva_confirmacion'])
            }
        },
        paths: {
            '/health': {
                get: {
                    tags: ['Salud'],
                    summary: 'Comprobar que el servidor responde',
                    responses: { 200: respuestaJSON('Servidor disponible.') }
                }
            },
            '/api/auth/register': {
                post: {
                    tags: ['Autenticación'],
                    summary: 'Registrar una cuenta o inicializar el primer administrador',
                    description: 'El backend determina si es la primera cuenta. Durante la inicialización se rechaza una contraseña suministrada y se devuelve una clave temporal de un solo uso, que debe recibirse por HTTPS y no queda disponible en endpoints posteriores.',
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/Registro' }),
                    responses: {
                        201: respuestaJSON('Cuenta registrada. La primera cuenta recibe rol Administrador y contraseña temporal una sola vez; las posteriores reciben rol Usuario.'),
                        400: respuestaJSON('Datos inválidos.'),
                        409: respuestaJSON('El correo ya está registrado.'),
                        503: respuestaJSON('No fue posible obtener el bloqueo de inicialización.')
                    }
                }
            },
            '/api/auth/login': {
                post: {
                    tags: ['Autenticación'],
                    summary: 'Iniciar sesión',
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/Credenciales' }),
                    responses: {
                        200: respuestaJSON('Credenciales válidas; devuelve JWT.'),
                        401: respuestaJSON('Credenciales inválidas.')
                    }
                }
            },
            '/api/auth/me': {
                get: {
                    tags: ['Autenticación'],
                    summary: 'Consultar la sesión autenticada',
                    security: jwt,
                    responses: {
                        200: respuestaJSON('Datos públicos de la sesión.'),
                        401: respuestaJSON('JWT inválido o ausente.')
                    }
                }
            },
            '/api/usuarios/me': {
                get: {
                    tags: ['Usuarios'],
                    summary: 'Consultar el perfil propio',
                    security: jwt,
                    responses: { 200: respuestaJSON('Perfil propio.'), 401: respuestaJSON('No autenticado.') }
                },
                put: {
                    tags: ['Usuarios'],
                    summary: 'Actualizar el perfil propio',
                    security: jwt,
                    requestBody: cuerpoJSON(objeto({
                        nombre: { type: 'string', maxLength: 60 },
                        apellido: { type: 'string', maxLength: 60 },
                        correo: { type: 'string', format: 'email', maxLength: 150 }
                    })),
                    responses: { 200: respuestaJSON('Perfil actualizado.'), 400: respuestaJSON('Datos inválidos.') }
                },
                delete: {
                    tags: ['Usuarios'],
                    summary: 'Desactivar la cuenta propia',
                    security: jwt,
                    responses: {
                        200: respuestaJSON('Cuenta desactivada.'),
                        404: respuestaJSON('Usuario no encontrado.')
                    }
                }
            },
            '/api/usuarios/me/contrasena': {
                patch: {
                    tags: ['Usuarios'],
                    summary: 'Cambiar la contraseña propia',
                    security: jwt,
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/CambioContrasena' }),
                    responses: {
                        200: respuestaJSON('Contraseña actualizada.'),
                        401: respuestaJSON('Contraseña actual incorrecta.')
                    }
                }
            },
            '/api/usuarios/me/permanente': {
                delete: {
                    tags: ['Usuarios'],
                    summary: 'Eliminar permanentemente la cuenta propia',
                    security: jwt,
                    requestBody: cuerpoJSON(objeto({ contrasena_actual: texto })),
                    responses: {
                        200: respuestaJSON('Cuenta eliminada.'),
                        401: respuestaJSON('Contraseña actual incorrecta.'),
                        409: respuestaJSON('No se puede eliminar la última cuenta administradora activa.')
                    }
                }
            },
            '/api/usuarios': {
                get: {
                    tags: ['Usuarios'],
                    summary: 'Listar usuarios (administrador)',
                    security: jwt,
                    responses: { 200: respuestaJSON('Lista de perfiles públicos.'), 403: respuestaJSON('Se requiere rol administrador.') }
                }
            },
            '/api/usuarios/{id}': {
                parameters: [parametroId('id', 'Identificador del usuario.')],
                get: {
                    tags: ['Usuarios'],
                    summary: 'Consultar un usuario (administrador)',
                    security: jwt,
                    responses: { 200: respuestaJSON('Perfil público.'), 404: respuestaJSON('Usuario no encontrado.') }
                },
                patch: {
                    tags: ['Usuarios'],
                    summary: 'Actualizar un usuario (administrador)',
                    security: jwt,
                    requestBody: cuerpoJSON(objeto({
                        nombre: { type: 'string', maxLength: 60 },
                        apellido: { type: 'string', maxLength: 60 },
                        correo: { type: 'string', format: 'email', maxLength: 150 }
                    })),
                    responses: { 200: respuestaJSON('Usuario actualizado.'), 404: respuestaJSON('Usuario no encontrado.') }
                }
            },
            '/api/usuarios/{id}/estado': {
                parameters: [parametroId('id', 'Identificador del usuario.')],
                patch: {
                    tags: ['Usuarios'],
                    summary: 'Activar o desactivar una cuenta (administrador)',
                    security: jwt,
                    requestBody: cuerpoJSON(objeto({ activo: { type: 'boolean' } })),
                    responses: {
                        200: respuestaJSON('Estado actualizado.'),
                        409: respuestaJSON('No se puede desactivar la última cuenta administradora activa.')
                    }
                }
            },
            '/api/usuarios/{id}/rol': {
                parameters: [parametroId('id', 'Identificador del usuario.')],
                patch: {
                    tags: ['Usuarios'],
                    summary: 'Conceder o retirar el rol de administrador',
                    description: 'Solo administradores autenticados pueden cambiar roles. No permite retirar el acceso al último administrador activo.',
                    security: jwt,
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/RolUsuario' }),
                    responses: {
                        200: respuestaJSON('Rol actualizado en MySQL.'),
                        403: respuestaJSON('Se requiere rol administrador.'),
                        404: respuestaJSON('Usuario no encontrado.'),
                        409: respuestaJSON('No se puede retirar el acceso al último administrador activo.')
                    }
                }
            },
            '/api/categorias': {
                get: {
                    tags: ['Categorías'],
                    summary: 'Listar categorías',
                    responses: { 200: respuestaJSON('Categorías disponibles.') }
                },
                post: {
                    tags: ['Categorías'],
                    summary: 'Crear una categoría (administrador)',
                    security: jwt,
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/Categoria' }),
                    responses: {
                        201: respuestaJSON('Categoría creada.'),
                        409: respuestaJSON('Nombre duplicado.')
                    }
                }
            },
            '/api/categorias/{id}': {
                parameters: [parametroId('id', 'Identificador de la categoría.')],
                put: {
                    tags: ['Categorías'],
                    summary: 'Actualizar una categoría (administrador)',
                    security: jwt,
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/Categoria' }),
                    responses: { 200: respuestaJSON('Categoría actualizada.'), 404: respuestaJSON('Categoría no encontrada.') }
                },
                delete: {
                    tags: ['Categorías'],
                    summary: 'Eliminar una categoría sin contenido asociado (administrador)',
                    security: jwt,
                    responses: {
                        204: respuesta('Categoría eliminada.'),
                        404: respuestaJSON('Categoría no encontrada.'),
                        409: respuestaJSON('La categoría tiene contenido asociado.')
                    }
                }
            },
            '/api/contenidos/catalogo': {
                get: {
                    tags: ['Contenidos'],
                    summary: 'Consultar y filtrar el catálogo aprobado',
                    parameters: [
                        { name: 'titulo', in: 'query', schema: texto },
                        { name: 'tipo', in: 'query', schema: { type: 'string', enum: ['pelicula', 'serie', 'anime'] } },
                        { name: 'categoria', in: 'query', schema: texto },
                        { name: 'anio', in: 'query', schema: entero },
                        { name: 'orden', in: 'query', schema: { type: 'string', enum: ['anio_desc', 'anio_asc', 'titulo_asc', 'titulo_desc'] } }
                    ],
                    responses: { 200: respuestaJSON('Catálogo de contenido aprobado.') }
                }
            },
            '/api/contenidos': {
                post: {
                    tags: ['Contenidos'],
                    summary: 'Crear contenido aprobado directamente (administrador)',
                    security: jwt,
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/Contenido' }),
                    responses: { 201: respuestaJSON('Contenido creado.'), 404: respuestaJSON('Categoría no encontrada.') }
                }
            },
            '/api/contenidos/{id}': {
                parameters: [parametroId('id', 'Identificador del contenido.')],
                get: {
                    tags: ['Contenidos'],
                    summary: 'Consultar el detalle de contenido aprobado',
                    responses: { 200: respuestaJSON('Detalle del contenido.'), 404: respuestaJSON('Contenido no encontrado.') }
                },
                put: {
                    tags: ['Contenidos'],
                    summary: 'Actualizar contenido (administrador)',
                    security: jwt,
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/Contenido' }),
                    responses: { 200: respuestaJSON('Contenido actualizado.'), 404: respuestaJSON('Contenido o categoría no encontrados.') }
                },
                delete: {
                    tags: ['Contenidos'],
                    summary: 'Eliminar contenido (administrador)',
                    security: jwt,
                    responses: { 204: respuesta('Contenido eliminado.'), 404: respuestaJSON('Contenido no encontrado.') }
                }
            },
            '/api/contenidos/{id}/personajes': {
                parameters: [parametroId('id', 'Identificador del contenido.')],
                get: {
                    tags: ['Personajes'],
                    summary: 'Listar personajes de contenido aprobado',
                    responses: { 200: respuestaJSON('Personajes del contenido.'), 404: respuestaJSON('Contenido no encontrado.') }
                },
                post: {
                    tags: ['Personajes'],
                    summary: 'Crear un personaje (administrador)',
                    security: jwt,
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/Personaje' }),
                    responses: { 201: respuestaJSON('Personaje creado.'), 404: respuestaJSON('Contenido no encontrado.') }
                }
            },
            '/api/contenidos/{id}/personajes/{personajeId}': {
                parameters: [
                    parametroId('id', 'Identificador del contenido.'),
                    parametroId('personajeId', 'Identificador del personaje.')
                ],
                put: {
                    tags: ['Personajes'],
                    summary: 'Actualizar un personaje (administrador)',
                    security: jwt,
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/Personaje' }),
                    responses: { 200: respuestaJSON('Personaje actualizado.'), 404: respuestaJSON('Personaje no encontrado.') }
                },
                delete: {
                    tags: ['Personajes'],
                    summary: 'Eliminar un personaje (administrador)',
                    security: jwt,
                    responses: { 204: respuesta('Personaje eliminado.'), 404: respuestaJSON('Personaje no encontrado.') }
                }
            },
            '/api/propuestas': {
                post: {
                    tags: ['Propuestas'],
                    summary: 'Proponer contenido como usuario autenticado',
                    security: jwt,
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/PropuestaContenido' }),
                    responses: { 201: respuestaJSON('Propuesta pendiente creada.'), 404: respuestaJSON('Categoría no encontrada.') }
                }
            },
            '/api/propuestas/pendientes': {
                get: {
                    tags: ['Propuestas'],
                    summary: 'Listar propuestas pendientes (administrador)',
                    security: jwt,
                    responses: { 200: respuestaJSON('Propuestas pendientes.'), 403: respuestaJSON('Se requiere rol administrador.') }
                }
            },
            '/api/propuestas/{id}/estado': {
                parameters: [parametroId('id', 'Identificador de la propuesta.')],
                patch: {
                    tags: ['Propuestas'],
                    summary: 'Aprobar o rechazar una propuesta pendiente (administrador)',
                    security: jwt,
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/EstadoPropuesta' }),
                    responses: {
                        200: respuestaJSON('Estado actualizado.'),
                        403: respuestaJSON('No se permite aprobar la propia propuesta.'),
                        404: respuestaJSON('Propuesta no encontrada.'),
                        409: respuestaJSON('La propuesta ya fue resuelta.')
                    }
                }
            },
            '/api/reviews': {
                post: {
                    tags: ['Reseñas'],
                    summary: 'Crear reseña como usuario o visitante',
                    security: identidadOpcional,
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/Resena' }),
                    responses: {
                        201: respuestaJSON('Reseña creada.'),
                        404: respuestaJSON('Contenido no encontrado.'),
                        409: respuestaJSON('Ya existe una reseña para esta identidad y contenido.')
                    }
                }
            },
            '/api/reviews/contenido/{contenidoId}': {
                parameters: [parametroId('contenidoId', 'Identificador del contenido.')],
                get: {
                    tags: ['Reseñas'],
                    summary: 'Listar reseñas de contenido aprobado',
                    responses: { 200: respuestaJSON('Reseñas visibles.'), 404: respuestaJSON('Contenido no encontrado.') }
                }
            },
            '/api/reviews/mis-reviews': {
                get: {
                    tags: ['Reseñas'],
                    summary: 'Listar reseñas de la identidad actual',
                    security: identidadOpcional,
                    responses: { 200: respuestaJSON('Reseñas propias.') }
                }
            },
            '/api/reviews/{id}': {
                parameters: [parametroId('id', 'Identificador de la reseña.')],
                get: {
                    tags: ['Reseñas'],
                    summary: 'Consultar una reseña visible',
                    responses: { 200: respuestaJSON('Reseña.'), 404: respuestaJSON('Reseña no encontrada.') }
                },
                put: {
                    tags: ['Reseñas'],
                    summary: 'Actualizar una reseña propia',
                    security: identidadOpcional,
                    requestBody: cuerpoJSON(objeto({
                        titulo: { type: 'string', maxLength: 25 },
                        comentario: texto,
                        calificacion: { type: 'integer', minimum: 1, maximum: 10 }
                    })),
                    responses: { 200: respuestaJSON('Reseña actualizada.'), 403: respuestaJSON('No eres el autor.'), 404: respuestaJSON('Reseña no encontrada.') }
                },
                delete: {
                    tags: ['Reseñas'],
                    summary: 'Eliminar una reseña propia',
                    security: identidadOpcional,
                    responses: { 204: respuesta('Reseña eliminada.'), 403: respuestaJSON('No eres el autor.'), 404: respuestaJSON('Reseña no encontrada.') }
                }
            },
            '/api/reacciones': {
                post: {
                    tags: ['Reacciones'],
                    summary: 'Crear o cambiar una reacción',
                    security: identidadOpcional,
                    requestBody: cuerpoJSON({ $ref: '#/components/schemas/Reaccion' }),
                    responses: {
                        201: respuestaJSON('Reacción creada.'),
                        200: respuestaJSON('Reacción existente actualizada o sin cambios.'),
                        403: respuestaJSON('Los usuarios no pueden reaccionar a su propia reseña.'),
                        404: respuestaJSON('Reseña no encontrada.')
                    }
                }
            },
            '/api/reacciones/mis-reacciones': {
                get: {
                    tags: ['Reacciones'],
                    summary: 'Listar reacciones de la identidad actual',
                    security: identidadOpcional,
                    responses: { 200: respuestaJSON('Reacciones propias.') }
                }
            },
            '/api/reacciones/review/{reviewId}': {
                parameters: [parametroId('reviewId', 'Identificador de la reseña.')],
                get: {
                    tags: ['Reacciones'],
                    summary: 'Consultar contadores de reacciones',
                    responses: { 200: respuestaJSON('Totales de likes y dislikes.'), 404: respuestaJSON('Reseña no encontrada.') }
                }
            },
            '/api/reacciones/{reviewId}': {
                parameters: [parametroId('reviewId', 'Identificador de la reseña.')],
                put: {
                    tags: ['Reacciones'],
                    summary: 'Cambiar una reacción propia',
                    security: identidadOpcional,
                    requestBody: cuerpoJSON(objeto({
                        tipo: { type: 'string', enum: ['like', 'dislike'] }
                    })),
                    responses: { 200: respuestaJSON('Reacción actualizada.'), 404: respuestaJSON('Reacción no encontrada.') }
                },
                delete: {
                    tags: ['Reacciones'],
                    summary: 'Retirar una reacción propia',
                    security: identidadOpcional,
                    responses: { 204: respuesta('Reacción eliminada.'), 404: respuestaJSON('Reacción no encontrada.') }
                }
            }
        }
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(options);

const parametroVersionAPI = {
    name: 'X-API-Version',
    in: 'header',
    required: false,
    description: 'Versión semver compatible; si se omite se usa la versión del servidor.',
    schema: { type: 'string', example: packageJson.version }
};

for (const [ruta, definicion] of Object.entries(swaggerSpec.paths)) {
    if (ruta.startsWith('/api/')) {
        definicion.parameters = [...(definicion.parameters ?? []), parametroVersionAPI];
    }
}

export default swaggerSpec;
