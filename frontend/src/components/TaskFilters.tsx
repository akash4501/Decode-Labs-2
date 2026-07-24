import { PRIORITY_OPTIONS, STATUS_OPTIONS } from "../types/task";
import { TaskQueryParams } from "../api/tasks";

interface TaskFiltersProps {
  filters: TaskQueryParams;
  onChange: (filters: TaskQueryParams) => void;
}

export function TaskFilters({ filters, onChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:items-center flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
          />
        </svg>
        <input
          type="text"
          value={filters.search || ""}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search tasks by title..."
          aria-label="Search tasks by title"
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
        />
      </div>

      <select
        value={filters.status || ""}
        onChange={(e) =>
          onChange({ ...filters, status: e.target.value || undefined })
        }
        aria-label="Filter by status"
        className="px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      >
        <option value="">All statuses</option>
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={filters.priority || ""}
        onChange={(e) =>
          onChange({ ...filters, priority: e.target.value || undefined })
        }
        aria-label="Filter by priority"
        className="px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      >
        <option value="">All priorities</option>
        {PRIORITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      <select
        value={`${filters.sortBy || "createdAt"}:${filters.order || "desc"}`}
        onChange={(e) => {
          const [sortBy, order] = e.target.value.split(":");
          onChange({
            ...filters,
            sortBy: sortBy as TaskQueryParams["sortBy"],
            order: order as TaskQueryParams["order"],
          });
        }}
        aria-label="Sort tasks"
        className="px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
      >
        <option value="createdAt:desc">Newest first</option>
        <option value="createdAt:asc">Oldest first</option>
        <option value="title:asc">Title A–Z</option>
        <option value="title:desc">Title Z–A</option>
        <option value="priority:desc">Priority high→low</option>
        <option value="priority:asc">Priority low→high</option>
      </select>
    </div>
  );
}
