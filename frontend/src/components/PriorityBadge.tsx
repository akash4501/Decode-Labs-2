import { TaskPriority } from "../types/task";

const STYLES: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-700 ring-slate-200",
  medium: "bg-indigo-100 text-indigo-800 ring-indigo-200",
  high: "bg-rose-100 text-rose-800 ring-rose-200",
};

const LABELS: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function PriorityBadge({ priority }: { priority: TaskPriority }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ring-1 ring-inset ${STYLES[priority]}`}
    >
      {LABELS[priority]}
    </span>
  );
}
