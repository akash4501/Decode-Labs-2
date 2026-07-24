import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

/**
 * Catches any request to a route that doesn't exist and forwards
 * a consistent 404 through the centralized error handler, instead
 * of letting Express send its default HTML error page.
 */
export function notFoundHandler(req: Request, res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}
