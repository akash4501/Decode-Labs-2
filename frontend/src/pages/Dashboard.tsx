import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "../components/Header";
import { StatCard } from "../components/StatCard";
import { StatCardSkeleton } from "../components/LoadingSkeleton";
import { StatusBadge } from "../components/StatusBadge";
import { PriorityBadge } from "../components/PriorityBadge";
import { EmptyState } from "../components/EmptyState";
import { ErrorState } from "../components/ErrorState";
import { TaskFormModal } from "../components/TaskFormModal";
import { tasksApi } from "../api/tasks";
import { ApiClientError } from "../api/client";
import { Task, TaskFormValues, TaskStats } from "../types/task";
import { useToast } from "../context/ToastContext";

export function Dashboard() {
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isSubmitting, setSubmitting] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      tasksApi.stats(),
      tasksApi.list({ sortBy: "createdAt", order: "desc" }),
    ])
      .then(([statsData, tasksData]) => {
        if (cancelled) return;
        setStats(statsData);
        setRecentTasks(tasksData.slice(0, 5));
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof ApiClientError
            ? err.message
            : "Failed to load dashboard data"
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [refreshKey]);

  async function handleCreate(values: TaskFormValues) {
    setSubmitting(true);
    try {
      await tasksApi.create(values);
      showToast("Task created successfully", "success");
      setCreateOpen(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      showToast(
        err instanceof ApiClientError ? err.message : "Failed to create task",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex-1 min-w-0">
      <Header
        title="Dashboard"
        subtitle="Live overview of your team's tasks"
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

      <main className="p-4 sm:p-8 space-y-8">
        {error ? (
          <ErrorState message={error} onRetry={() => setRefreshKey((k) => k + 1)} />
        ) : (
          <>
            <section className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              {loading || !stats ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <StatCardSkeleton key={i} />
                ))
              ) : (
                <>
                  <StatCard label="Total tasks" value={stats.total} accent="slate" />
                  <StatCard label="Pending" value={stats.pending} accent="amber" />
                  <StatCard
                    label="In progress"
                    value={stats.inProgress}
                    accent="blue"
                  />
                  <StatCard
                    label="Completed"
                    value={stats.completed}
                    accent="emerald"
                  />
                  <StatCard
                    label="High priority"
                    value={stats.highPriority}
                    accent="rose"
                  />
                </>
              )}
            </section>

            <section className="bg-white rounded-xl border border-slate-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h2 className="text-sm font-semibold text-slate-900">
                  Recent tasks
                </h2>
                <button
                  onClick={() => navigate("/tasks")}
                  className="text-sm font-medium text-brand-600 hover:text-brand-800"
                >
                  View all
                </button>
              </div>
              {!loading && recentTasks.length === 0 ? (
                <div className="p-2">
                  <EmptyState
                    title="No tasks yet"
                    description="Create your first task to see it show up here."
                    actionLabel="Add Task"
                    onAction={() => setCreateOpen(true)}
                  />
                </div>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {loading
                    ? Array.from({ length: 5 }).map((_, i) => (
                        <li key={i} className="px-5 py-4">
                          <div className="skeleton h-4 w-1/2 mb-2" />
                          <div className="skeleton h-3 w-1/4" />
                        </li>
                      ))
                    : recentTasks.map((task) => (
                        <li
                          key={task.id}
                          className="px-5 py-4 flex items-center justify-between gap-4"
                        >
                          <div className="min-w-0">
                            <p className="font-medium text-slate-900 truncate">
                              {task.title}
                            </p>
                            <p className="text-xs text-slate-500 truncate">
                              {task.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <StatusBadge status={task.status} />
                            <PriorityBadge priority={task.priority} />
                          </div>
                        </li>
                      ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>

      <TaskFormModal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
