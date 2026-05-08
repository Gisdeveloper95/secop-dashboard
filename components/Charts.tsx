// Charts SVG nativos — sin dependencias.
// Diseño Sentinel: barras horizontales con valor numérico, paleta accent/risk.

const fmt = (n: number) => n.toLocaleString("es-CO");

export function BarChartHorizontal({
  titulo,
  data,
  unidad = "",
  height = 28,
  colorPalette = ["#d97757"],
}: {
  titulo: string;
  data: Array<{ label: string; value: number; meta?: string }>;
  unidad?: string;
  height?: number;
  colorPalette?: string[];
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h3 className="mb-4 font-serif text-sm font-semibold tracking-wide text-fg">{titulo}</h3>
      <div className="space-y-1.5">
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          const color = colorPalette[i % colorPalette.length];
          return (
            <div key={`${d.label}-${i}`} className="text-xs">
              <div className="mb-0.5 flex items-baseline justify-between gap-2">
                <span className="truncate text-fg">{d.label}</span>
                <span className="font-mono text-[11px] font-semibold text-fg-muted">
                  {fmt(d.value)}
                  {unidad}
                </span>
              </div>
              <div
                className="relative h-2 overflow-hidden rounded-sm bg-bg"
                style={{ height: `${height / 6}px` }}
              >
                <div
                  className="h-full rounded-sm transition-all"
                  style={{ width: `${pct}%`, background: color }}
                />
              </div>
              {d.meta && <p className="mt-0.5 text-[10px] text-fg-subtle">{d.meta}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function StatGrid({
  items,
}: {
  items: Array<{ label: string; valor: string; sub?: string; tone?: "default" | "accent" | "low" | "med" | "high" | "critical" }>;
}) {
  const colorMap: Record<string, string> = {
    default: "text-fg",
    accent: "text-accent",
    low: "text-risk-low",
    med: "text-risk-med",
    high: "text-risk-high",
    critical: "text-risk-critical",
  };
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {items.map((it) => (
        <div
          key={it.label}
          className="rounded-lg border border-border bg-surface p-4"
        >
          <p className="text-[9px] font-bold uppercase tracking-widest text-fg-muted">{it.label}</p>
          <p className={`mt-1 font-serif text-2xl font-semibold leading-none ${colorMap[it.tone || "default"]}`}>
            {it.valor}
          </p>
          {it.sub && <p className="mt-1 text-[10px] text-fg-subtle">{it.sub}</p>}
        </div>
      ))}
    </div>
  );
}

export function DonutBreakdown({
  titulo,
  data,
}: {
  titulo: string;
  data: Array<{ label: string; value: number; color?: string }>;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radio = 38;
  const circ = 2 * Math.PI * radio;
  let offset = 0;

  const colors = ["#d97757", "#5fb87a", "#b8954a", "#c54a3b", "#786d5b", "#2d3849"];

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h3 className="mb-3 font-serif text-sm font-semibold text-fg">{titulo}</h3>
      <div className="flex items-center gap-4">
        <svg viewBox="0 0 100 100" className="h-28 w-28 shrink-0 -rotate-90">
          {data.map((d, i) => {
            const dash = (d.value / total) * circ;
            const seg = (
              <circle
                key={d.label}
                cx="50"
                cy="50"
                r={radio}
                fill="none"
                stroke={d.color || colors[i % colors.length]}
                strokeWidth="14"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={-offset}
              />
            );
            offset += dash;
            return seg;
          })}
          <text
            x="50"
            y="50"
            textAnchor="middle"
            fontSize="14"
            fontWeight="600"
            fill="#f5f1e8"
            transform="rotate(90 50 50)"
            style={{ fontFamily: "Fraunces, serif" }}
          >
            {fmt(total)}
          </text>
        </svg>
        <div className="flex-1 space-y-1.5 text-[11px]">
          {data.map((d, i) => (
            <div key={d.label} className="flex items-center gap-1.5">
              <span
                className="size-2 shrink-0 rounded-full"
                style={{ background: d.color || colors[i % colors.length] }}
              />
              <span className="flex-1 truncate text-fg">{d.label}</span>
              <span className="font-mono font-semibold text-fg-muted">
                {((d.value / total) * 100).toFixed(1)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
