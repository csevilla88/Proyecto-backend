# 🚀 Proyecto Backend - RockTheCode

API REST construida con **Express.js** y **MongoDB Atlas** para la gestión de usuarios y eventos.

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Modelos](#modelos)
- [Endpoints de la API](#endpoints-de-la-api)
- [Seed de Datos](#seed-de-datos)
- [Roles y Permisos](#roles-y-permisos)
- [Cloudinary](#cloudinary)

---

## 📝 Descripción

Este proyecto consiste en una API REST que permite gestionar **usuarios** y **eventos**. Los usuarios pueden registrarse, iniciar sesión, subir una imagen de perfil (almacenada en Cloudinary) y apuntarse a eventos. El sistema implementa un control de roles (`user` y `admin`) con diferentes niveles de permisos.

### Características principales:

- Autenticación mediante **JWT** (JSON Web Tokens)
- Subida de imágenes con **Cloudinary** y **Multer**
- Control de roles (`user` / `admin`)
- Datos relacionados entre colecciones (Users ↔ Events)
- Prevención de datos duplicados en el array de eventos del usuario
- Seed de datos para la colección de eventos
- Eliminación automática de imágenes en Cloudinary al eliminar usuario

---

## 🛠 Tecnologías

| Tecnología | Uso |
| --- | --- |
| **Node.js** | Entorno de ejecución |
| **Express.js** | Framework del servidor |
| **MongoDB Atlas** | Base de datos en la nube |
| **Mongoose** | ODM para MongoDB |
| **JWT** | Autenticación de usuarios |
| **Bcrypt** | Encriptación de contraseñas |
| **Cloudinary** | Almacenamiento de imágenes |
| **Multer** | Middleware de subida de archivos |
| **CORS** | Manejo de peticiones cross-origin |
| **dotenv** | Variables de entorno |

---

## 📂 Estructura del Proyecto

```
proyecto-backend/
├── index.js                          # Punto de entrada del servidor
├── package.json
├── .env                              # Variables de entorno
├── .gitignore
├── README.md
└── src/
    ├── config/
    │   ├── db.js                     # Conexión a MongoDB
    │   ├── cloudinary.js             # Configuración de Cloudinary y Multer
    │   └── jwt.js                    # Generación de tokens JWT
    ├── middlewares/
    │   └── auth.js                   # Middlewares de autenticación y autorización
    ├── api/
    │   ├── models/
    │   │   ├── User.js               # Modelo de Usuario
    │   │   └── Event.js              # Modelo de Evento
    │   ├── controllers/
    │   │   ├── users.controller.js   # Controladores de usuarios
    │   │   └── events.controller.js  # Controladores de eventos
    │   └── routes/
    │       ├── users.routes.js       # Rutas de usuarios
    │       └── events.routes.js      # Rutas de eventos
    └── seeds/
        └── events.seed.js            # Seed de eventos
```

---

## ⚙️ Instalación

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd proyecto-backend
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Edita el archivo `.env` con tus datos reales (ver sección [Variables de Entorno](#variables-de-entorno)).

### 4. Ejecutar el seed de datos

```bash
npm run seed
```

### 5. Iniciar el servidor

```bash
# Modo desarrollo (con hot-reload)
npm run dev

# Modo producción
npm start
```

El servidor se ejecutará en `http://localhost:3000`

---

## 🔐 Variables de Entorno

El archivo `.env` contiene las siguientes variables:

| Variable | Descripción |
| --- | --- |
| `PORT` | Puerto del servidor (default: 3000) |
| `DB_URL` | URL de conexión a MongoDB Atlas |
| `JWT_SECRET` | Clave secreta para firmar tokens JWT |
| `CLOUDINARY_CLOUD_NAME` | Nombre del cloud en Cloudinary |
| `CLOUDINARY_API_KEY` | API Key de Cloudinary |
| `CLOUDINARY_API_SECRET` | API Secret de Cloudinary |

> ⚠️ **Nota:** Normalmente el `.env` no se sube a GitHub, pero para facilitar la corrección de este proyecto escolar, se incluye en el repositorio.

---

## 📊 Modelos

### User

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `userName` | String | Nombre de usuario (mínimo 3 caracteres) |
| `email` | String | Email único del usuario |
| `password` | String | Contraseña encriptada (mínimo 6 caracteres) |
| `role` | String | Rol del usuario: `user` o `admin` (default: `user`) |
| `image` | String | URL de la imagen en Cloudinary |
| `events` | [ObjectId] | Array de referencias a eventos (sin duplicados) |
| `createdAt` | Date | Fecha de creación (automático) |
| `updatedAt` | Date | Fecha de actualización (automático) |

### Event

| Campo | Tipo | Descripción |
| --- | --- | --- |
| `title` | String | Título del evento |
| `description` | String | Descripción del evento |
| `date` | Date | Fecha del evento |
| `location` | String | Ubicación del evento |
| `category` | String | Categoría: música, deportes, tecnología, arte, gastronomía, educación, networking, otro |
| `maxAttendees` | Number | Número máximo de asistentes (default: 100) |
| `createdAt` | Date | Fecha de creación (automático) |
| `updatedAt` | Date | Fecha de actualización (automático) |

---

## 🌐 Endpoints de la API

### Base URL: `http://localhost:3000/api/v1`

### 👤 Usuarios (`/users`)

| Método | Ruta | Descripción | Auth | Rol |
| --- | --- | --- | --- | --- |
| `POST` | `/users/register` | Registrar usuario (con imagen) | ❌ | - |
| `POST` | `/users/login` | Iniciar sesión | ❌ | - |
| `GET` | `/users/` | Obtener todos los usuarios | ✅ | admin |
| `GET` | `/users/:id` | Obtener usuario por ID | ✅ | cualquiera |
| `PUT` | `/users/:id` | Actualizar perfil (con imagen) | ✅ | propio o admin |
| `PUT` | `/users/:id/role` | Cambiar rol de usuario | ✅ | admin |
| `DELETE` | `/users/:id` | Eliminar usuario | ✅ | propio o admin |
| `PUT` | `/users/:id/events` | Añadir eventos al usuario | ✅ | propio o admin |
| `DELETE` | `/users/:id/events/:eventId` | Eliminar evento del usuario | ✅ | propio o admin |

### 📅 Eventos (`/events`)

| Método | Ruta | Descripción | Auth | Rol |
| --- | --- | --- | --- | --- |
| `GET` | `/events/` | Obtener todos los eventos | ❌ | - |
| `GET` | `/events/:id` | Obtener evento por ID | ❌ | - |
| `POST` | `/events/` | Crear evento | ✅ | admin |
| `PUT` | `/events/:id` | Actualizar evento | ✅ | admin |
| `DELETE` | `/events/:id` | Eliminar evento | ✅ | admin |

---

### Ejemplos de uso

#### Registrar usuario

```
POST /api/v1/users/register
Content-Type: multipart/form-data

Body (form-data):
  - userName: "Juan"
  - email: "juan@email.com"
  - password: "123456"
  - image: [archivo de imagen]
```

#### Login

```
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "juan@email.com",
  "password": "123456"
}
```

#### Añadir eventos a un usuario (sin duplicados)

```
PUT /api/v1/users/:id/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "events": ["eventId1", "eventId2"]
}
```

#### Cambiar rol de un usuario (solo admin)

```
PUT /api/v1/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin"
}
```

---

## 🌱 Seed de Datos

El proyecto incluye un seed para poblar la colección de **eventos** con datos de ejemplo.

```bash
npm run seed
```

Este comando:
1. Se conecta a la base de datos
2. Elimina todos los eventos existentes
3. Inserta 10 eventos de ejemplo con diferentes categorías y ubicaciones
4. Se desconecta de la base de datos

---

## 🔒 Roles y Permisos

### Rol `user`

- ✅ Registrarse y hacer login
- ✅ Ver su perfil y el de otros usuarios
- ✅ Actualizar su propio perfil
- ✅ Eliminar su propia cuenta
- ✅ Añadir/eliminar eventos de su propio perfil
- ✅ Ver todos los eventos
- ❌ **NO** puede cambiar roles
- ❌ **NO** puede eliminar cuentas de otros usuarios
- ❌ **NO** puede crear, editar o eliminar eventos

### Rol `admin`

- ✅ Todo lo que puede hacer un `user`
- ✅ Ver listado de todos los usuarios
- ✅ Cambiar el rol de cualquier usuario
- ✅ Eliminar cualquier cuenta de usuario
- ✅ Crear, editar y eliminar eventos

> **Importante:** El primer administrador se crea manualmente modificando el campo `role` a `"admin"` directamente desde MongoDB Atlas. A partir de ahí, los admins pueden cambiar el rol de otros usuarios.

---

## ☁️ Cloudinary

Las imágenes de perfil de los usuarios se almacenan en **Cloudinary**:

- Se suben mediante `multer` y `multer-storage-cloudinary`
- Se guardan en la carpeta `proyecto-backend-users`
- Formatos permitidos: `jpg`, `jpeg`, `png`, `gif`, `webp`
- Al eliminar un usuario, su imagen se elimina automáticamente de Cloudinary
- Al actualizar la imagen de un usuario, la imagen anterior se elimina de Cloudinary

---

## 👨‍💻 Autor

**Cristian Sevilla** - Proyecto Backend para [RockTheCode](https://rockthecode.es/)
