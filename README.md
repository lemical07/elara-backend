# ELARA Backend

API REST para un catálogo de películas, series y anime.

## Descripción

ELARA Backend es el componente encargado de gestionar la lógica del servidor, procesar solicitudes HTTP y proporcionar los datos necesarios para la aplicación ELARA. La API utiliza Express 5, autenticación JWT y cookies de visitante para reseñas y reacciones anónimas.

El proyecto se desarrolla con Node.js y Express, utilizando MySQL como sistema de gestión de bases de datos. También cuenta con una configuración de Docker para ejecutar el backend y la base de datos en contenedores independientes.

El backend incluye autenticación JWT, gestión de usuarios y categorías, consulta del catálogo, reseñas y reacciones. La guía de Postman de este README separa las rutas públicas de las protegidas y especifica los permisos requeridos para cada módulo.

## Tecnologías

- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** framework para construir la API REST.
- **MySQL:** sistema de gestión de bases de datos.
- **mysql2:** controlador para conectar Node.js con MySQL.
- **dotenv:** carga de variables de entorno.
- **Docker:** ejecución del backend y MySQL en contenedores.
- **Postman:** herramienta para probar los endpoints de la API.
- **Git:** control de versiones.

## Requisitos

Para trabajar con el proyecto se necesita:

- Git.
- Node.js y npm para la ejecución local.
- MySQL para la ejecución local, o Docker Desktop para ejecutar el backend y la base de datos en contenedores.
- Postman para las pruebas HTTP.

## Instalación del proyecto

### 1. Clonar el repositorio

Abre una terminal y ejecuta:

```bash
git clone https://github.com/lemical07/elara-backend.git
```

Accede a la carpeta del proyecto:

```bash
cd elara-backend
```

### 2. Instalar las dependencias

```bash
npm install
```

### 3. Configurar las variables de entorno

Crea el archivo `.env` a partir de `.env.example`.

En PowerShell:

```powershell
Copy-Item .env.example .env
```

En Git Bash, Linux o macOS:

```bash
cp .env.example .env
```

Después, abre `.env` y configura los valores necesarios para el entorno que utilizarás.

> El archivo `.env` contiene configuración local y credenciales. No debe subirse al repositorio.

## Pruebas de endpoints en Postman

Esta guía documenta las rutas montadas actualmente en `src/app.js`. Usa variables de entorno de Postman para repetir las pruebas sin tener que cambiar manualmente el host o los identificadores.

### Preparar Postman

1. Inicia el servidor y crea un entorno de Postman con estas variables:

   | Variable | Valor de ejemplo |
   |---|---|
   | `baseUrl` | `http://localhost:3000` |
   | `token` | El token recibido al registrarte o iniciar sesión |
   | `usuarioId` | ID de un usuario existente |
   | `categoriaId` | ID de una categoría existente |
   | `contenidoId` | ID de un contenido aprobado |
   | `reviewId` | ID de una reseña visible |

2. Para solicitudes con JSON, selecciona **Body → raw → JSON**.
3. En las solicitudes protegidas, configura Authorization → Bearer Token y usa `{{token}}`.
4. No configures autorización para las solicitudes marcadas como **Público**.

La API requiere `JWT_SECRET` en `.env`. El registro crea usuarios con rol `Usuario`. No existe una ruta de logout con blacklist: para cerrar sesión, elimina el JWT del cliente. Para probar rutas administrativas, utiliza una cuenta que ya tenga el rol `Admin` o `Administrador` en MySQL.

### Salud del servidor

| Método | URL | Acceso | Responsabilidad |
|---|---|---|---|
| `GET` | `{{baseUrl}}/health` | Público | Comprobar que Express responde. No verifica la conexión a MySQL. |

### Autenticación

| Método | URL | Acceso | Responsabilidad |
|---|---|---|---|
| `POST` | `{{baseUrl}}/api/auth/register` | Público | Registrar un usuario y devolver un token. |
| `POST` | `{{baseUrl}}/api/auth/login` | Público | Validar credenciales y devolver un token. |
| `GET` | `{{baseUrl}}/api/auth/me` | JWT | Consultar la sesión autenticada. |

**Registro — `POST /api/auth/register`:**

```json
{
  "nombre": "Ana",
  "apellido": "Pérez",
  "correo": "ana@example.com",
  "contrasena": "ClaveSegura123"
}
```

