import { useToast } from "../context/ToastContext";

const KIND_STYLES: Record<string, string> = {
  success: "bg-emerald-600",
  error: "bg-rose-600",
  info: "bg-slate-800",
};

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="status"
          className={`${KIND_STYLES[toast.kind]} text-white rounded-lg shadow-lg px-4 py-3 text-sm flex items-start justify-between gap-3 animate-[fadeIn_0.15s_ease-out]`}
        >
          <span>{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            aria-label="Dismiss notification"
            className="text-white/80 hover:text-white leading-none text-lg"
          >
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
