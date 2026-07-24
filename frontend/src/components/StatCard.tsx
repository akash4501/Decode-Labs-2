interface StatCardProps {
  label: string;
  value: number;
  accent: "slate" | "amber" | "blue" | "emerald" | "rose";
}

const ACCENTS: Record<StatCardProps["accent"], string> = {
  slate: "text-slate-900",
  amber: "text-amber-600",
  blue: "text-blue-600",
  emerald: "text-emerald-600",
  rose: "text-rose-600",
};

export function StatCard({ label, value, accent }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className={`text-3xl font-bold mt-2 ${ACCENTS[accent]}`}>{value}</p>
    </div>
  );
}