La respuesta contiene `datos.usuario` y `datos.token`. Guarda el token en la variable `token`. No envíes campos de rol ni estado.

**Inicio de sesión — `POST /api/auth/login`:**

```json
{
  "correo": "ana@example.com",
  "contrasena": "ClaveSegura123"
}
```

Guarda `datos.token` de la respuesta en `token`. El registro responde `201`, el inicio de sesión `200`, las credenciales inválidas `401` y un correo duplicado `409`.

### Categorías

| Método | URL | Acceso | Responsabilidad |
|---|---|---|---|
| `GET` | `{{baseUrl}}/api/categorias` | Público | Listar categorías. |
| `POST` | `{{baseUrl}}/api/categorias` | JWT + Admin | Crear una categoría. |
| `PUT` | `{{baseUrl}}/api/categorias/{{categoriaId}}` | JWT + Admin | Actualizar una categoría. |
| `DELETE` | `{{baseUrl}}/api/categorias/{{categoriaId}}` | JWT + Admin | Eliminar una categoría sin contenidos asociados. |

Para crear o actualizar, envía:

```json
{
  "nombre": "Anime",
  "descripcion": "Series y películas de animación japonesa"
}
```

Las operaciones de escritura requieren un token cuyo usuario tenga rol `Admin` o `Administrador`. Un nombre duplicado responde `409`; una categoría inexistente responde `404`; una categoría con contenidos asociados no se puede eliminar.

### Contenidos

| Método | URL | Acceso | Responsabilidad |
|---|---|---|---|
| `GET` | `{{baseUrl}}/api/contenidos/catalogo` | Público | Listar contenidos aprobados. |
| `GET` | `{{baseUrl}}/api/contenidos/catalogo?categoria=Anime` | Público | Filtrar el catálogo por categoría. |
| `GET` | `{{baseUrl}}/api/contenidos/catalogo?tipo=anime&anio=2020&orden=titulo_asc` | Público | Buscar por título y filtrar por tipo, categoría, año u orden. |
| `GET` | `{{baseUrl}}/api/contenidos/{{contenidoId}}` | Público | Consultar el detalle de un contenido aprobado y sus personajes. |
| `GET` | `{{baseUrl}}/api/contenidos/{{contenidoId}}/personajes` | Público | Consultar los personajes de un contenido aprobado. |
| `POST` | `{{baseUrl}}/api/contenidos` | JWT + Admin | Crear contenido aprobado directamente. |
| `PUT` | `{{baseUrl}}/api/contenidos/{{contenidoId}}` | JWT + Admin | Reemplazar los datos editables del contenido. |
| `DELETE` | `{{baseUrl}}/api/contenidos/{{contenidoId}}` | JWT + Admin | Eliminar el contenido. |
| `POST` | `{{baseUrl}}/api/contenidos/{{contenidoId}}/personajes` | JWT + Admin | Registrar un personaje principal o secundario. |
| `PUT` | `{{baseUrl}}/api/contenidos/{{contenidoId}}/personajes/{{personajeId}}` | JWT + Admin | Actualizar un personaje. |
| `DELETE` | `{{baseUrl}}/api/contenidos/{{contenidoId}}/personajes/{{personajeId}}` | JWT + Admin | Eliminar un personaje. |

El catálogo y el detalle públicos solo muestran contenidos aprobados. Los campos admitidos al crear o reemplazar contenido son `categoria_id`, `titulo`, `tipo`, `descripcion`, `anio`, `director`, `url_imagen` y `url_trailer`; no se acepta que el cliente asigne `estado`. Para crear un personaje envía `{"nombre":"Nombre","tipo":"principal"}`.

### Propuestas de contenido

| Método | URL | Acceso | Responsabilidad |
|---|---|---|---|
| `POST` | `{{baseUrl}}/api/propuestas` | JWT | Proponer contenido, que se registra como `pendiente`. |
| `GET` | `{{baseUrl}}/api/propuestas/pendientes` | JWT + Admin | Listar propuestas pendientes. |
| `PATCH` | `{{baseUrl}}/api/propuestas/{{contenidoId}}/estado` | JWT + Admin | Aprobar o rechazar una propuesta pendiente. |

