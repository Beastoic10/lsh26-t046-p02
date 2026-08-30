export default function DotHistogram({
  data,
  colorClass,
  maxDots = 6,
}: {
  data: { label: string; count: number }[];
  colorClass: string;
  maxDots?: number;
}) {
  const max = Math.max(1, ...data.map((d) => d.count));

  return (
    <div className="flex items-end justify-between gap-2">
      {data.map((d) => {
        const dots = d.count === 0 ? 0 : Math.max(1, Math.round((d.count / max) * maxDots));
        return (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex flex-col-reverse gap-1">
              {Array.from({ length: maxDots }, (_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i < dots ? colorClass : "bg-slate-200/60"}`}
                />
              ))}
            </div>
            <span className="text-[10px] font-medium text-slate-400">{d.label.split(" ")[0]}</span>
          </div>
        );
      })}
    </div>
  );
}
