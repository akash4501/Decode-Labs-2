import fs from "fs";
import path from "path";
import { env } from "../config/env";
import { Task } from "../models/task.model";

interface DbShape {
  tasks: Task[];
  nextId: number;
}

const dbPath = path.resolve(env.databaseFile);

/**
 * Minimal persistent JSON storage layer.
 * Chosen as the storage backend so the app has zero native dependencies
 * (no SQLite bindings, no Prisma client generation step) while still
 * persisting data to disk across server restarts, per the project spec's
 * fallback guidance.
 */
function ensureDbFile(): void {
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(dbPath)) {
    const seed: DbShape = { tasks: [], nextId: 1 };
    fs.writeFileSync(dbPath, JSON.stringify(seed, null, 2), "utf-8");
  }
}

export function readDb(): DbShape {
  ensureDbFile();
  const raw = fs.readFileSync(dbPath, "utf-8");
  try {
    return JSON.parse(raw) as DbShape;
  } catch {
    // Corrupted file - fail safe with an empty, valid database rather than crashing.
    const seed: DbShape = { tasks: [], nextId: 1 };
    fs.writeFileSync(dbPath, JSON.stringify(seed, null, 2), "utf-8");
    return seed;
  }
}

export function writeDb(data: DbShape): void {
  ensureDbFile();
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf-8");
}