Para proponer, envía los campos de contenido y no incluyas `estado` ni `propuesto_por`. Para resolver una propuesta, envía únicamente `{"estado":"aprobado"}` o `{"estado":"rechazado"}`. Un administrador no puede aprobar su propia propuesta.

### Usuarios y perfiles

#### Acciones del usuario autenticado

| Método | URL | Acceso | Responsabilidad |
|---|---|---|---|
| `GET` | `{{baseUrl}}/api/usuarios/me` | JWT | Consultar el perfil propio. |
| `PUT` | `{{baseUrl}}/api/usuarios/me` | JWT | Actualizar nombre, apellido y/o correo propios. |
| `PATCH` | `{{baseUrl}}/api/usuarios/me/contrasena` | JWT | Cambiar la contraseña propia. |
| `DELETE` | `{{baseUrl}}/api/usuarios/me` | JWT | Desactivar la cuenta propia. |
| `DELETE` | `{{baseUrl}}/api/usuarios/me/permanente` | JWT + contraseña actual | Eliminar físicamente la cuenta propia. |

**Actualizar perfil — `PUT /api/usuarios/me`:**

```json
{
  "nombre": "Ana María"
}
```

Puedes enviar uno o más de `nombre`, `apellido` y `correo`. No se aceptan campos como `id`, `rol_id`, `activo` ni `contrasena`.

**Cambiar contraseña — `PATCH /api/usuarios/me/contrasena`:**

```json
{
  "contrasena_actual": "ClaveSegura123",
  "contrasena_nueva": "OtraClaveSegura456"
}
```

**Eliminar permanentemente la cuenta — `DELETE /api/usuarios/me/permanente`:**

```json
{
  "contrasena_actual": "ClaveSegura123"
}
```

La eliminación es irreversible y requiere la contraseña actual. No se permite eliminar la última cuenta administradora activa.

#### Administración de usuarios

Todas estas operaciones requieren JWT y rol `Admin` o `Administrador`:

| Método | URL | Responsabilidad |
|---|---|---|
| `GET` | `{{baseUrl}}/api/usuarios` | Listar perfiles públicos. |
| `GET` | `{{baseUrl}}/api/usuarios/{{usuarioId}}` | Consultar un perfil. |
| `PATCH` | `{{baseUrl}}/api/usuarios/{{usuarioId}}` | Actualizar nombre, apellido y/o correo; no permite cambiar el rol. |
| `PATCH` | `{{baseUrl}}/api/usuarios/{{usuarioId}}/estado` | Activar o desactivar una cuenta. |

**Cambiar estado — `PATCH /api/usuarios/{{usuarioId}}/estado`:**

```json
{
  "activo": false
}
```

Las respuestas no incluyen contraseñas ni hashes. Las cuentas se desactivan lógicamente; la API impide desactivar la última cuenta administradora activa.

### Reseñas y calificaciones

Las reseñas pueden publicarse como usuario registrado o visitante. En el primer caso, la identidad se obtiene del JWT, nunca de un `usuario_id` enviado por el cliente. Para visitantes, el servidor emite una cookie `elara_visitante` HttpOnly, SameSite=Lax, con vigencia de un año, y utiliza esa cookie para reconocer a quien crea, edita o elimina la reseña. `Secure` se activa cuando Express reconoce HTTPS; si TLS termina en un proxy, configura la confianza de ese proxy antes del despliegue. Las consultas públicas solo muestran reseñas asociadas a contenido aprobado.

Postman conserva y envía la cookie automáticamente. Un frontend debe incluir `credentials: 'include'` al hacer solicitudes con cookies. Este backend no habilita CORS para un origen frontend todavía no definido; para usar frontend y backend en distintos orígenes, configura CORS con el origen exacto y el soporte de credenciales antes del despliegue.

| Método | URL | Acceso | Responsabilidad |
|---|---|---|---|
| `POST` | `{{baseUrl}}/api/reviews` | Público o JWT | Crear una reseña para contenido aprobado. |
| `GET` | `{{baseUrl}}/api/reviews/contenido/{{contenidoId}}` | Público | Listar reseñas de un contenido aprobado. |
| `GET` | `{{baseUrl}}/api/reviews/{{reviewId}}` | Público | Consultar una reseña visible. |
| `GET` | `{{baseUrl}}/api/reviews/mis-reviews` | Público o JWT | Listar las reseñas de la identidad actual. |
| `PUT` | `{{baseUrl}}/api/reviews/{{reviewId}}` | Público o JWT, solo autor | Actualizar título, comentario y/o calificación. |
| `DELETE` | `{{baseUrl}}/api/reviews/{{reviewId}}` | Público o JWT, solo autor | Eliminar la reseña; responde `204` sin body. |

