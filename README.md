# Proyecto Backend - RockTheCode

API REST con Node.js, Express y MongoDB para gestionar usuarios y eventos con autenticación JWT, subida de imágenes a Cloudinary y relación bidireccional entre usuarios y eventos.

## Tabla de contenidos

- [Descripción](#descripción)
- [Stack tecnológico](#stack-tecnológico)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Instalación y ejecución](#instalación-y-ejecución)
- [Variables de entorno](#variables-de-entorno)
- [Modelos de datos](#modelos-de-datos)
- [Autenticación y autorización](#autenticación-y-autorización)
- [Endpoints](#endpoints)
- [Ejemplos de uso (todas las acciones)](#ejemplos-de-uso-todas-las-acciones)
- [Semillas de datos](#semillas-de-datos)
- [Documentación en Markdown (Dillinger)](#documentación-en-markdown-dillinger)

---

## Descripción

La API permite:

- Registrar usuarios y autenticar login.
- Subir imagen de perfil en Cloudinary.
- Actualizar usuarios.
- Gestionar eventos.
- Relacionar eventos con usuarios y usuarios con eventos.
- Cambiar rol de usuario (solo admin).

Base URL actual: `http://localhost:3003/api/v1`

---

## Stack tecnológico

- Node.js
- Express
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- `bcrypt`
- Cloudinary
- Multer + Multer Storage Cloudinary
- dotenv

---

## Estructura del proyecto

```txt
Proyecto-backend/
├── index.js
├── package.json
├── README.md
└── src/
    ├── api/
    │   ├── controllers/
    │   │   ├── event.js
    │   │   └── user.js
    │   ├── data/
    │   │   └── events.js
    │   ├── models/
    │   │   ├── event.js
    │   │   └── user.js
    │   └── routes/
    │       ├── event.js
    │       └── user.js
    ├── config/
    │   ├── cloudinary.js
    │   └── db.js
    ├── middlewares/
    │   ├── auth.js
    │   └── file.js
    └── utils/
        ├── jwt.js
        └── seeds/
            ├── events.js
            └── users
```

---

## Instalación y ejecución

1. Instala dependencias:

```bash
npm install
```

2. Crea/configura el archivo `.env`.

3. Ejecuta en desarrollo:

```bash
npm run dev
```

4. Ejecuta en producción:

```bash
npm start
```

---

## Variables de entorno

Variables usadas por el código actual:

| Variable | Descripción |
| --- | --- |
| `DB_URL` | URI de conexión a MongoDB |
| `JWT_SECRET` | Secreto para firmar/verificar tokens |
| `CLOUD_NAME` | Cloud name de Cloudinary |
| `API_KEY` | API key de Cloudinary |
| `API_SECRET` | API secret de Cloudinary |

Ejemplo:

```env
PORT=3003
DB_URL=mongodb+srv://...
JWT_SECRET=tu_clave
CLOUD_NAME=tu_cloud
API_KEY=tu_api_key
API_SECRET=tu_api_secret
```

---

## Modelos de datos

### User

- `userName`: String (required)
- `email`: String (required)
- `password`: String (required, encriptada)
- `role`: String (`user` | `admin`, default `user`)
- `image`: String (required)
- `events`: `[ObjectId]` referenciando `event`

### Event

- `title`: String (required)
- `description`: String (required)
- `date`: Date (required)
- `location`: String (required)
- `users`: `[ObjectId]` referenciando `users`

Relación actual: bidireccional (`User.events` <-> `Event.users`).

---

## Autenticación y autorización

- La autenticación se envía con header:

```txt
Authorization: Bearer <token>
```

- Rutas protegidas usan middleware `isAuth`.
- Cambio de rol usa además `isAdmin`.

---

## Endpoints

### Usuarios

| Método | Ruta | Auth | Permisos |
| --- | --- | --- | --- |
| POST | `/users/register` | No | Público |
| POST | `/users/login` | No | Público |
| GET | `/users` | Sí | Usuario autenticado |
| GET | `/users/:id` | Sí | Usuario autenticado |
| PUT | `/users/:id` | Sí | Propio usuario o admin |
| PUT | `/users/:id/role` | Sí | Solo admin |
| DELETE | `/users/:id` | Sí | Propio usuario o admin |
| PUT | `/users/:id/events` | Sí | Propio usuario o admin |

### Eventos

| Método | Ruta | Auth | Permisos |
| --- | --- | --- | --- |
| GET | `/events` | No | Público |
| GET | `/events/:id` | No | Público |
| POST | `/events` | Sí | Usuario autenticado |
| PUT | `/events/:id` | Sí | Usuario autenticado |
| DELETE | `/events/:id` | Sí | Usuario autenticado |

## Ejemplos de uso (todas las acciones)

> Todos los ejemplos usan la base: `http://localhost:3003/api/v1`

### 1) Registrar usuario

```http
POST /api/v1/users/register
Content-Type: multipart/form-data

Body (form-data):
- userName: "Cristian"
- email: "cristian@email.com"
- password: "123456"
- image: [archivo]
```

### 2) Login

```http
POST /api/v1/users/login
Content-Type: application/json

{
  "email": "cristian@email.com",
  "password": "123456"
}
```

### 3) Obtener todos los usuarios

```http
GET /api/v1/users
Authorization: Bearer <TOKEN>
```

### 4) Obtener usuario por ID

```http
GET /api/v1/users/USER_ID
Authorization: Bearer <TOKEN>
```

### 5) Actualizar usuario

```http
PUT /api/v1/users/USER_ID
Authorization: Bearer <TOKEN>
Content-Type: multipart/form-data

Body (form-data):
- userName: "NuevoNombre"
- email: "nuevo@email.com"
- image: [archivo opcional]
```

### 6) Cambiar rol de usuario (solo admin)

```http
PUT /api/v1/users/USER_ID/role
Authorization: Bearer <TOKEN_ADMIN>
Content-Type: application/json

{
  "role": "admin"
}
```

### 7) Eliminar usuario

```http
DELETE /api/v1/users/USER_ID
Authorization: Bearer <TOKEN>
```

### 8) Añadir eventos a usuario

```http
PUT /api/v1/users/USER_ID/events
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "events": ["EVENT_ID_1", "EVENT_ID_2"]
}
```

### 9) Obtener todos los eventos

```http
GET /api/v1/events
```

### 10) Obtener evento por ID

```http
GET /api/v1/events/EVENT_ID
```

### 11) Crear evento

```http
POST /api/v1/events
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Hackathon Fullstack",
  "description": "48h de desarrollo en equipo",
  "date": "2026-04-10T09:00:00.000Z",
  "location": "Barcelona"
}
```

### 12) Actualizar evento

```http
PUT /api/v1/events/EVENT_ID
Authorization: Bearer <TOKEN>
Content-Type: application/json

{
  "title": "Hackathon Fullstack v2",
  "description": "Nueva edición",
  "date": "2026-04-11T09:00:00.000Z",
  "location": "Madrid"
}
```

### 13) Eliminar evento

```http
DELETE /api/v1/events/EVENT_ID
Authorization: Bearer <TOKEN>
```

### Flujo recomendado de prueba

1. Registrar usuario.
2. Hacer login y guardar `token`.
3. Crear evento con ese token.
4. Consultar eventos (`GET /events`).
5. Añadir ese evento al usuario (`PUT /users/:id/events`).
6. Consultar usuario por ID para verificar la relación.

---

## Semillas de datos

Script disponible actualmente:

```bash
npm run eventsSeed
```

Este script carga eventos de ejemplo desde `src/api/data/events.js`.

---


