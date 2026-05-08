"use client";

import { useEffect, useState } from "react";
import { BarChartHorizontal, DonutBreakdown, StatGrid } from "./Charts";

interface Stats {
  total: number;
  top_deptos: { label: string; value: number }[];
  top_modalidad: { label: string; value: number }[];
  top_tipo_contrato: { label: string; value: number }[];
  genero: { label: string; contratos: number; dinero: number }[];
  pyme: { label: string; value: number }[];
  anticipo: { label: string; value: number }[];
  ambiental: { label: string; value: number }[];
}

const fmt = (n: number) => n.toLocaleString("es-CO");
const fmtCop = (n: number) => {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${fmt(n)}`;
};

export function TursoCharts() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/turso/stats")
      .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
      .then(setStats)
      .catch((e) => setError(typeof e === "number" ? `HTTP ${e}` : String(e)));
  }, []);

  if (error)
    return (
      <div className="rounded-lg border border-risk-med/30 bg-risk-med/5 p-6 text-sm text-risk-med">
        Turso aún cargando datos. Reintentá en unos minutos.
        <p className="mt-1 font-mono text-[10px] text-fg-subtle">err: {error}</p>
      </div>
    );

  if (!stats)
    return (
      <div className="rounded-lg border border-border bg-surface p-6 text-sm text-fg-muted">
        <span className="inline-block size-2 animate-pulse rounded-full bg-accent mr-2" />
        Consultando Turso...
      </div>
    );

  const generoTotal = stats.genero.reduce((s, g) => s + g.dinero, 0);
  const pymeSi = stats.pyme.find((p) => p.label.toLowerCase().startsWith("si"))?.value ?? 0;
  const pymeNo = stats.pyme.find((p) => p.label.toLowerCase().startsWith("no"))?.value ?? 0;
  const pymeTotal = pymeSi + pymeNo;
  const anticipoSi = stats.anticipo.find((p) => p.label.toLowerCase().startsWith("si"))?.value ?? 0;
  const ambSi = stats.ambiental.find((p) => p.label.toLowerCase().startsWith("si"))?.value ?? 0;

  return (
    <div className="space-y-6">
      <StatGrid
        items={[
          { label: "Registros en Turso", valor: fmt(stats.total), sub: "tabla contratos_csv" },
          {
            label: "Pymes",
            valor: pymeTotal > 0 ? `${((pymeSi / pymeTotal) * 100).toFixed(2)}%` : "—",
            sub: `${fmt(pymeSi)} contratos`,
            tone: "low",
          },
          {
            label: "Pago adelantado",
            valor: stats.total > 0 ? `${((anticipoSi / stats.total) * 100).toFixed(2)}%` : "—",
            sub: `${fmt(anticipoSi)} contratos`,
            tone: "med",
          },
          {
            label: "Oblig. ambiental",
            valor: fmt(ambSi),
            sub: "contratos",
            tone: "low",
          },
        ]}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <BarChartHorizontal
          titulo="Top 10 departamentos por # contratos"
          data={stats.top_deptos}
        />
        <BarChartHorizontal
          titulo="Top 5 modalidades de contratación"
          data={stats.top_modalidad}
          colorPalette={["#d97757", "#b8954a", "#5fb87a", "#786d5b", "#2d3849"]}
        />
        <BarChartHorizontal
          titulo="Top 5 tipos de contrato"
          data={stats.top_tipo_contrato}
          colorPalette={["#d97757", "#c54a3b", "#b8954a", "#786d5b", "#5fb87a"]}
        />

        <div className="rounded-lg border border-border bg-surface p-5">
          <h3 className="mb-4 font-serif text-sm font-semibold tracking-wide text-fg">
            Brecha de género — dinero ejecutado
          </h3>
          <div className="space-y-2">
            {stats.genero.map((g) => {
              const pct = (g.dinero / generoTotal) * 100;
              const colorMap: Record<string, string> = {
                Hombre: "#d97757",
                Mujer: "#5fb87a",
                "No Definido": "#786d5b",
                Otro: "#b8954a",
              };
              const color = colorMap[g.label] || "#2d3849";
              return (
                <div key={g.label} className="text-xs">
                  <div className="mb-0.5 flex items-baseline justify-between gap-2">
                    <span className="text-fg">{g.label}</span>
                    <span className="font-mono text-[11px] font-semibold text-fg-muted">
                      {fmtCop(g.dinero)}{" "}
                      <span className="text-fg-subtle">· {fmt(g.contratos)} contratos</span>
                    </span>
                  </div>
                  <div className="relative h-2.5 overflow-hidden rounded-sm bg-bg">
                    <div className="h-full rounded-sm" style={{ width: `${pct}%`, background: color }} />
                  </div>
                  <p className="mt-0.5 text-[10px] text-fg-subtle">
                    {pct.toFixed(2)}% del dinero · ${" "}
                    {g.contratos > 0 ? fmt(Math.round(g.dinero / g.contratos)) : "0"} promedio
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