**Crear reseña — `POST /api/reviews`:**

```json
{
  "contenido_id": 1,
  "titulo": "Muy recomendable",
  "comentario": "Una historia excelente.",
  "calificacion": 9
}
```

El título es obligatorio y admite hasta 25 caracteres; el comentario es opcional; la calificación debe ser un entero de 1 a 10. Cada identidad (cuenta o cookie visitante) puede crear una reseña por contenido; un duplicado responde `409`. Para visitantes, conserva la cookie entre solicitudes; Postman normalmente guarda las cookies recibidas y las envía automáticamente. Para actualizar, envía solo los campos que quieres cambiar, por ejemplo `{"calificacion":10}`. No se pueden enviar o modificar `usuario_id`, `visitante_id`, `contenido_id` ni las fechas.

### Reacciones

Las operaciones de escritura aceptan usuario autenticado o visitante identificado por cookie. Los usuarios registrados no pueden reaccionar a sus propias reseñas; los visitantes sí pueden hacerlo. Las consultas públicas de totales solo consideran reseñas asociadas a contenido aprobado.

| Método | URL | Acceso | Responsabilidad |
|---|---|---|---|
| `POST` | `{{baseUrl}}/api/reacciones` | Público o JWT | Crear una reacción o cambiar el tipo existente. |
| `PUT` | `{{baseUrl}}/api/reacciones/{{reviewId}}` | Público o JWT | Cambiar el tipo de una reacción propia existente. |
| `DELETE` | `{{baseUrl}}/api/reacciones/{{reviewId}}` | Público o JWT | Retirar la reacción propia; responde `204` sin body. |
| `GET` | `{{baseUrl}}/api/reacciones/review/{{reviewId}}` | Público | Consultar totales de likes y dislikes. |
| `GET` | `{{baseUrl}}/api/reacciones/mis-reacciones` | Público o JWT | Listar las reacciones de la identidad actual. |

**Crear o actualizar una reacción — `POST /api/reacciones`:**

```json
{
  "review_id": 12,
  "tipo": "like"
}
```

El tipo solo puede ser `like` o `dislike`. Repetir el mismo tipo no crea otra reacción; enviar el tipo contrario actualiza la reacción existente. El alta responde `201`; los cambios o reintentos sin cambios responden `200`. En la ruta `PUT`, envía únicamente el tipo:

```json
{
  "tipo": "dislike"
}
```

### Niveles de acceso y errores

- **Público:** no configures JWT en Postman.
- **JWT:** envía el token de un usuario activo mediante Authorization → Bearer Token.
- **JWT + Admin:** además del token válido, el usuario debe tener rol `Admin` o `Administrador`.
- **Solo autor:** el token debe pertenecer al autor de la reseña.
- Una solicitud privada sin token válido responde `401`; un usuario sin permisos responde `403`. El código para recursos inexistentes depende del endpoint.
- Las rutas de visitante conservan su identidad mediante la cookie `elara_visitante`; no es un mecanismo de autenticación fuerte ni identifica a la persona entre navegadores o dispositivos.
- En las solicitudes a `/api`, se puede enviar `X-API-Version: 1.0.0`. Si se omite, se usa la versión del paquete. Versiones semver incompatibles se rechazan con `406`.

## Configuración de variables de entorno

El proyecto utiliza variables de entorno para separar la configuración del código fuente.

Ejemplo para ejecutar ELARA directamente en Windows con una instalación local de MySQL:

```dotenv
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=elara_db
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
JWT_SECRET=una-clave-privada-larga
JWT_EXPIRES_IN=1h
```

Los valores deben corresponder a la instalación de MySQL que se utilizará. La base de datos `elara_db` y las tablas definidas en `database/ddl/schema.sql` deben existir antes de probar los endpoints.

Para Docker, `DB_HOST` debe corresponder al nombre del servicio MySQL definido en `compose.yaml`, normalmente `mysql`. Además, el archivo `.env` debe incluir las variables requeridas para inicializar el contenedor, como las contraseñas de MySQL y el puerto externo.

