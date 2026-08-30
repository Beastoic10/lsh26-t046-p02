export default function AppHeader({
  onReset,
  resetting,
}: {
  onReset: () => void;
  resetting: boolean;
}) {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <span className="clay-pill flex h-10 w-10 items-center justify-center bg-clay-terracotta text-white">
            <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12M6 12h12" />
            </svg>
          </span>
          <span className="text-sm font-semibold tracking-tight text-clay-ink2">ShelfCheck</span>
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-clay-ink">Overview</h1>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="clay-pill inline-flex w-fit items-center gap-2 bg-clay-surface px-4 py-2 text-xs font-medium text-clay-ink2">
          <svg viewBox="0 0 24 24" fill="none" className="h-3.5 w-3.5" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
          </svg>
          {today}
        </div>

        <button
          onClick={onReset}
          disabled={resetting}
          className="clay-pill inline-flex items-center gap-2 bg-clay-steel px-4 py-2 text-xs font-medium text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            className={`h-3.5 w-3.5 ${resetting ? "animate-spin" : ""}`}
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 4v5h5M20 20v-5h-5M4.5 9A8 8 0 0119.5 9M19.5 15A8 8 0 014.5 15"
            />
          </svg>
          {resetting ? "Resetting…" : "Reset to initial state"}
        </button>
      </div>
    </header>
  );
}
