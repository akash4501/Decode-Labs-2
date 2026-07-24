import { useCallback, useEffect, useState } from "react";
import { tasksApi, TaskQueryParams } from "../api/tasks";
import { Task } from "../types/task";
import { ApiClientError } from "../api/client";

interface UseTasksResult {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Fetches the task list for the given filters and re-fetches whenever
 * the filters change. Kept separate from the Tasks page component so
 * the fetch/loading/error logic can be unit-tested or reused elsewhere
 * (e.g. a future "my tasks" widget) without duplicating it.
 */
export function useTasks(params: TaskQueryParams): UseTasksResult {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const paramsKey = JSON.stringify(params);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    tasksApi
      .list(params)
      .then((data) => {
        if (!cancelled) setTasks(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof ApiClientError
              ? err.message
              : "Failed to load tasks"
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey, refreshKey]);

  const refetch = useCallback(() => setRefreshKey((k) => k + 1), []);

  return { tasks, loading, error, refetch };
}