**Importante:** copiar `.env.example` crea el archivo `.env`, pero debes configurar credenciales reales y una clave privada para `JWT_SECRET`. No subas `.env` al repositorio.

## Ejecución local

### 1. Configurar MySQL

Asegúrate de que MySQL esté ejecutándose. Aplica `database/ddl/schema.sql` usando una cuenta autorizada para crear la base de datos y las tablas. Para cargar roles, categorías y datos de prueba, ejecuta después `database/dml/insert.sql` en `elara_db`; ese archivo contiene hashes de contraseña de ejemplo que no sirven para iniciar sesión.

Configura en `.env` el host, el puerto, el nombre de la base de datos y las credenciales correspondientes.

### 2. Iniciar el servidor

Desde la raíz del proyecto, puedes iniciar el servidor con:

```bash
node src/app.js
```

En desarrollo también está disponible `npm run dev`.

Si el servidor inicia correctamente, se mostrará un mensaje indicando el puerto en el que está escuchando.

## Ejecución con Docker

Docker permite ejecutar el backend y MySQL sin tener que iniciar ambos servicios manualmente.

Asegúrate de que Docker Desktop esté en ejecución y de que el archivo `.env` contenga las variables requeridas por `compose.yaml`.

### 1. Construir e iniciar los servicios

Desde la raíz del proyecto:

```bash
docker compose up --build -d
```

Este comando construye la imagen del backend e inicia los contenedores en segundo plano.

### 2. Comprobar el estado

```bash
docker compose ps
```

Comprueba que el backend esté ejecutándose y que MySQL alcance el estado `healthy`. En un volumen MySQL nuevo, `schema.sql` se ejecuta automáticamente. Los datos de prueba no se cargan solos; si los necesitas, ejecuta una sola vez:

```bash
docker compose exec -T mysql sh -c 'mysql -uroot -p"$MYSQL_ROOT_PASSWORD" elara_db < /seed/insert.sql'
```

El script de datos agrega los roles y categorías requeridos, así como cuentas con hashes de ejemplo no utilizables para iniciar sesión. Ejecútalo una sola vez antes de registrar usuarios o crear contenido. Registra una cuenta propia por `/api/auth/register`; para probar rutas administrativas, asigna el rol desde la base de datos en el entorno local, no desde una solicitud HTTP. Por ejemplo, sustituye el correo por el de tu cuenta de pruebas:

```sql
UPDATE usuario
SET rol_id = (SELECT id FROM rol WHERE nombre_rol = 'Administrador')
WHERE correo = 'admin-pruebas@example.com';
```

La inicialización de `schema.sql` solo se ejecuta al crear el volumen por primera vez. Si el volumen ya existía, el contenedor no vuelve a ejecutar los inicializadores. No elimines el volumen para forzar la inicialización si contiene datos que quieras conservar.

Si algún servicio falla, consulta sus registros:

```bash
docker compose logs --tail=50 backend
```

```bash
docker compose logs --tail=50 mysql
```

### 3. Detener los servicios

Cuando termines de trabajar:

```bash
docker compose down
```

Este comando detiene y elimina los contenedores, pero conserva el volumen persistente de MySQL.

**No utilices `docker compose down -v` salvo que quieras eliminar deliberadamente el volumen y los datos almacenados.**

### Consideraciones de red

- El puerto publicado para el backend debe estar disponible en el equipo.
- Si el servidor local ya ocupa el puerto `3000`, debes detenerlo antes de iniciar Docker con ese mismo puerto.
- Dentro de Docker, el backend debe conectarse a MySQL mediante el nombre del servicio, normalmente `mysql`, y el puerto interno `3306`.
- Para una ejecución local, normalmente se utiliza `localhost` como host de MySQL.

## Estructura del proyecto

```text
elara-backend/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── dtos/
│   ├── middleware/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   └── app.js
├── database/
│   ├── ddl/
│   └── dml/
├── tests/
├── docs/
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── compose.yaml
├── package.json
└── README.md
```

> El archivo `.env` se crea localmente y no debe subirse al repositorio.

## Responsabilidades de las carpetas

