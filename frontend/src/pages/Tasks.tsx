import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { TaskFilters } from "../components/TaskFilters";
import { TaskTable } from "../components/TaskTable";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { TaskFormModal } from "../components/TaskFormModal";
import { TaskDetailsModal } from "../components/TaskDetailsModal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useTasks } from "../hooks/useTasks";
import { useToast } from "../context/ToastContext";
import { tasksApi, TaskQueryParams } from "../api/tasks";
import { ApiClientError } from "../api/client";
import { Task, TaskFormValues } from "../types/task";

export function Tasks() {
  const [filters, setFilters] = useState<TaskQueryParams>({
    sortBy: "createdAt",
    order: "desc",
  });
  const { tasks, loading, error, refetch } = useTasks(filters);
  const { showToast } = useToast();

  const [isCreateOpen, setCreateOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isSubmitting, setSubmitting] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  const hasActiveFilters = useMemo(
    () => !!(filters.search || filters.status || filters.priority),
    [filters]
  );

  async function handleCreate(values: TaskFormValues) {
    setSubmitting(true);
    try {
      await tasksApi.create(values);
      showToast("Task created successfully", "success");
      setCreateOpen(false);
      refetch();
    } catch (err) {
      showToast(
        err instanceof ApiClientError ? err.message : "Failed to create task",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(values: TaskFormValues) {
    if (!editingTask) return;
    setSubmitting(true);
    try {
      await tasksApi.update(editingTask.id, values);
      showToast("Task updated successfully", "success");
      setEditingTask(null);
      refetch();
    } catch (err) {
      showToast(
        err instanceof ApiClientError ? err.message : "Failed to update task",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete() {
    if (!deletingTask) return;
    setDeleting(true);
    try {
      await tasksApi.remove(deletingTask.id);
      showToast("Task deleted successfully", "success");
      setDeletingTask(null);
      refetch();
    } catch (err) {
      showToast(
        err instanceof ApiClientError ? err.message : "Failed to delete task",
        "error"
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="flex-1 min-w-0">
      <Header
        title="Tasks"
        subtitle={`${tasks.length} task${tasks.length === 1 ? "" : "s"} ${
          hasActiveFilters ? "matching your filters" : "total"
        }`}
        action={
          <button
            onClick={() => setCreateOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 transition-colors shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Task
          </button>
        }
      />

      <main className="p-4 sm:p-8 space-y-6">
        <TaskFilters filters={filters} onChange={setFilters} />

        {error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : !loading && tasks.length === 0 ? (
          <EmptyState
            title={hasActiveFilters ? "No matching tasks" : "No tasks yet"}
            description={
              hasActiveFilters
                ? "Try adjusting your search or filters."
                : "Create your first task to get started."
            }
            actionLabel={hasActiveFilters ? undefined : "Add Task"}
            onAction={hasActiveFilters ? undefined : () => setCreateOpen(true)}
          />
        ) : (
          <TaskTable
            tasks={tasks}
            loading={loading}
            onView={setViewingTask}
            onEdit={setEditingTask}
            onDelete={setDeletingTask}
          />
        )}
      </main>

      <TaskFormModal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />

      <TaskFormModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        onSubmit={handleUpdate}
        initialTask={editingTask}
        isSubmitting={isSubmitting}
      />

      <TaskDetailsModal
        task={viewingTask}
        onClose={() => setViewingTask(null)}
        onEdit={() => {
          if (viewingTask) {
            setEditingTask(viewingTask);
            setViewingTask(null);
          }
        }}
      />

      <ConfirmDialog
        isOpen={!!deletingTask}
        title="Delete task"
        description={`Are you sure you want to delete "${deletingTask?.title}"? This cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeletingTask(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
