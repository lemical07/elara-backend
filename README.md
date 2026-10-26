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