| Carpeta o archivo | Responsabilidad |
|---|---|
| `src/config/` | Configuración de la aplicación y de los servicios externos. |
| `src/controllers/` | Recepción de solicitudes HTTP y construcción de respuestas. |
| `src/dtos/` | Definición de los objetos utilizados para transferir datos. |
| `src/middleware/` | Procesamiento intermedio de solicitudes, autenticación y manejo de errores. |
| `src/repositories/` | Acceso y persistencia de datos. |
| `src/routes/` | Definición y organización de los endpoints. |
| `src/services/` | Implementación de las reglas de negocio. |
| `src/validators/` | Validación de datos de entrada. |
| `database/` | Archivos relacionados con el esquema de la base de datos. |
| `tests/` | Pruebas ejecutadas con el runner integrado `node:test`. |
| `docs/` | Documentación técnica complementaria. |
| `scripts/` | Scripts auxiliares para tareas de desarrollo y mantenimiento. |

## Archivo `package.json`

El archivo `package.json` contiene los metadatos del proyecto, las dependencias y los scripts disponibles para ejecutar tareas.

Las dependencias principales del proyecto incluyen:

- `express`: creación del servidor y gestión de rutas HTTP.
- `mysql2`: controlador para conectar Node.js con MySQL.
- `dotenv`: lectura de variables de entorno.
- `passport`, `passport-local`, `passport-jwt`: autenticación local y JWT.
- `bcrypt`: hash y verificación de contraseñas.
- `express-validator`: validación de solicitudes.
- `express-rate-limit`: limitación de solicitudes.
- `cookie-parser`: lectura de la cookie del visitante.
- `semver`: validación de la versión solicitada mediante `X-API-Version`.
- `nodemon`: herramienta de desarrollo para reiniciar el servidor cuando cambian los archivos.

Los scripts disponibles son `npm run dev` para desarrollo y `npm test` para las pruebas automatizadas.

## Comprobación del servidor

Con el servidor ejecutándose, prueba en Postman:

```http
GET {{baseUrl}}/health
```

El endpoint público responde `200` con un mensaje de estado. Esta comprobación confirma que Express responde; no valida por sí sola la conexión a MySQL.

## Arquitectura y criterios de diseño

El proyecto seguirá una separación de responsabilidades inspirada en MVC y programación orientada a objetos.

Se utilizarán los siguientes criterios:

- **DTO:** para estructurar los datos transferidos entre capas cuando sea necesario.
- **Repository:** para aislar el acceso a los datos y las consultas a MySQL.
- **Factory Method:** cuando exista una necesidad justificada de centralizar la creación de objetos.
- **Middleware:** para tareas transversales como el manejo de errores y la validación de solicitudes.

Los patrones se aplicarán de acuerdo con la arquitectura definida para ELARA, evitando complejidad innecesaria.

## Documentación de la API con Swagger

ELARA Backend utiliza **Swagger UI** y **swagger-jsdoc**. La especificación OpenAPI está definida en `docs/swagger.js` e incluye las rutas, parámetros, cuerpos de solicitud y esquemas de seguridad.

### Ejecución

Inicia el servidor desde la raíz del proyecto:

```bash
node src/app.js
```

Una vez iniciado, accede a la documentación desde el navegador:

**Swagger UI:** http://localhost:3000/api-docs

Para verificar que el servidor está funcionando correctamente, visita:

**Health check:** http://localhost:3000/health

Swagger UI permite consultar los endpoints documentados, revisar sus parámetros y respuestas, y ejecutar solicitudes mediante la opción **Try it out**, cuando esté disponible.

> **Nota:** Si el servidor utiliza un puerto distinto de `3000`, reemplaza ese valor en las direcciones anteriores.

## Convenciones de desarrollo

- Nombres de archivos y carpetas en inglés.
- Variables, funciones, métodos, clases y comentarios propios en español, salvo convenciones estándar de bibliotecas y frameworks.
- Documentación en español.
- Mensajes de commit en inglés, siguiendo Conventional Commits.
- Separación de responsabilidades y preferencia por componentes reutilizables.
- Credenciales y configuraciones sensibles fuera del código fuente.

## Estado del proyecto

Las rutas activas se describen en esta guía y en Swagger UI. `npm test` ejecuta las pruebas automatizadas con el runner integrado de Node.js.

## Licencia

El proyecto utiliza la licencia definida en `package.json`. Si se mantiene como `UNLICENSED`, se considera un proyecto privado que no concede una licencia pública de uso.
