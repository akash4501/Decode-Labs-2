import { Modal } from "./Modal";
import { StatusBadge } from "./StatusBadge";
import { PriorityBadge } from "./PriorityBadge";
import { Task } from "../types/task";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

interface TaskDetailsModalProps {
  task: Task | null;
  onClose: () => void;
  onEdit: () => void;
}

export function TaskDetailsModal({
  task,
  onClose,
  onEdit,
}: TaskDetailsModalProps) {
  if (!task) return null;

  return (
    <Modal isOpen={!!task} onClose={onClose} title="Task details">
      <div className="space-y-4">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {task.title}
          </h3>
          <p className="text-sm text-slate-600 mt-1 whitespace-pre-wrap">
            {task.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={task.status} />
          <PriorityBadge priority={task.priority} />
        </div>

        <dl className="grid grid-cols-2 gap-4 text-sm border-t border-slate-100 pt-4">
          <div>
            <dt className="text-slate-500">Created</dt>
            <dd className="text-slate-900 font-medium">
              {formatDate(task.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-slate-500">Last updated</dt>
            <dd className="text-slate-900 font-medium">
              {formatDate(task.updatedAt)}
            </dd>
          </div>
        </dl>

        <div className="flex justify-end pt-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700"
          >
            Edit task
          </button>
        </div>
      </div>
    </Modal>
  );
}
