import express, { Application, Request, Response } from "express";
import cors from "cors";
import { env } from "./config/env";
import taskRoutes from "./routes/task.routes";
import { notFoundHandler } from "./middleware/notFound";
import { errorHandler } from "./middleware/errorHandler";

export function createApp(): Application {
  const app = express();

  // Middleware
  app.use(
    cors({
      origin: env.clientUrl,
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check - useful for quick smoke tests / uptime checks
  app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: { status: "ok", timestamp: new Date().toISOString() },
      message: "Service is healthy",
    });
  });

  // Routes
  app.use("/api/tasks", taskRoutes);

  // 404 + centralized error handling (must be registered last)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
