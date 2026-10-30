# ELARA Backend

API REST para un catálogo de películas, series y anime.

## Descripción

ELARA Backend es el componente encargado de gestionar la lógica del servidor, procesar solicitudes HTTP y proporcionar los datos necesarios para la aplicación ELARA.

El proyecto se desarrolla con Node.js y Express, utilizando MySQL como sistema de gestión de bases de datos. También cuenta con una configuración de Docker para ejecutar el backend y la base de datos en contenedores independientes.

Actualmente, el proyecto dispone de una estructura inicial, configuración de dependencias, variables de entorno, un servidor Express funcional y configuración para Docker. Las funcionalidades del catálogo y la integración con MySQL se implementarán progresivamente.

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

## Autenticación

La API utiliza JWT. Configura `JWT_SECRET` en `.env` con un valor secreto propio y `JWT_EXPIRES_IN` con una duración como `1h`. La base de datos debe estar creada con `database/ddl/schema.sql` y los roles inicializados con `database/dml/insert.sql`.

Con el servidor ejecutándose en `http://localhost:3000`, prueba estos endpoints en Postman:

### Registrar usuario

`POST /api/auth/register` — Body, tipo **raw / JSON**:

```json
{
  "nombre": "Ana",
  "apellido": "Pérez",
  "correo": "ana@example.com",
  "contrasena": "ClaveSegura123"
}
```

El endpoint crea una cuenta con rol `Usuario`, cifra la contraseña y responde con el usuario y un token. No envíes `rol_id`: el cliente no puede asignarse permisos de administrador.

### Iniciar sesión

`POST /api/auth/login` — Body, tipo **raw / JSON**:

```json
{
  "correo": "ana@example.com",
  "contrasena": "ClaveSegura123"
}
```

### Verificar el token y obtener el usuario actual

`GET /api/auth/me` — En Postman, en **Authorization**, selecciona **Bearer Token** y pega el `token` que devolvió el registro o el inicio de sesión.

El registro responde `201`, el inicio de sesión `200`; credenciales incorrectas responden `401` y un correo ya registrado responde `409`.

### Rutas del catálogo y autorización

- `GET /api/categorias` y `GET /api/contenidos/:id` son rutas de consulta.
- `POST /api/categorias`, `PUT /api/categorias/:id` y `DELETE /api/categorias/:id` requieren un Bearer Token de un usuario cuyo rol actual en MySQL sea `admin` o `Administrador`.

## Perfil y administración de usuarios

Las rutas de perfil requieren `Authorization: Bearer <token>` obtenido al iniciar sesión. La identidad siempre se toma del JWT validado.

### Perfil propio

- `GET /api/usuarios/me`: consulta el perfil público.
- `PUT /api/usuarios/me`: actualiza uno o más de `nombre`, `apellido` y `correo`.
- `PATCH /api/usuarios/me/contrasena`: cambia la contraseña enviando:

```json
{
  "contrasena_actual": "ClaveActual123",
  "contrasena_nueva": "ClaveNueva456"
}
```

- `DELETE /api/usuarios/me`: desactiva la cuenta. La cuenta y sus reseñas/reacciones se conservan; una cuenta inactiva ya no puede usar rutas protegidas.

Los endpoints de perfil no aceptan cambios de `id`, `rol_id`, `activo` ni `contrasena`. Si el correo ya está registrado, la API responde `409`.

### Administración de usuarios

Estas rutas requieren un token válido y el rol actual `Admin` o `Administrador` en MySQL:

- `GET /api/usuarios`: lista los perfiles públicos.
- `GET /api/usuarios/:id`: consulta un perfil.
- `PATCH /api/usuarios/:id`: actualiza `nombre`, `apellido` y/o `correo`; no permite modificar roles.
- `PATCH /api/usuarios/:id/estado`: cambia el estado con `{"activo": true}` o `{"activo": false}`. La API impide desactivar la última cuenta administradora activa.

Las respuestas no incluyen contraseñas ni hashes. Las cuentas se desactivan lógicamente porque el esquema vincula usuarios con contenidos, reseñas y reacciones.

### Casos rápidos en Postman

