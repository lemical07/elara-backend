# ELARA Backend

## 1. Descripción del proyecto

ELARA Backend es la API REST de ELARA, una aplicación orientada a la gestión y consulta de un catálogo de películas, series y anime.

El backend se desarrollará con Node.js y Express, utilizando MySQL como sistema de gestión de bases de datos. La arquitectura seguirá una separación de responsabilidades basada en MVC, programación orientada a objetos (POO), DTO, Repository e inyección de dependencias. El patrón Factory Method se incorporará cuando exista un caso de uso que lo justifique.

## 2. Tecnologías previstas

- **Node.js:** entorno de ejecución de JavaScript.
- **Express:** framework para construir la API REST.
- **MySQL:** sistema de gestión de bases de datos relacionales.
- **Docker:** entorno de ejecución contenerizado para el backend y MySQL.
- **Pruebas automatizadas:** validación del comportamiento de los componentes y su integración.

Las dependencias y versiones se definirán durante la configuración inicial del proyecto.

## 3. Estructura del proyecto

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
├── .gitignore
├── Dockerfile
├── compose.yaml
└── README.md
```

## 4. Función de cada carpeta

### `src/`

Contiene el código fuente de la aplicación backend.

#### `src/config/`

Centraliza la configuración de la aplicación, las variables de entorno y los parámetros necesarios para conectarse a MySQL.

#### `src/controllers/`

Contiene los controladores que reciben las solicitudes procesadas por las rutas, coordinan la ejecución de los servicios y construyen las respuestas HTTP.

Los controladores no deben ejecutar directamente consultas SQL ni concentrar las reglas de negocio.

#### `src/dtos/`

Contiene los objetos de transferencia de datos (DTO, Data Transfer Objects).

Define la estructura de los datos que entran y salen de la aplicación, separando los datos expuestos por la API de las representaciones internas del dominio y la base de datos.

Los DTO se organizarán según la entidad y la operación cuando sea conveniente, por ejemplo, creación, consulta o respuesta.

#### `src/factories/`

Contiene las fábricas que implementen el patrón Factory Method cuando sea necesario delegar la creación de objetos según el tipo o las condiciones de una operación.

No se crearán fábricas artificiales para objetos cuya construcción sea sencilla y uniforme.

#### `src/middleware/`

Contiene funciones de middleware de Express que procesan las solicitudes antes o después de llegar a los controladores.

Puede incluir autenticación, autorización, limitación de solicitudes y tratamiento centralizado de errores.

#### `src/models/`

Contiene las clases que representan las entidades o conceptos del dominio de ELARA.

Estas clases podrán encapsular datos y comportamiento propio del dominio. No deben convertirse automáticamente en copias directas de las tablas de MySQL.

#### `src/repositories/`

Contiene las clases responsables del acceso a datos mediante MySQL.

Implementa el patrón Repository para encapsular las consultas SQL y las operaciones de persistencia. Los servicios utilizarán los repositorios sin necesitar conocer los detalles de las consultas.

#### `src/routes/`

Define los endpoints de la API REST y los conecta con los controladores y los middleware correspondientes.

Las rutas no deben ejecutar directamente consultas SQL ni implementar reglas de negocio.

#### `src/services/`

Contiene la lógica de negocio de ELARA.

Los servicios coordinan las operaciones necesarias para cumplir los casos de uso, aplican las reglas correspondientes y utilizan los repositorios mediante inyección de dependencias.

#### `src/utils/`

Contiene funciones auxiliares reutilizables que no pertenecen exclusivamente a una entidad, un controlador o un servicio.

Estas utilidades no deben utilizarse como un lugar genérico para acumular lógica de negocio.

#### `src/validators/`

Contiene las validaciones de los datos recibidos por la API.

Comprueba aspectos como formatos, campos requeridos, tipos de datos y restricciones de entrada. Las reglas de negocio que requieren consultar información o coordinar operaciones corresponden principalmente a los servicios.

#### `src/app.js`

Es el punto de entrada previsto para configurar la aplicación Express.

Se encargará de registrar los middleware generales y las rutas, así como la gestión de errores de la aplicación. La configuración concreta se implementará durante la inicialización del backend.

### `database/`

Contiene los archivos relacionados con la definición de la base de datos.

#### `database/schema.sql`

Define el esquema inicial de MySQL, incluidas las tablas, claves primarias, claves foráneas, restricciones e índices que se acuerden para ELARA.

Inicialmente se utilizará un único archivo de esquema. Una estrategia de migraciones podrá añadirse cuando sea necesario gestionar cambios incrementales en bases de datos existentes.

### `tests/`

Contiene las pruebas automatizadas del backend.

#### `tests/unit/`

Contiene pruebas de unidades individuales, como servicios, validadores y otras clases. Cuando corresponda, las dependencias externas se sustituirán por implementaciones simuladas.

#### `tests/integration/`

Contiene pruebas que verifican la interacción entre componentes, como rutas, servicios, repositorios y la base de datos.

### `docs/`

Contiene la documentación técnica del proyecto, las decisiones de arquitectura, los contratos de la API y otros documentos de apoyo. La documentación se redactará en español.

### `scripts/`

Contiene scripts para tareas automatizadas de desarrollo, mantenimiento o preparación del entorno que no correspondan a la lógica principal de la API.

## 5. Archivos de la raíz

- **`Dockerfile`:** define cómo construir la imagen del backend.
- **`compose.yaml`:** configura los servicios contenerizados del backend y MySQL, junto con sus redes, volúmenes y parámetros necesarios.
- **`.dockerignore`:** excluye del contexto de construcción los archivos que no deben copiarse a la imagen.
- **`.gitignore`:** indica qué archivos y directorios no deben versionarse, como dependencias instaladas, secretos y archivos temporales.
- **`README.md`:** documenta el propósito, la estructura y las convenciones del proyecto.

Los archivos de Docker se configurarán durante una etapa posterior; su presencia en la estructura no significa que la contenerización ya esté implementada.

## 6. Arquitectura y patrones de diseño

### MVC

Organiza la interacción HTTP mediante rutas y controladores, y separa la representación del dominio. Al ser una API REST, las respuestas JSON cumplen la función de representación hacia el cliente; no se requiere una carpeta de vistas HTML en el backend.

### Repository

Encapsula el acceso a MySQL para que las consultas SQL no estén mezcladas con los controladores ni con las reglas de negocio.

### Factory Method

Se utilizará cuando un caso de uso necesite delegar la creación de objetos a una fábrica con variantes de creación justificadas.

### Inyección de dependencias

Las dependencias, como los repositorios requeridos por los servicios, se proporcionarán desde fuera, por ejemplo, mediante constructores. Esto reduce el acoplamiento y facilita las pruebas.

## 7. Convenciones de desarrollo

- Los nombres de carpetas y archivos propios del proyecto estarán en inglés.
- Las variables, los métodos, las clases y los comentarios del código estarán en español.
- La documentación técnica y funcional estará redactada en español.
- Los mensajes de commit seguirán Conventional Commits y estarán en inglés.
- Las rutas HTTP tendrán nombres coherentes y consistentes con los recursos de la API.
- Las consultas SQL se mantendrán en los repositorios, utilizando consultas parametrizadas.
- Los controladores se limitarán a la coordinación HTTP; los servicios contendrán la lógica de negocio.
- Se evitará duplicar responsabilidades entre DTO, modelos, validadores y repositorios.
- No se añadirán capas o patrones únicamente por cumplir una estructura; cada componente debe tener una responsabilidad definida.

## 8. Estado de la estructura

La estructura inicial organiza las responsabilidades del backend, pero no implica que la API, la conexión a MySQL, las pruebas ni Docker estén implementados.

Los componentes se desarrollarán progresivamente, comenzando por la configuración del proyecto y siguiendo con la conexión a la base de datos, los casos de uso y los endpoints de la API.
