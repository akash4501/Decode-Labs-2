import { readDb, writeDb } from "../utils/db";
import { ApiError } from "../utils/ApiError";
import { Task, TaskPriority, TaskStatus } from "../models/task.model";

export interface TaskFilters {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  sortBy?: "createdAt" | "updatedAt" | "title" | "priority" | "status";
  order?: "asc" | "desc";
}

export interface CreateTaskInput {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
}

const PRIORITY_WEIGHT: Record<TaskPriority, number> = {
  low: 0,
  medium: 1,
  high: 2,
};

/**
 * All business logic for tasks lives here, kept separate from Express
 * (controllers) and raw persistence (utils/db) so each layer has one job.
 */
export function getAllTasks(filters: TaskFilters): Task[] {
  const db = readDb();
  let tasks = [...db.tasks];

  if (filters.status) {
    tasks = tasks.filter((t) => t.status === filters.status);
  }
  if (filters.priority) {
    tasks = tasks.filter((t) => t.priority === filters.priority);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    tasks = tasks.filter((t) => t.title.toLowerCase().includes(q));
  }

  const sortBy = filters.sortBy || "createdAt";
  const order = filters.order || "desc";
  const direction = order === "asc" ? 1 : -1;

  tasks.sort((a, b) => {
    if (sortBy === "priority") {
      return (PRIORITY_WEIGHT[a.priority] - PRIORITY_WEIGHT[b.priority]) * direction;
    }
    if (sortBy === "title" || sortBy === "status") {
      return a[sortBy].localeCompare(b[sortBy]) * direction;
    }
    // createdAt / updatedAt - ISO strings sort correctly lexicographically
    return a[sortBy].localeCompare(b[sortBy]) * direction;
  });

  return tasks;
}

export function getTaskStats() {
  const db = readDb();
  const tasks = db.tasks;
  return {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    highPriority: tasks.filter((t) => t.priority === "high").length,
  };
}

export function getTaskById(id: number): Task {
  const db = readDb();
  const task = db.tasks.find((t) => t.id === id);
  if (!task) {
    throw ApiError.notFound("Task not found");
  }
  return task;
}

export function createTask(input: CreateTaskInput): Task {
  const db = readDb();
  const now = new Date().toISOString();

  const task: Task = {
    id: db.nextId,
    title: input.title,
    description: input.description,
    status: input.status || "pending",
    priority: input.priority || "medium",
    createdAt: now,
    updatedAt: now,
  };

  db.tasks.push(task);
  db.nextId += 1;
  writeDb(db);

  return task;
}

export function updateTask(id: number, input: UpdateTaskInput): Task {
  const db = readDb();
  const index = db.tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw ApiError.notFound("Task not found");
  }

  const existing = db.tasks[index];
  const updated: Task = {
    ...existing,
    ...input,
    updatedAt: new Date().toISOString(),
  };

  db.tasks[index] = updated;
  writeDb(db);

  return updated;
}

export function deleteTask(id: number): void {
  const db = readDb();
  const index = db.tasks.findIndex((t) => t.id === id);
  if (index === -1) {
    throw ApiError.notFound("Task not found");
  }
  db.tasks.splice(index, 1);
  writeDb(db);
}