1. Sin token, `GET /api/usuarios/me` debe responder `401`.
2. Con token de usuario, `GET /api/usuarios/me` responde `200` sin `contrasena` ni `rol_id`.
3. `PUT /api/usuarios/me` con `{"nombre":"Nuevo nombre"}` responde `200`; con `{"rol_id":1}` responde `400`.
4. Actualizar a un correo usado por otra cuenta responde `409`.
5. Cambiar contraseña con la actual correcta responde `200`; con una incorrecta responde `401`.
6. Un usuario normal recibe `403` en `GET /api/usuarios`; un administrador puede listar usuarios sin hashes.
7. `DELETE /api/usuarios/me` responde `200`; reutilizar el token después debe responder `401`.
8. Desactivar la última cuenta `Admin` activa responde `409`.

## Configuración de variables de entorno

El proyecto utiliza variables de entorno para separar la configuración del código fuente.

Ejemplo para ejecutar ELARA directamente en Windows con una instalación local de MySQL:

```dotenv
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=elara
DB_USER=tu_usuario_mysql
DB_PASSWORD=tu_contraseña_mysql
```

Los valores deben corresponder a la instalación de MySQL que se utilizará. La base de datos `elara` debe existir antes de que la aplicación pueda conectarse a ella.

Para Docker, `DB_HOST` debe corresponder al nombre del servicio MySQL definido en `compose.yaml`, normalmente `mysql`. Además, el archivo `.env` debe incluir las variables requeridas para inicializar el contenedor, como las contraseñas de MySQL y el puerto externo.

**Importante:** copiar `.env.example` crea el archivo `.env`, pero no configura automáticamente las credenciales reales ni crea la base de datos para una instalación local.

## Ejecución local

### 1. Configurar MySQL

Asegúrate de que MySQL esté ejecutándose y de que la base de datos exista.

Configura en `.env` el host, el puerto, el nombre de la base de datos y las credenciales correspondientes.

### 2. Iniciar el servidor

Desde la raíz del proyecto, ejecuta:

```bash
npm run dev
```

Este comando requiere que el script `dev` esté definido en `package.json`.

Si todavía no está configurado, puedes iniciar directamente el servidor con:

```bash
node src/app.js
```

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

Comprueba que el backend esté ejecutándose y que MySQL alcance el estado `healthy`.

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
│   ├── factories/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── validators/
│   └── app.js
├── database/
│   └── schema.sql
├── tests/
│   ├── integration/
│   └── unit/
├── docs/
├── scripts/
├── .dockerignore
├── .env.example
├── .gitignore
├── Dockerfile
├── compose.yaml
├── package.json
└── README.md
```

> La estructura representa la organización prevista del proyecto. La existencia de una carpeta no implica que sus funcionalidades estén implementadas. El archivo `.env` se crea localmente y no debe subirse al repositorio.

## Responsabilidades de las carpetas

| Carpeta o archivo | Responsabilidad |
|---|---|
| `src/config/` | Configuración de la aplicación y de los servicios externos. |
| `src/controllers/` | Recepción de solicitudes HTTP y construcción de respuestas. |
| `src/dtos/` | Definición de los objetos utilizados para transferir datos. |
| `src/factories/` | Creación de objetos cuando sea necesario centralizar su construcción. |
| `src/middleware/` | Procesamiento intermedio de solicitudes, autenticación y manejo de errores. |
| `src/models/` | Representación de las entidades del dominio. |
| `src/repositories/` | Acceso y persistencia de datos. |
| `src/routes/` | Definición y organización de los endpoints. |
| `src/services/` | Implementación de las reglas de negocio. |
| `src/utils/` | Funciones auxiliares reutilizables. |
| `src/validators/` | Validación de datos de entrada. |
| `database/` | Archivos relacionados con el esquema de la base de datos. |
| `tests/unit/` | Pruebas de unidades individuales. |
| `tests/integration/` | Pruebas de interacción entre componentes. |
| `docs/` | Documentación técnica complementaria. |
| `scripts/` | Scripts auxiliares para tareas de desarrollo y mantenimiento. |

## Archivo `package.json`

El archivo `package.json` contiene los metadatos del proyecto, las dependencias y los scripts disponibles para ejecutar tareas.

Las dependencias del proyecto incluyen:

- `express`: creación del servidor y gestión de rutas HTTP.
- `mysql2`: controlador para conectar Node.js con MySQL.
- `dotenv`: lectura de variables de entorno.
- `nodemon`: herramienta de desarrollo para reiniciar el servidor cuando cambian los archivos.

Los comandos disponibles dependen de los scripts definidos en `package.json`.

## Endpoints disponibles

### Comprobación del servidor

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/health` | Comprueba que el servidor Express está respondiendo. |

