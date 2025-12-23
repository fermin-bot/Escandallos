export function KPICard({ title, value, suffix }) {
  return (
    <div className="p-4 rounded-lg border bg-white/70 dark:bg-zinc-800/70">
      <div className="text-sm text-zinc-600 dark:text-zinc-300">{title}</div>
      <div className="text-2xl font-semibold">{value}{suffix || ''}</div>
    </div>
  );
}

export function MiniBar({ label, percent }) {
  const p = Math.max(0, Math.min(100, percent || 0));
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="truncate">{label}</span>
        <span>{p.toFixed(1)}%</span>
      </div>
      <div className="h-2 bg-zinc-200 dark:bg-zinc-700 rounded">
        <div
          className="h-2 bg-emerald-500 rounded"
          style={{ width: `${p}%` }}
        />
      </div>
    </div>
  );
}

