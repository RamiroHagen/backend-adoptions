# Proyecto Backend profesionalizado: Tests funcionales, Docker, Swagger y CI/CD

Este proyecto backend Node.js/Express fue profesionalizado para cumplir un flujo de trabajo real: pruebas funcionales exhaustivas del router `adoption.router.js`, imagen Docker optimizada y segura, documentación con Swagger/OpenAPI, comandos de publicación en DockerHub y base para integración continua.

---

## URLs de entrega

- Repositorio GitHub con tests y Dockerfile: `https://github.com/RamiroHagen/backend-adoptions`
- Imagen pública DockerHub: `https://hub.docker.com/r/ramihagen99/backend-adoptions`
- Documentación Swagger local: `http://localhost:3000/api/docs`
- Especificación OpenAPI JSON: `http://localhost:3000/api/docs.json`

---

## Tecnologías aplicadas

- Node.js 20
- Express
- MongoDB/Mongoose
- Passport / JWT / Sessions
- Tests funcionales con `node:test`
- Mocks y fakes para aislar dependencias externas
- Docker
- DockerHub
- Swagger/OpenAPI con `swagger-jsdoc` y `swagger-ui-express`
- CI/CD con GitHub Actions

---

## Estructura principal

```txt
.
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── deployment/
│   │   └── cloud-deployment.md
│   └── evidence/
│       └── test-log.txt
├── frontend/
├── src/
│   ├── app.js
│   ├── config/
│   │   ├── db.js
│   │   ├── passport.js
│   │   ├── session.js
│   │   └── swagger.js
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   │   ├── auth.routes.js
│   │   └── adoption.router.js
│   ├── services/
│   │   └── adoption.service.js
│   └── utils/
├── test/
│   └── adoption.router.test.js
├── .dockerignore
├── .env.example
├── Dockerfile
├── package.json
└── server.js
```

---

## Router trabajado

El módulo nuevo no reemplaza `auth.routes.js`. Se agrega como feature independiente:

```js
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/adoptions', adoptionRouter)
```

Esto mantiene una arquitectura modular: autenticación por un lado y adopciones por otro.

---

## Endpoints de adopciones

Base URL:

```txt
/api/v1/adoptions
```

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/v1/adoptions` | Lista todas las solicitudes de adopción |
| GET | `/api/v1/adoptions/:aid` | Busca una solicitud por ID |
| POST | `/api/v1/adoptions` | Crea una solicitud de adopción |
| PUT | `/api/v1/adoptions/:aid/status` | Actualiza el estado de una solicitud |
| DELETE | `/api/v1/adoptions/:aid` | Elimina una solicitud |

Estados permitidos:

```txt
pending, approved, rejected, cancelled
```

---

## Tests funcionales

Los tests están en:

```txt
test/adoption.router.test.js
```

Validan todos los endpoints del router `adoption.router.js`, simulando escenarios reales de uso con un servidor Express de prueba.

### Criterios cubiertos

- Casos positivos.
- Casos negativos.
- Casos de borde.
- Validaciones de body.
- Errores 404.
- Errores internos 500.
- Uso de mocks y fakes.
- Aislamiento del service real y de dependencias externas.

### Casos incluidos

```txt
GET /api/v1/adoptions                       -> éxito
GET /api/v1/adoptions/:aid                   -> éxito
GET /api/v1/adoptions/:aid                   -> 404
POST /api/v1/adoptions                       -> creación exitosa
POST /api/v1/adoptions                       -> campo obligatorio faltante
POST /api/v1/adoptions                       -> status inválido
PUT /api/v1/adoptions/:aid/status            -> actualización exitosa
PUT /api/v1/adoptions/:aid/status            -> status inválido
PUT /api/v1/adoptions/:aid/status            -> 404
DELETE /api/v1/adoptions/:aid                -> eliminación exitosa
DELETE /api/v1/adoptions/:aid                -> 404
GET /api/v1/adoptions                       -> error interno simulado del service fake
```

### Ejecutar tests

```bash
npm ci
npm test
```

### Resultado esperado

```txt
# tests 12
# pass 12
# fail 0
```

La evidencia se encuentra en:

```txt
docs/evidence/test-log.txt
```

---

## Variables de entorno

Crear un archivo `.env` tomando como base `.env.example`:

```bash
cp .env.example .env
```

Ejemplo:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/authDB
JWT_SECRET=change_this_access_secret
JWT_REFRESH_SECRET=change_this_refresh_secret
SESSION_SECRET=change_this_session_secret
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret
GITHUB_CALLBACK=http://localhost:3000/api/v1/auth/github/callback
```