**Solicitud en Postman:**

```http
GET http://localhost:3000/health
```

**Respuesta esperada:**

```json
{
  "estado": "Prueba Aprovado",
  "mensaje": "ELARA Backend en funcionamiento"
}
```

El endpoint devuelve `200 OK` cuando el servidor está activo. Esta comprobación no valida por sí sola la conexión con MySQL ni la disponibilidad de las tablas.

Las rutas del catálogo se documentarán a medida que sean implementadas.

## Pruebas realizadas

Se realizaron pruebas manuales de arranque y respuesta HTTP utilizando Postman.

- **Ejecución local:** el servidor Express inició y respondió a la petición de comprobación.
- **Ejecución con Docker:** se comprobó el funcionamiento del backend y el estado saludable del contenedor de MySQL después de corregir la configuración de las variables de entorno.
- **Respuesta HTTP:** el endpoint `GET /health` respondió correctamente en ambos entornos.

Estas pruebas verifican el arranque del servidor y su disponibilidad HTTP. No representan todavía pruebas de integración con la base de datos ni pruebas automatizadas de la lógica de negocio.

## Arquitectura y criterios de diseño

El proyecto seguirá una separación de responsabilidades inspirada en MVC y programación orientada a objetos.

Se utilizarán los siguientes criterios:

- **DTO:** para estructurar los datos transferidos entre capas cuando sea necesario.
- **Repository:** para aislar el acceso a los datos y las consultas a MySQL.
- **Factory Method:** cuando exista una necesidad justificada de centralizar la creación de objetos.
- **Middleware:** para tareas transversales como el manejo de errores y la validación de solicitudes.

Los patrones se aplicarán de acuerdo con la arquitectura definida para ELARA, evitando complejidad innecesaria.

## Documentación de la API con Swagger

ELARA Backend utiliza **Swagger UI** y **swagger-jsdoc** para generar y visualizar la documentación de la API REST. La configuración se encuentra en `src/docs/swagger.js`, mientras que los endpoints se documentan mediante comentarios JSDoc en los archivos JavaScript correspondientes.

### Ejecución

Inicia el servidor en modo desarrollo:

```bash
npm run dev
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

La base inicial de ELARA Backend está preparada para continuar el desarrollo.

**Implementado:**

- Configuración inicial de Node.js y Express.
- Dependencias del proyecto.
- Variables de entorno de referencia.
- Endpoint de comprobación `/health`.
- Middleware para rutas inexistentes y manejo centralizado de errores.
- Configuración de Docker para el backend y MySQL.
- Pruebas manuales iniciales de arranque en local y Docker.

**Pendiente de implementación:**

- Conexión funcional entre la aplicación y MySQL.
- Creación y validación del esquema de base de datos.
- Entidades y repositorios del catálogo.
- Servicios, DTOs, controladores y rutas funcionales para películas, series y anime.
- Validaciones de entrada y reglas de negocio.
- Pruebas unitarias y de integración automatizadas.
- Documentación detallada de los endpoints.

## Licencia

El proyecto utiliza la licencia definida en `package.json`. Si se mantiene como `UNLICENSED`, se considera un proyecto privado que no concede una licencia pública de uso.

## Endpoints del catálogo

- `GET /api/categorias`: lista las categorías.
- `POST /api/categorias`: crea una categoría; requiere token de administrador.
- `PUT /api/categorias/:id`: actualiza una categoría; requiere token de administrador.
- `DELETE /api/categorias/:id`: elimina una categoría sin contenidos asociados; requiere token de administrador.
- `GET /api/contenidos`: lista los contenidos aprobados.
- `GET /api/contenidos/:id`: consulta el detalle de un contenido aprobado.