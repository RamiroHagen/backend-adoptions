
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import session from "./config/session.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/auth.routes.js";
import adoptionRouter from "./routes/adoption.router.js";
import { setupSwagger } from "./config/swagger.js";

const app = express();

app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Health
 *     summary: Verifica que la API esté funcionando
 *     responses:
 *       200:
 *         description: Servicio activo
 *         content:
 *           application/json:
 *             example:
 *               status: ok
 */
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));

setupSwagger(app);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/adoptions", adoptionRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ status: "error", error: "Error interno del servidor" });
});

export default app;
