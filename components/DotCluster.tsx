/**
 * Renders `total` dots in a grid, with `filled` of them colored — a compact
 * texture for "how many of these" that reads faster than a number alone at
 * small sizes. Deliberately simple: filled vs. unfilled, no fabricated
 * time-series shape, since the underlying data is a live snapshot, not a
 * history.
 */
export default function DotCluster({
  filled,
  total = 40,
  colorClass,
  columns = 10,
}: {
  filled: number;
  total?: number;
  colorClass: string;
  columns?: number;
}) {
  const clampedFilled = Math.max(0, Math.min(filled, total));
  return (
    <div
      className="grid gap-1"
      style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={`aspect-square rounded-full ${i < clampedFilled ? colorClass : "bg-slate-200/70"}`}
        />
      ))}
    </div>
  );
}
