import { RespuestaCard, Section } from "@/components/Card";
import { TursoCharts } from "@/components/TursoCharts";
import { DATASETS } from "@/lib/datasets";
import { RONDA_1_BD1, RONDA_1_BD2, RONDA_2_CSV } from "@/lib/respuestas";

export default function Home() {
  return (
    <main>
      {/* HERO Sentinel forense */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
              Hackathon Nacional COL 5.0 · Master Minds
            </p>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-fg md:text-7xl">
            Auditoría forense<br />de SECOP II
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted">
            Análisis cuantitativo de tres datasets oficiales de contratación
            pública colombiana. Las respuestas se generan con queries SoQL reales
            contra la API de datos.gov.co (datasets 1 y 2) y vía Turso/libSQL
            (dataset 3, CSV snapshot 2025), todas validadas y reproducibles.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-[11px]">
            <a href="#ronda-1-bd1" className="rounded-full border border-border-strong bg-elev px-4 py-2 font-semibold text-fg hover:border-accent hover:text-accent transition">
              Ronda 1 · BD1 · jbjy-vk9h
            </a>
            <a href="#ronda-1-bd2" className="rounded-full border border-border-strong bg-elev px-4 py-2 font-semibold text-fg hover:border-accent hover:text-accent transition">
              Ronda 1 · BD2 · dmgg-8hin
            </a>
            <a href="#ronda-2" className="rounded-full border border-border-strong bg-elev px-4 py-2 font-semibold text-fg hover:border-accent hover:text-accent transition">
              Ronda 2 · CSV 2025
            </a>
            <a href="#charts" className="rounded-full border border-accent bg-accent/15 px-4 py-2 font-semibold text-accent hover:bg-accent hover:text-accent-fg transition">
              📊 Gráficos en vivo
            </a>
          </div>
        </div>
      </header>

      {/* Catálogo de datasets */}
      <section className="border-t border-border bg-bg py-10">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-fg-subtle">
            Fuentes de datos
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
            {Object.entries(DATASETS).map(([k, d]) => (
              <a
                key={k}
                href={d.url_dataset.startsWith("http") ? d.url_dataset : "#"}
                target={d.url_dataset.startsWith("http") ? "_blank" : "_self"}
                rel="noopener noreferrer"
                className="block rounded-lg border border-border bg-surface p-4 hover:border-accent transition"
              >
                <p className="font-mono text-[10px] uppercase tracking-widest text-fg-subtle">
                  {d.fuente}
                </p>
                <p className="mt-1 font-serif text-base font-semibold text-fg">{d.nombre}</p>
                <p className="mt-2 font-mono text-[10px] text-accent">{d.id}</p>
                <p className="mt-1 font-mono text-[9px] text-fg-subtle break-all">
                  {d.api_resource}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* CHARTS EN VIVO desde Turso */}
      <section id="charts" className="border-t border-border bg-bg py-12">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
            Gráficos en vivo
          </p>
          <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-fg md:text-4xl">
            Visualización del CSV en Turso
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fg-muted">
            Estos charts se calculan al momento contra la base de datos Turso
            (libSQL en el edge) que contiene el CSV snapshot 2025. Cada dato
            mostrado proviene de una query SQL ejecutada en este request.
          </p>
          <div className="mt-8">
            <TursoCharts />
          </div>
        </div>
      </section>

      {/* RONDA 1 — BD1 */}
      <div id="ronda-1-bd1">
        <Section
          eyebrow="Ronda 1 · Base de Datos 1 · 12 preguntas"
          titulo="Dataset jbjy-vk9h — Contratos Electrónicos"
          bajada="Histórico completo del SECOP II desde 2015 (5.6 millones de registros, 84 variables). Las respuestas se obtuvieron con queries SoQL agregadas vía la API pública de datos.gov.co (autenticación Basic con API Key)."
        >
          {RONDA_1_BD1.map((r) => (
            <RespuestaCard key={r.numero} r={r} />
          ))}
        </Section>
      </div>

      {/* RONDA 1 — BD2 */}
      <div id="ronda-1-bd2">
        <Section
          eyebrow="Ronda 1 · Base de Datos 2 · 12 preguntas"
          titulo="Dataset dmgg-8hin — Archivos Descarga Desde 2025"
          bajada="Catálogo de documentos electrónicos asociados a procesos del SECOP II (17.3 millones de archivos, 11 variables). Misma metodología: SoQL contra Socrata API."
        >
          {RONDA_1_BD2.map((r) => (
            <RespuestaCard key={r.numero} r={r} />
          ))}
        </Section>
      </div>

      {/* RONDA 2 — CSV (Turso) */}
      <div id="ronda-2">
        <Section
          eyebrow="Ronda 2 · 18 preguntas"
          titulo="CSV Snapshot 2026-05-06 — Turso libSQL"
          bajada="Contratos firmados durante 2025 (1.0M registros, 84 variables). Almacenados en Turso y consumidos vía /api/turso/contratos. Cubre las preguntas Q3-Q20 de la Ronda 2."
        >
          {RONDA_2_CSV.map((r) => (
            <RespuestaCard key={r.numero} r={r} />
          ))}
        </Section>
      </div>

      {/* FOOTER */}
      <footer className="border-t border-border bg-surface py-8">
        <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-between gap-3">
          <p className="font-mono text-[10px] text-fg-subtle">
            Master Minds · Hackathon Nacional COL 5.0 · 2026
          </p>
          <div className="flex flex-wrap gap-3 text-[11px]">
            <a href="/api/socrata/jbjy-vk9h?$select=count(*)" className="text-fg-muted hover:text-accent transition font-mono">
              /api/socrata/jbjy-vk9h
            </a>
            <a href="/api/socrata/dmgg-8hin?$select=count(*)" className="text-fg-muted hover:text-accent transition font-mono">
              /api/socrata/dmgg-8hin
            </a>
            <a href="/api/turso/stats" className="text-fg-muted hover:text-accent transition font-mono">
              /api/turso/stats
            </a>
            <a href="/api/turso/contratos?stats=1" className="text-fg-muted hover:text-accent transition font-mono">
              /api/turso/contratos
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
