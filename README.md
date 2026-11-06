# ELARA Backend

API REST de ELARA para autenticación, usuarios, catálogo de películas, series y anime, propuestas, reseñas y reacciones. Está construida con Node.js, Express 5 y MySQL.

## Contenido

- [Requisitos](#requisitos)
- [Instalación y configuración](#instalación-y-configuración)
- [Ejecución local](#ejecución-local)
- [Ejecución con Docker Compose](#ejecución-con-docker-compose)
- [Uso de la API](#uso-de-la-api)
- [Referencia completa de endpoints](#referencia-completa-de-endpoints)
- [Validación, errores y límites](#validación-errores-y-límites)
- [Modelo de datos y estructura](#modelo-de-datos-y-estructura)
- [Pruebas](#pruebas)

## Requisitos

Para ejecutar el backend localmente:

- Node.js 22 o compatible con las dependencias del proyecto.
- npm.
- MySQL 8.x accesible desde el equipo.

Alternativamente, para ejecutar la aplicación y MySQL en contenedores:

- Docker Desktop o Docker Engine con Docker Compose.

## Instalación y configuración

Clona el repositorio e instala las dependencias:

```bash
git clone https://github.com/lemical07/elara-backend.git
cd elara-backend
npm install
```

Crea la configuración local a partir del ejemplo.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

En Bash:

```bash
cp .env.example .env
```

Edita `.env` con credenciales válidas para tu entorno. No compartas ni subas ese archivo al repositorio.

| Variable | Uso | Valor de referencia |
|---|---|---|
| `PORT` | Puerto HTTP del backend. | `3000` |
| `SERVER_PORT` | Puerto alternativo si `PORT` no está definido. | No definido por defecto |
| `TRUST_PROXY` | Proxy confiable para detectar HTTPS detrás de un proxy inverso. Configúralo según la topología real (por ejemplo, `1` para un único proxy confiable). | No definido |
| `JWT_SECRET` | Secreto privado usado para firmar y verificar JWT. | Define un secreto largo y aleatorio |
| `JWT_EXPIRES_IN` | Vigencia del JWT, según el formato aceptado por `jsonwebtoken`. | `1h` |
| `DB_HOST` | Host de MySQL. | `localhost` en ejecución local; `mysql` en Docker Compose |
| `DB_PORT` | Puerto de MySQL. | `3306` |
| `DB_NAME` | Base de datos. | `elara_db` |
| `DB_USER` | Usuario de MySQL de la aplicación. | Un usuario con permisos sobre `elara_db` |
| `DB_PASSWORD` | Contraseña de ese usuario. | Secreto del entorno |
| `MYSQL_ROOT_PASSWORD` | Contraseña root del contenedor MySQL. Requerida por Compose. | Secreto del entorno |
| `DB_EXTERNAL_PORT` | Puerto local publicado para MySQL por Compose. | `3307` |

`PORT` y `SERVER_PORT` determinan el puerto HTTP del proceso Express en ese orden. En Docker Compose, el contenedor escucha en el puerto `3000`; `PORT` configura el puerto publicado en el equipo anfitrión.

## Ejecución local

1. Inicia MySQL y configura las variables `DB_*` en `.env`.
2. Crea el esquema:

   ```bash
   mysql -u root -p < database/ddl/schema.sql
   ```

   El script crea la base `elara_db` y sus tablas.
3. Opcionalmente, carga los datos de ejemplo:

   ```bash
   mysql -u root -p elara_db < database/dml/insert.sql
   ```

   Ejecuta el seed solo en una base vacía o de pruebas: contiene inserciones con identificadores fijos y puede fallar si esos registros ya existen. Los hashes de contraseña del archivo son marcadores de ejemplo, no credenciales utilizables.
4. Inicia el servidor desde la raíz del proyecto:

   ```bash
   npm run dev
   ```

   `npm run dev` inicia `nodemon src/app.js`. También puedes ejecutar el proceso directamente:

   ```bash
   node src/app.js
   ```

El servidor escucha por defecto en `http://localhost:3000`. Verifica su disponibilidad en `http://localhost:3000/health`. Este endpoint confirma que Express responde, pero **no** comprueba la conexión a MySQL.

## Ejecución con Docker Compose

Configura `.env`, incluyendo `MYSQL_ROOT_PASSWORD`, `DB_USER` y `DB_PASSWORD`, y desde la raíz ejecuta:

```bash
docker compose up --build -d
docker compose ps
```

Compose inicia el backend y MySQL. MySQL se publica únicamente en `127.0.0.1`, por defecto en el puerto `3307`; el backend se publica por defecto en el puerto `3000`. El contenedor espera a que el health check de MySQL indique que está disponible.

En un volumen MySQL nuevo, el contenedor ejecuta `database/ddl/schema.sql` al inicializarse. El archivo `database/dml/insert.sql` no se carga automáticamente; si necesitas datos de ejemplo, ejecútalo manualmente una sola vez:

```bash
docker compose exec -T mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" elara_db < /seed/insert.sql'
```

Consulta los registros si un servicio no inicia:

```bash
docker compose logs --tail=50 backend
docker compose logs --tail=50 mysql
```

Detén los contenedores conservando los datos:

```bash
docker compose down
```

Esto conserva el volumen `elara_mysql_data`. **No uses `docker compose down -v`** salvo que quieras eliminar deliberadamente ese volumen y los datos persistidos. Los scripts de inicialización no vuelven a ejecutarse sobre un volumen ya existente.

## Uso de la API

### Direcciones

| Recurso | URL predeterminada |
|---|---|
| API REST | `http://localhost:3000/api` |
| Comprobación del proceso | `http://localhost:3000/health` |
| Swagger UI | `http://localhost:3000/api-docs` |

El puerto puede cambiarse mediante `PORT` o `SERVER_PORT`. Sustituye `3000` en las URLs si el servidor usa otro puerto.

### Integración con ELARA Frontend

El frontend se mantiene en un repositorio independiente: [lemical07/elara-frontend](https://github.com/lemical07/elara-frontend). La referencia de integración documentada es el commit [`0f668df2d2ca645f522397c4268c7d0b40f84902`](https://github.com/lemical07/elara-frontend/commit/0f668df2d2ca645f522397c4268c7d0b40f84902).

En desarrollo local, el servidor nativo `server.mjs` del frontend sirve la interfaz en `http://localhost:5500` y actúa como proxy para las solicitudes con el prefijo público `/elara`. Reenvía al backend sustituyendo únicamente ese prefijo por `/api`; el backend conserva sin cambios sus rutas y contratos:

| Solicitud del navegador | Ruta que recibe el backend |
|---|---|
| `/elara/auth/login` | `http://localhost:3000/api/auth/login` |
| `/elara/auth/me` | `http://localhost:3000/api/auth/me` |

Para ejecutar la integración:

1. Inicia el backend según [Ejecución local](#ejecución-local), normalmente en `http://localhost:3000`.
2. Desde la raíz del repositorio frontend ejecuta `node server.mjs` y abre `http://localhost:5500`.
3. Comprueba el servicio mediante `http://localhost:5500/elara/auth/me`. Sin una sesión autenticada, el backend puede responder `401`; esa respuesta confirma que la solicitud llegó al endpoint protegido.

El proxy local conserva el método, la ruta restante, los parámetros de consulta, el cuerpo y los encabezados de solicitud; transmite la respuesta y `Set-Cookie`. El JWT continúa verificándose en el backend. Este servidor es una herramienta de desarrollo, no un componente de producción. En producción, el frontend y la API deben publicarse bajo una configuración de mismo origen o una infraestructura que enrute las solicitudes y configure CORS explícitamente si los orígenes son distintos.

### Solicitudes y autenticación

- Las rutas con cuerpo JSON esperan `Content-Type: application/json`.
- Las rutas protegidas requieren `Authorization: Bearer <token>`.
- Obtén el token mediante `POST /api/auth/register` o `POST /api/auth/login`. El backend decide si el registro inicializa al administrador; el cliente no puede enviar un rol.
- La autenticación opcional de reseñas y reacciones acepta un JWT válido o identifica a visitantes mediante la cookie `elara_visitante`.
- El backend crea esa cookie para visitantes con `HttpOnly`, `SameSite=Lax`, `Path=/` y duración de un año. `Secure` depende de que la solicitud llegue como HTTPS según `req.secure`.
- Los clientes web que usen la cookie deben enviar credenciales. Este backend no configura CORS; el frontend debe compartir origen con la API o el despliegue debe configurar CORS explícitamente con orígenes permitidos y credenciales.
- No existe un endpoint de cierre de sesión ni revocación del JWT. El cliente debe descartar su token al cerrar sesión.

### Ejemplo de inicio de sesión

```http
POST /api/auth/login
Content-Type: application/json
```

```json
{
  "correo": "ana@example.com",
  "contrasena": "ClaveSegura123"
}
```

La respuesta correcta incluye `datos.usuario` y `datos.token`. Envía ese token en el encabezado `Authorization` para las operaciones protegidas.

### Versión de API

Las solicitudes bajo `/api` pueden incluir `X-API-Version` con una versión semver. Si se omite, el backend usa la versión de `package.json` (`1.0.0`). El servidor responde con la versión vigente en la cabecera `X-API-Version`; una versión inválida responde `400` y una versión no compatible responde `406`.

## Referencia completa de endpoints

En las tablas, `{id}`, `{contenidoId}`, `{reviewId}` y `{personajeId}` representan identificadores enteros positivos. Las rutas se muestran desde la raíz del servidor; por ejemplo, `GET /api/auth/me`.

### Salud y documentación

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/health` | Público | Comprueba que Express responde. No consulta MySQL. |
| `GET` | `/api-docs` | Público | Interfaz Swagger UI. |

### Autenticación

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/auth/register` | Público | Inicializa al primer administrador o registra una cuenta normal según el estado de la base de datos. |
| `POST` | `/api/auth/login` | Público | Valida credenciales y genera un JWT. |
| `GET` | `/api/auth/me` | JWT | Devuelve la sesión y el perfil autenticados. |

El registro requiere `nombre`, `apellido` y `correo`; `contrasena` solo se envía para cuentas posteriores. Si la base de datos no contiene usuarios, el primer registro debe omitirla: el backend asigna `Administrador`, genera una contraseña aleatoria de 13 caracteres y devuelve esa clave una sola vez en `datos.contrasena_temporal`, junto con `datos.primer_administrador: true`. La pantalla de bienvenida permite consultarla durante 60 segundos; no existe un endpoint para recuperarla. En producción, sirve el flujo exclusivamente mediante HTTPS. Si ya hay usuarios, la contraseña es obligatoria y el backend asigna `Usuario`. Las contraseñas enviadas deben tener al menos 8 caracteres y no superar 72 bytes; se almacenan con bcrypt. Nunca envíes campos de rol o estado al registrar.

La comprobación de usuarios y la creación se ejecutan bajo un bloqueo asesor de MySQL y una transacción. Si el primer registro falla, la transacción se revierte y no se devuelve la contraseña temporal.

### Usuarios

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/usuarios/me` | JWT | Consulta el perfil propio. |
| `PUT` | `/api/usuarios/me` | JWT | Actualiza uno o más de `nombre`, `apellido` y `correo`. |
| `PATCH` | `/api/usuarios/me/contrasena` | JWT | Cambia la contraseña propia. Requiere `contrasena_actual`, `contrasena_nueva` y `contrasena_nueva_confirmacion`. |
| `DELETE` | `/api/usuarios/me` | JWT | Desactiva la cuenta propia. |
| `DELETE` | `/api/usuarios/me/permanente` | JWT | Elimina permanentemente la cuenta propia. Requiere `contrasena_actual`. |
| `GET` | `/api/usuarios` | JWT + Admin | Lista perfiles de usuarios. |
| `GET` | `/api/usuarios/{id}` | JWT + Admin | Consulta un perfil por identificador. |
| `PATCH` | `/api/usuarios/{id}` | JWT + Admin | Actualiza nombre, apellido o correo. |
| `PATCH` | `/api/usuarios/{id}/estado` | JWT + Admin | Activa o desactiva la cuenta usando `{"activo": true}` o `{"activo": false}`. |
| `PATCH` | `/api/usuarios/{id}/rol` | JWT + Admin | Concede `ADMIN` o `USUARIO` usando `{"rol":"ADMIN"}` o `{"rol":"USUARIO"}`. |

Las rutas de administración aceptan roles `Admin` y `Administrador`. Las respuestas de usuario no deben exponer contraseñas ni hashes. No se permite desactivar, eliminar ni retirar el rol de la última cuenta administradora activa. Los permisos se consultan desde MySQL en cada petición autenticada, por lo que un cambio de rol afecta también a tokens ya emitidos. La eliminación permanente es irreversible.

### Categorías

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/categorias` | Público | Lista categorías. |
| `POST` | `/api/categorias` | JWT + Admin | Crea una categoría. |
| `PUT` | `/api/categorias/{id}` | JWT + Admin | Actualiza una categoría. |
| `DELETE` | `/api/categorias/{id}` | JWT + Admin | Elimina una categoría si no tiene contenidos asociados. |

Para crear o actualizar, `nombre` es obligatorio y `descripcion` es opcional. El nombre debe ser único.

### Contenidos

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `GET` | `/api/contenidos/catalogo` | Público | Lista contenidos aprobados; admite los filtros descritos abajo. |
| `GET` | `/api/contenidos/{id}` | Público | Consulta el detalle de un contenido aprobado. |
| `GET` | `/api/contenidos/{id}/personajes` | Público | Lista personajes de un contenido aprobado. |
| `POST` | `/api/contenidos` | JWT + Admin | Crea contenido aprobado. |
| `PUT` | `/api/contenidos/{id}` | JWT + Admin | Reemplaza los datos editables del contenido. |
| `DELETE` | `/api/contenidos/{id}` | JWT + Admin | Elimina contenido. |
| `POST` | `/api/contenidos/{id}/personajes` | JWT + Admin | Añade un personaje al contenido. |
| `PUT` | `/api/contenidos/{id}/personajes/{personajeId}` | JWT + Admin | Actualiza un personaje. |
| `DELETE` | `/api/contenidos/{id}/personajes/{personajeId}` | JWT + Admin | Elimina un personaje. |

Filtros aceptados por `GET /api/contenidos/catalogo`:

| Parámetro | Valores / formato |
|---|---|
| `titulo` | Texto, hasta 50 caracteres. |
| `tipo` | `pelicula`, `serie` o `anime`. |
| `categoria` | Nombre de categoría no vacío. |
| `anio` | Entero entre 1901 y 2155. |
| `orden` | `anio_desc`, `anio_asc`, `titulo_asc` o `titulo_desc`. |

Para crear o actualizar contenido, los únicos campos permitidos son `categoria_id`, `titulo`, `tipo`, `descripcion`, `anio`, `director`, `url_imagen` y `url_trailer`. `categoria_id`, `titulo`, `tipo` y `anio` son obligatorios también en la actualización. El cliente no puede asignar `estado`. Los tipos admitidos son `pelicula`, `serie` y `anime`.

Para cambiar la contraseña desde el perfil, envía `contrasena_actual`, `contrasena_nueva` y `contrasena_nueva_confirmacion`; ambas nuevas deben coincidir. No se requiere cambiar la contraseña temporal para acceder al catálogo. Si el backend está detrás de un proxy HTTPS en producción, configura `TRUST_PROXY` únicamente con la cantidad o las direcciones de proxies confiables de tu despliegue; el endpoint de registro rechaza solicitudes que Express no identifica como HTTPS.

Para crear o actualizar un personaje, envía exactamente `{"nombre":"Nombre","tipo":"principal"}`. `tipo` admite `principal` o `secundario`.

### Propuestas de contenido

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/propuestas` | JWT | Envía una propuesta, que queda pendiente de revisión. |
| `GET` | `/api/propuestas/pendientes` | JWT + Admin | Lista propuestas pendientes. |
| `PATCH` | `/api/propuestas/{id}/estado` | JWT + Admin | Aprueba o rechaza una propuesta pendiente. |

Para proponer contenido se permiten `titulo`, `descripcion`, `anio`, `tipo`, `categoria_id`, `director`, `url_imagen` y `url_trailer`; no se acepta `estado` ni `propuesto_por`. Para cambiar el estado envía únicamente `{"estado":"aprobado"}` o `{"estado":"rechazado"}`. Un administrador no puede resolver su propia propuesta.

### Reseñas

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/reviews` | Público, JWT o visitante | Crea una reseña de contenido aprobado. |
| `GET` | `/api/reviews/contenido/{contenidoId}` | Público | Lista reseñas del contenido aprobado. |
| `GET` | `/api/reviews/mis-reviews` | Público, JWT o visitante | Lista reseñas de la identidad actual. |
| `GET` | `/api/reviews/{id}` | Público | Consulta una reseña visible. |
| `PUT` | `/api/reviews/{id}` | Autor (JWT o cookie de visitante) | Actualiza una reseña propia. |
| `DELETE` | `/api/reviews/{id}` | Autor (JWT o cookie de visitante) | Elimina una reseña propia; responde `204` sin cuerpo. |

Ejemplo de creación:

```json
{
  "contenido_id": 1,
  "titulo": "Muy recomendable",
  "comentario": "Una historia excelente.",
  "calificacion": 9
}
```

`titulo` es obligatorio y admite hasta 25 caracteres; `comentario` y `nombre_visitante` son opcionales; `calificacion` debe ser un entero de 1 a 10. Cada identidad puede crear como máximo una reseña por contenido. En la actualización envía uno o más campos entre `titulo`, `comentario` y `calificacion`. No se permite elegir manualmente `usuario_id`, `visitante_id` o `contenido_id`.

### Reacciones

| Método | Endpoint | Acceso | Descripción |
|---|---|---|---|
| `POST` | `/api/reacciones` | Público, JWT o visitante | Crea una reacción o cambia el tipo de la reacción propia. |
| `GET` | `/api/reacciones/review/{reviewId}` | Público | Consulta totales de likes y dislikes de una reseña visible. |
| `GET` | `/api/reacciones/mis-reacciones` | Público, JWT o visitante | Lista reacciones de la identidad actual. |
| `PUT` | `/api/reacciones/{reviewId}` | Propietario (JWT o cookie de visitante) | Cambia el tipo de una reacción propia. |
| `DELETE` | `/api/reacciones/{reviewId}` | Propietario (JWT o cookie de visitante) | Elimina la reacción propia; responde `204` sin cuerpo. |

Para crear una reacción envía `{"review_id":12,"tipo":"like"}`. Para actualizar, envía `{"tipo":"dislike"}` a la ruta `PUT`. `tipo` admite `like` o `dislike`. Una persona usuaria autenticada no puede reaccionar a su propia reseña; un visitante sí puede hacerlo.

## Validación, errores y límites

- Las rutas privadas responden `401` si falta o no es válido el JWT. Las operaciones administrativas responden `403` si el usuario autenticado no tiene rol administrativo.
- Las solicitudes inválidas responden con detalles de validación. Los recursos inexistentes y conflictos de negocio pueden producir `404` y `409`, respectivamente, según la operación.
- Las respuestas de errores inesperados usan `500`; las rutas no registradas responden `404`.
- La API limita solicitudes a 200 por IP cada 15 minutos. Los endpoints de registro e inicio de sesión permiten hasta 10 intentos fallidos por IP en 15 minutos; las solicitudes de autenticación exitosas no cuentan para ese límite.
- La versión solicitada se valida antes de las rutas `/api`: semver inválida produce `400`, versión fuera del rango compatible produce `406`.
- La ruta `/health` no está bajo `/api`, no usa el límite general de API y no verifica MySQL.
- Los parámetros de autorización y validación no sustituyen las reglas de negocio ni los permisos aplicados por el backend.

## Modelo de datos y estructura

Las tablas principales se definen en `database/ddl/schema.sql`: `rol`, `usuario`, `categoria`, `contenido`, `personaje`, `visitante`, `review` y `reaccion`. El esquema aplica claves foráneas, restricciones de unicidad y la relación de identidad entre usuarios o visitantes y sus reseñas/reacciones.

```text
elara-backend/
├── database/
│   ├── ddl/schema.sql
│   └── dml/insert.sql
├── docs/
│   ├── swagger.js
│   └── uml/modelo-relacional.png
├── src/
│   ├── config/       # MySQL y Passport
│   ├── controllers/  # Entrada HTTP y respuestas
│   ├── dtos/         # Formatos de datos de entrada/salida
│   ├── factories/    # Espacio reservado para fábricas
│   ├── middleware/   # Autenticación, validación, límites y errores
│   ├── repositories/ # Persistencia MySQL
│   ├── routes/       # Rutas HTTP y permisos
│   ├── services/     # Reglas de negocio
│   ├── validators/   # Validación de parámetros y cuerpos
│   ├── utils/        # Espacio reservado para utilidades compartidas
│   └── app.js         # Configuración e inicio de Express
├── .env.example
├── Dockerfile
├── compose.yaml
└── package.json
```

La API implementa capas de rutas, controladores, servicios y repositorios; los DTO y validadores se usan para delimitar los datos transferidos y aceptados. La documentación interactiva se genera desde `docs/swagger.js`.

## Pruebas

El script definido en `package.json` es:

```bash
npm test
```

Invoca el runner integrado `node --test`. En el checkout documentado no hay actualmente una carpeta `tests/` con pruebas del backend, por lo que este comando no representa una suite funcional de pruebas de API.

## Licencia

El `package.json` declara la licencia **ISC**.
