import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";
import { sendError } from "../utils/ApiResponse";
import { env } from "../config/env";

/**
 * Centralized error handling middleware. Every controller forwards
 * errors here via next(err) instead of handling them inline, so the
 * response shape and logging stay consistent across the whole API.
 * Raw database/internal errors are never sent to the client - only a
 * safe, generic message is, while the full error is logged server-side.
 */
export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) {
  if (err instanceof ApiError) {
    if (env.nodeEnv !== "test") {
      console.error(`[${req.method} ${req.originalUrl}] ${err.statusCode}: ${err.message}`);
    }
    return sendError(res, err.statusCode, err.message, err.errors);
  }

  // Unknown/unexpected error - log full details server-side, but only
  // ever expose a generic message to the client.
  console.error(`[${req.method} ${req.originalUrl}] Unexpected error:`, err);
  return sendError(res, 500, "Something went wrong. Please try again later.");
}
