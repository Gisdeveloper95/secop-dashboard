import { RespuestaCard, Section } from "@/components/Card";
import { DATASETS } from "@/lib/datasets";
import { RONDA_1, RONDA_2_CSV, RONDA_2_DMGG } from "@/lib/respuestas";

export default function Home() {
  return (
    <main>
      {/* HERO editorial Sentinel */}
      <header className="border-b border-border bg-surface">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">
              Hackathon Nacional COL 5.0 · Ronda 1 + Ronda 2
            </p>
          </div>
          <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.05] tracking-tight text-fg md:text-7xl">
            Auditoría forense<br />de SECOP II
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-fg-muted">
            Análisis cuantitativo de 3 datasets oficiales de contratación pública
            colombiana. Las respuestas que ves abajo se generaron con queries SoQL
            reales contra la API de datos.gov.co, validadas y reproducibles.
          </p>
          <div className="mt-8 flex flex-wrap gap-2 text-[11px]">
            <a
              href="#ronda-1"
              className="rounded-full border border-border-strong bg-elev px-4 py-2 font-semibold text-fg hover:border-accent hover:text-accent transition"
            >
              Ronda 1 · jbjy-vk9h
            </a>
            <a
              href="#ronda-2-dmgg"
              className="rounded-full border border-border-strong bg-elev px-4 py-2 font-semibold text-fg hover:border-accent hover:text-accent transition"
            >
              Ronda 2 · dmgg-8hin
            </a>
            <a
              href="#ronda-2-csv"
              className="rounded-full border border-border-strong bg-elev px-4 py-2 font-semibold text-fg hover:border-accent hover:text-accent transition"
            >
              Ronda 2 · CSV 2025
            </a>
          </div>
          <p className="mt-12 text-[10px] font-mono text-fg-subtle">Equipo: Master Minds</p>
        </div>
      </header>

      {/* Datasets — fuentes y APIs */}
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

      {/* RONDA 1 */}
      <div id="ronda-1">
        <Section
          eyebrow="Ronda 1 · 12 preguntas · 17.4 puntos"
          titulo="Dataset jbjy-vk9h — Contratos Electrónicos"
          bajada="Histórico completo del SECOP II desde 2015 (5.6 millones de registros, 84 variables). Las respuestas se obtuvieron con queries SoQL agregadas vía la API pública de datos.gov.co (autenticación Basic con API Key)."
        >
          {RONDA_1.map((r) => (
            <RespuestaCard key={r.numero} r={r} />
          ))}
        </Section>
      </div>

      {/* RONDA 2 — DMGG */}
      <div id="ronda-2-dmgg">
        <Section
          eyebrow="Ronda 2 · 12 preguntas · 17.4 puntos"
          titulo="Dataset dmgg-8hin — Archivos Descarga Desde 2025"
          bajada="Catálogo de documentos electrónicos asociados a procesos del SECOP II (17.3 millones de archivos, 11 variables). Misma metodología: SoQL contra Socrata API."
        >
          {RONDA_2_DMGG.map((r) => (
            <RespuestaCard key={r.numero} r={r} />
          ))}
        </Section>
      </div>

      {/* RONDA 2 — CSV (Turso) */}
      <div id="ronda-2-csv">
        <Section
          eyebrow="Ronda 2 · CSV 2025 · 35.7 puntos"
          titulo="Dataset CSV — Snapshot 2026-05-06"
          bajada="Contratos firmados durante 2025 (1.0M registros, 84 variables). Almacenados en Turso (libSQL en el edge) y consumidos vía endpoint /api/turso/contratos. Cubre las preguntas 3-20 del segundo cuestionario."
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
          <div className="flex gap-3 text-[11px]">
            <a
              href="/api/socrata/jbjy-vk9h?$select=count(*)"
              className="text-fg-muted hover:text-accent transition font-mono"
            >
              /api/socrata/jbjy-vk9h
            </a>
            <a
              href="/api/socrata/dmgg-8hin?$select=count(*)"
              className="text-fg-muted hover:text-accent transition font-mono"
            >
              /api/socrata/dmgg-8hin
            </a>
            <a
              href="/api/turso/contratos?stats=1"
              className="text-fg-muted hover:text-accent transition font-mono"
            >
              /api/turso/contratos
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
