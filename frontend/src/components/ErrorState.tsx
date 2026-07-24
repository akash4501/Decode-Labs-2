interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 border border-rose-200 rounded-xl bg-rose-50">
      <h3 className="text-sm font-semibold text-rose-800">
        Something went wrong
      </h3>
      <p className="text-sm text-rose-600 mt-1 max-w-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors"
        >
          Try again
        </button>
      )}
    </div>
  );
}