Para producción, no subir secretos reales al repositorio. Usar variables del proveedor cloud o secretos del pipeline.

---

## Ejecución local

Instalar dependencias:

```bash
npm ci
```

Levantar la API:

```bash
npm start
```

Verificar healthcheck:

```bash
curl http://localhost:3000/health
```

Respuesta esperada:

```json
{
  "status": "ok"
}
```

---

## Documentación Swagger/OpenAPI

El proyecto incluye documentación interactiva generada con `swagger-jsdoc` y publicada con `swagger-ui-express`.

Con la API levantada, ingresar a:

```txt
http://localhost:3000/api/docs
```

También se puede consultar la especificación OpenAPI en JSON:

```txt
http://localhost:3000/api/docs.json
```

La documentación incluye:

- Rutas.
- Métodos HTTP.
- Parámetros.
- Body esperado.
- Respuestas.
- Ejemplos de uso.

---

## Docker

### Construir imagen local

```bash
docker build -t proyecto-backend-adoptions:1.0.0 .
```

### Ejecutar contenedor

```bash
docker run --name proyecto-backend-adoptions \
  --env-file .env \
  -p 3000:3000 \
  proyecto-backend-adoptions:1.0.0
```

### Verificar funcionamiento dentro del contenedor

```bash
curl http://localhost:3000/health
```

### Ver logs

```bash
docker logs proyecto-backend-adoptions
```

### Detener y eliminar contenedor

```bash
docker stop proyecto-backend-adoptions
docker rm proyecto-backend-adoptions
```

---

## Buenas prácticas aplicadas en Dockerfile

- Imagen base `node:20-bookworm-slim`.
- `NODE_ENV=production`.
- Instalación reproducible con `npm ci --omit=dev`.
- Limpieza de caché de npm.
- Copia selectiva de archivos necesarios.
- Usuario no root: `node`.
- Puerto explícito: `3000`.
- Healthcheck del contenedor apuntando a `/health`.
- `.dockerignore` para excluir `node_modules`, `.env`, capturas, zip y archivos innecesarios.

---

## Escaneo básico de seguridad

Con Docker Scout:

```bash
docker scout quickview ramihagen99/proyecto-backend-adoptions:1.0.0
docker scout cves ramihagen99/proyecto-backend-adoptions:1.0.0
```

Alternativa con Trivy:

```bash
trivy image ramihagen99/proyecto-backend-adoptions:1.0.0
```

---

## CI/CD con GitHub Actions

Se agregó el workflow:

```txt
.github/workflows/ci.yml
```

El pipeline ejecuta:

1. Checkout del repositorio.
2. Instalación de Node.js 20.
3. `npm ci`.
4. `npm test`.
5. `docker build`.
6. Smoke test del contenedor con `/health`.

Esto permite validar automáticamente tests y construcción Docker en cada push o pull request a `main`.

---

## Despliegue cloud

El proyecto puede desplegarse como contenedor en:

- AWS ECS.
- Azure Container Apps.
- Google Cloud Run.
- Render.
- Railway.

Guía resumida:

```txt
docs/deployment/cloud-deployment.md
```

Flujo recomendado:

1. Subir código a GitHub.
2. Ejecutar CI/CD.
3. Publicar imagen en DockerHub.
4. Configurar variables de entorno en el proveedor cloud.
5. Desplegar usando la imagen Docker.
6. Verificar `/health`, logs y métricas.

---

## Comandos rápidos

```bash
npm ci
npm test
npm run test:coverage
npm start
curl http://localhost:3000/health
docker build -t proyecto-backend-adoptions:1.0.0 .
docker run --env-file .env -p 3000:3000 proyecto-backend-adoptions:1.0.0
docker tag proyecto-backend-adoptions:1.0.0 TU_USUARIO/proyecto-backend-adoptions:1.0.0
docker push TU_USUARIO/proyecto-backend-adoptions:1.0.0
```

---

## Estado del entregable

Cumple con:

- Tests funcionales exhaustivos para `adoption.router.js`.
- Uso de mocks y fakes.
- Casos de éxito, error y validación.
- Imagen Docker optimizada y segura.
- Documentación Swagger/OpenAPI.
- README con instrucciones claras.
- Evidencia de pruebas.
- Preparación para DockerHub.
- Base de CI/CD.
- Guía de despliegue cloud.
