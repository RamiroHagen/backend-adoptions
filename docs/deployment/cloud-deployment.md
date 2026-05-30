# Guía breve de despliegue cloud

Este proyecto está preparado para desplegarse como contenedor en proveedores compatibles con Docker, por ejemplo AWS ECS, Azure Container Apps, Google Cloud Run o Render.

## Flujo recomendado

1. Ejecutar tests funcionales en CI.
2. Construir imagen Docker versionada.
3. Escanear vulnerabilidades con Docker Scout o Trivy.
4. Publicar imagen en DockerHub.
5. Desplegar la imagen en el proveedor cloud.
6. Monitorear logs, healthcheck y métricas.

## Variables mínimas

- `PORT=3000`
- `MONGO_URI=<cadena-de-conexion>`
- `JWT_SECRET=<secreto-seguro>`
- `SESSION_SECRET=<secreto-seguro>`
- `NODE_ENV=production`

## Healthcheck

El contenedor expone:

```bash
GET /health
```

Este endpoint permite comprobar si el servicio responde correctamente dentro del entorno cloud.
