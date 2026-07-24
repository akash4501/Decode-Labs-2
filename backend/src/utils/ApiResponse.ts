import { Response } from "express";

interface SuccessPayload<T> {
  success: true;
  data: T;
  message: string;
}

interface ErrorPayload {
  success: false;
  message: string;
  errors: string[];
}

export function sendSuccess<T>(
  res: Response,
  statusCode: number,
  data: T,
  message = "Operation successful"
) {
  const payload: SuccessPayload<T> = { success: true, data, message };
  return res.status(statusCode).json(payload);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  errors: string[] = []
) {
  const payload: ErrorPayload = { success: false, message, errors };
  return res.status(statusCode).json(payload);
}
