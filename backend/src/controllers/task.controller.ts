import { TaskPriority, TaskStatus } from "../models/task.model";
import { Request, Response, NextFunction } from "express";
import { sendSuccess } from "../utils/ApiResponse";
import { ApiError } from "../utils/ApiError";
import {
  createTaskSchema,
  updateTaskSchema,
  taskQuerySchema,
} from "../validators/task.validator";
import * as taskService from "../services/task.service";

function parseId(rawId: string): number {
  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw ApiError.badRequest("Invalid task id", ["id must be a positive integer"]);
  }
  return id;
}

export function listTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = taskQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message);
      throw ApiError.badRequest("Invalid query parameters", errors);
    }

    const tasks = taskService.getAllTasks({
  ...parsed.data,
  status: parsed.data.status as TaskStatus | undefined,
  priority: parsed.data.priority as TaskPriority | undefined,
});
    sendSuccess(res, 200, tasks, "Tasks fetched successfully");
  } catch (err) {
    next(err);
  }
}

export function getDashboardStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = taskService.getTaskStats();
    sendSuccess(res, 200, stats, "Stats fetched successfully");
  } catch (err) {
    next(err);
  }
}

export function getTask(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id);
    const task = taskService.getTaskById(id);
    sendSuccess(res, 200, task, "Task fetched successfully");
  } catch (err) {
    next(err);
  }
}

export function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = createTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message);
      throw ApiError.badRequest("Validation failed", errors);
    }

    const task = taskService.createTask({
  ...parsed.data,
  status: parsed.data.status as TaskStatus | undefined,
  priority: parsed.data.priority as TaskPriority | undefined,
});
    sendSuccess(res, 201, task, "Task created successfully");
  } catch (err) {
    next(err);
  }
}

export function updateTask(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id);
    const parsed = updateTaskSchema.safeParse(req.body);
    if (!parsed.success) {
      const errors = parsed.error.errors.map((e) => e.message);
      throw ApiError.badRequest("Validation failed", errors);
    }

    const task = taskService.updateTask(id, {
  ...parsed.data,
  status: parsed.data.status as TaskStatus | undefined,
  priority: parsed.data.priority as TaskPriority | undefined,
});
    sendSuccess(res, 200, task, "Task updated successfully");
  } catch (err) {
    next(err);
  }
}

export function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const id = parseId(req.params.id);
    taskService.deleteTask(id);
    sendSuccess(res, 200, null, "Task deleted successfully");
  } catch (err) {
    next(err);
  }
}
