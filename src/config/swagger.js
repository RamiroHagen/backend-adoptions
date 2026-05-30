import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Proyecto Backend - API de Adopciones",
      version: "1.0.0",
      description:
        "Documentación interactiva de la API. Incluye endpoints de adopciones preparados para pruebas funcionales, Docker y despliegue profesional."
    },
    servers: [
      {
        url: "http://localhost:{port}",
        description: "Entorno local",
        variables: {
          port: {
            default: "3000"
          }
        }
      }
    ],
    tags: [
      {
        name: "Health",
        description: "Verificación básica del servicio"
      },
      {
        name: "Adoptions",
        description: "Gestión de solicitudes de adopción"
      }
    ],
    components: {
      schemas: {
        Adoption: {
          type: "object",
          properties: {
            id: { type: "string", example: "1" },
            petId: { type: "string", example: "pet-123" },
            adopterId: { type: "string", example: "user-456" },
            status: {
              type: "string",
              enum: ["pending", "approved", "rejected", "cancelled"],
              example: "pending"
            },
            notes: { type: "string", example: "Adopción responsable" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" }
          }
        },
        ErrorResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "error" },
            error: { type: "string", example: "Adopción no encontrada" }
          }
        },
        SuccessResponse: {
          type: "object",
          properties: {
            status: { type: "string", example: "success" },
            payload: { type: "object" }
          }
        }
      }
    }
  },
  apis: ["./src/app.js", "./src/routes/*.js"]
};

const swaggerSpec = swaggerJsdoc(options);

export const setupSwagger = (app) => {
  app.get("/api/docs.json", (req, res) => res.status(200).json(swaggerSpec));
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
