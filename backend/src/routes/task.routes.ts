import { Router } from "express";
import * as taskController from "../controllers/task.controller";

const router = Router();

// GET /api/tasks/stats must be registered before /:id so "stats" is not
// mistaken for a task id.
router.get("/stats", taskController.getDashboardStats);

router.get("/", taskController.listTasks);
router.get("/:id", taskController.getTask);
router.post("/", taskController.createTask);
router.put("/:id", taskController.updateTask);
router.delete("/:id", taskController.deleteTask);

export default router;
