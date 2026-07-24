import { z } from "zod";
import { TASK_STATUSES, TASK_PRIORITIES } from "../models/task.model";

/**
 * Zod schemas for task creation and updates.
 * Creation requires title + description; status/priority are optional
 * and default to "pending" / "medium" per the spec's recommended values.
 * Update allows any subset of fields, but whichever are provided must
 * still pass the same rules.
 */
export const createTaskSchema = z.object({
  title: z
    .string({ required_error: "title is required" })
    .trim()
    .min(1, "title cannot be empty"),
  description: z
    .string({ required_error: "description is required" })
    .trim()
    .min(1, "description cannot be empty"),
  status: z.enum(TASK_STATUSES as [string, ...string[]], {
    errorMap: () => ({
      message: `status must be one of: ${TASK_STATUSES.join(", ")}`,
    }),
  }).optional(),
  priority: z.enum(TASK_PRIORITIES as [string, ...string[]], {
    errorMap: () => ({
      message: `priority must be one of: ${TASK_PRIORITIES.join(", ")}`,
    }),
  }).optional(),
});

export const updateTaskSchema = z
  .object({
    title: z.string().trim().min(1, "title cannot be empty").optional(),
    description: z
      .string()
      .trim()
      .min(1, "description cannot be empty")
      .optional(),
    status: z
      .enum(TASK_STATUSES as [string, ...string[]], {
        errorMap: () => ({
          message: `status must be one of: ${TASK_STATUSES.join(", ")}`,
        }),
      })
      .optional(),
    priority: z
      .enum(TASK_PRIORITIES as [string, ...string[]], {
        errorMap: () => ({
          message: `priority must be one of: ${TASK_PRIORITIES.join(", ")}`,
        }),
      })
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update a task",
  });

export const taskQuerySchema = z.object({
  status: z.enum(TASK_STATUSES as [string, ...string[]]).optional(),
  priority: z.enum(TASK_PRIORITIES as [string, ...string[]]).optional(),
  search: z.string().trim().optional(),
  sortBy: z.enum(["createdAt", "updatedAt", "title", "priority", "status"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
});
