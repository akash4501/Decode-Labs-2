import { useState } from "react";
import { Sidebar } from "./Sidebar";

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between gap-4 px-4 sm:px-8 py-4 bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <button
            className="lg:hidden text-slate-500 hover:text-slate-700"
            aria-label="Open navigation menu"
            onClick={() => setMobileOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold text-slate-900 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-slate-500 truncate">{subtitle}</p>
            )}
          </div>
        </div>
        {action}
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden bg-slate-900/50"
          onClick={() => setMobileOpen(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className="h-full">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
