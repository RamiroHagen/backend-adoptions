import { Router } from "express";
import { adoptionService as defaultService } from "../services/adoption.service.js";

const allowedStatuses = ["pending", "approved", "rejected", "cancelled"];

const validateCreatePayload = ({ petId, adopterId, status }) => {
  if (!petId || typeof petId !== "string") return "petId es obligatorio y debe ser string";
  if (!adopterId || typeof adopterId !== "string") return "adopterId es obligatorio y debe ser string";
  if (status && !allowedStatuses.includes(status)) return "status inválido";
  return null;
};

const validateStatusPayload = ({ status }) => {
  if (!status || !allowedStatuses.includes(status)) return "status inválido";
  return null;
};


/**
 * @openapi
 * /api/v1/adoptions:
 *   get:
 *     tags:
 *       - Adoptions
 *     summary: Lista todas las solicitudes de adopción
 *     responses:
 *       200:
 *         description: Listado obtenido correctamente
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               payload:
 *                 - id: "1"
 *                   petId: "pet-1"
 *                   adopterId: "user-1"
 *                   status: pending
 *   post:
 *     tags:
 *       - Adoptions
 *     summary: Crea una nueva solicitud de adopción
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - petId
 *               - adopterId
 *             properties:
 *               petId:
 *                 type: string
 *                 example: pet-2
 *               adopterId:
 *                 type: string
 *                 example: user-2
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, cancelled]
 *                 example: pending
 *               notes:
 *                 type: string
 *                 example: Adopción responsable
 *     responses:
 *       201:
 *         description: Solicitud creada correctamente
 *       400:
 *         description: Datos inválidos
 *       500:
 *         description: Error interno del servidor
 * /api/v1/adoptions/{aid}:
 *   get:
 *     tags:
 *       - Adoptions
 *     summary: Obtiene una solicitud de adopción por ID
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Solicitud encontrada
 *       404:
 *         description: Solicitud no encontrada
 *   delete:
 *     tags:
 *       - Adoptions
 *     summary: Elimina una solicitud de adopción por ID
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Solicitud eliminada
 *       404:
 *         description: Solicitud no encontrada
 * /api/v1/adoptions/{aid}/status:
 *   put:
 *     tags:
 *       - Adoptions
 *     summary: Actualiza el estado de una solicitud de adopción
 *     parameters:
 *       - in: path
 *         name: aid
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, approved, rejected, cancelled]
 *                 example: approved
 *     responses:
 *       200:
 *         description: Estado actualizado
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Solicitud no encontrada
 */
export const createAdoptionRouter = ({ service = defaultService } = {}) => {
  const router = Router();

  router.get("/", async (req, res, next) => {
    try {
      const adoptions = await service.getAll();
      res.status(200).json({ status: "success", payload: adoptions });
    } catch (error) {
      next(error);
    }
  });

  router.get("/:aid", async (req, res, next) => {
    try {
      const adoption = await service.getById(req.params.aid);
      if (!adoption) {
        return res.status(404).json({ status: "error", error: "Adopción no encontrada" });
      }
      res.status(200).json({ status: "success", payload: adoption });
    } catch (error) {
      next(error);
    }
  });

  router.post("/", async (req, res, next) => {
    try {
      const validationError = validateCreatePayload(req.body);
      if (validationError) {
        return res.status(400).json({ status: "error", error: validationError });
      }

      const adoption = await service.create(req.body);
      res.status(201).json({ status: "success", payload: adoption });
    } catch (error) {
      next(error);
    }
  });

  router.put("/:aid/status", async (req, res, next) => {
    try {
      const validationError = validateStatusPayload(req.body);
      if (validationError) {
        return res.status(400).json({ status: "error", error: validationError });
      }

      const adoption = await service.updateStatus(req.params.aid, req.body.status);
      if (!adoption) {
        return res.status(404).json({ status: "error", error: "Adopción no encontrada" });
      }

      res.status(200).json({ status: "success", payload: adoption });
    } catch (error) {
      next(error);
    }
  });

  router.delete("/:aid", async (req, res, next) => {
    try {
      const adoption = await service.delete(req.params.aid);
      if (!adoption) {
        return res.status(404).json({ status: "error", error: "Adopción no encontrada" });
      }

      res.status(200).json({ status: "success", payload: adoption });
    } catch (error) {
      next(error);
    }
  });

  return router;
};

export default createAdoptionRouter();
