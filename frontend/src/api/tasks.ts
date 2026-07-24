import { apiRequest } from "./client";
import { Task, TaskFormValues, TaskStats } from "../types/task";

export interface TaskQueryParams {
  status?: string;
  priority?: string;
  search?: string;
  sortBy?: string;
  order?: "asc" | "desc";
}

function buildQuery(params: TaskQueryParams): string {
  const search = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) search.set(key, value);
  });
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

export const tasksApi = {
  list: (params: TaskQueryParams = {}) =>
    apiRequest<Task[]>(`/tasks${buildQuery(params)}`),

  stats: () => apiRequest<TaskStats>("/tasks/stats"),

  getById: (id: number) => apiRequest<Task>(`/tasks/${id}`),

  create: (values: TaskFormValues) =>
    apiRequest<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(values),
    }),

  update: (id: number, values: Partial<TaskFormValues>) =>
    apiRequest<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(values),
    }),

  remove: (id: number) =>
    apiRequest<null>(`/tasks/${id}`, { method: "DELETE" }),
};
