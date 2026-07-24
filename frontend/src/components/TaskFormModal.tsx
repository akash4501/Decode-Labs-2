import { useEffect, useState } from "react";
import { Modal } from "./Modal";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  Task,
  TaskFormValues,
} from "../types/task";

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: TaskFormValues) => Promise<void>;
  initialTask?: Task | null;
  isSubmitting?: boolean;
}

const EMPTY_FORM: TaskFormValues = {
  title: "",
  description: "",
  status: "pending",
  priority: "medium",
};

export function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialTask,
  isSubmitting,
}: TaskFormModalProps) {
  const [values, setValues] = useState<TaskFormValues>(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      setValues(
        initialTask
          ? {
              title: initialTask.title,
              description: initialTask.description,
              status: initialTask.status,
              priority: initialTask.priority,
            }
          : EMPTY_FORM
      );
      setFieldErrors({});
    }
  }, [isOpen, initialTask]);

  function validate(): boolean {
    const errors: Record<string, string> = {};
    if (!values.title.trim()) errors.title = "Title cannot be empty";
    if (!values.description.trim())
      errors.description = "Description cannot be empty";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    await onSubmit(values);
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialTask ? "Edit task" : "Add task"}
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            type="text"
            value={values.title}
            onChange={(e) => setValues({ ...values, title: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            placeholder="e.g. Write integration tests"
          />
          {fieldErrors.title && (
            <p className="text-xs text-rose-600 mt-1">{fieldErrors.title}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-slate-700 mb-1"
          >
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={values.description}
            onChange={(e) =>
              setValues({ ...values, description: e.target.value })
            }
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            placeholder="What needs to be done?"
          />
          {fieldErrors.description && (
            <p className="text-xs text-rose-600 mt-1">
              {fieldErrors.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              value={values.status}
              onChange={(e) =>
                setValues({
                  ...values,
                  status: e.target.value as TaskFormValues["status"],
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              value={values.priority}
              onChange={(e) =>
                setValues({
                  ...values,
                  priority: e.target.value as TaskFormValues["priority"],
                })
              }
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500"
            >
              {PRIORITY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-60"
          >
            {isSubmitting
              ? "Saving..."
              : initialTask
              ? "Save changes"
              : "Create task"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
