import { Task } from "../types/task";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { TableRowSkeleton } from "./LoadingSkeleton";

interface TaskTableProps {
  tasks: Task[];
  loading: boolean;
  onView: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function TaskTable({
  tasks,
  loading,
  onView,
  onEdit,
  onDelete,
}: TaskTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="w-full text-sm text-left">
        <thead>
          <tr className="text-xs uppercase tracking-wide text-slate-500 bg-slate-50">
            <th className="py-3 px-4 font-medium">Title</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium">Priority</th>
            <th className="py-3 px-4 font-medium">Created</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading &&
            Array.from({ length: 5 }).map((_, i) => (
              <TableRowSkeleton key={i} />
            ))}
          {!loading &&
            tasks.map((task) => (
              <tr
                key={task.id}
                className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
                onClick={() => onView(task)}
              >
                <td className="py-3 px-4">
                  <p className="font-medium text-slate-900">{task.title}</p>
                  <p className="text-slate-500 text-xs truncate max-w-xs">
                    {task.description}
                  </p>
                </td>
                <td className="py-3 px-4">
                  <StatusBadge status={task.status} />
                </td>
                <td className="py-3 px-4">
                  <PriorityBadge priority={task.priority} />
                </td>
                <td className="py-3 px-4 text-slate-500">
                  {formatDate(task.createdAt)}
                </td>
                <td className="py-3 px-4">
                  <div
                    className="flex justify-end gap-3"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => onEdit(task)}
                      className="text-brand-600 hover:text-brand-800 font-medium"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(task)}
                      className="text-rose-600 hover:text-rose-800 font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
