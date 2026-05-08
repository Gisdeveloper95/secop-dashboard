import type { Respuesta } from "@/lib/respuestas";

export function RespuestaCard({ r }: { r: Respuesta }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-4 transition hover:border-border-strong">
      <header className="flex items-baseline justify-between gap-3 border-b border-border pb-2">
        <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-accent">
          P{r.numero}
        </p>
        {r.unidad && <span className="text-[10px] text-fg-subtle">{r.unidad}</span>}
      </header>
      <h3 className="mt-2 text-xs font-semibold uppercase tracking-wide text-fg-muted">
        {r.pregunta}
      </h3>
      <p className="mt-2 font-serif text-2xl font-semibold leading-tight text-fg break-words">
        {r.respuesta}
      </p>
      {r.detalle && (
        <p className="mt-2 text-[11px] leading-relaxed text-fg-muted break-words">
          {r.detalle}
        </p>
      )}
      {r.query && (
        <pre className="mt-3 overflow-x-auto rounded bg-bg p-2 font-mono text-[10px] text-fg-subtle">
          {r.query}
        </pre>
      )}
    </article>
  );
}

export function Section({
  eyebrow,
  titulo,
  bajada,
  children,
}: {
  eyebrow: string;
  titulo: string;
  bajada?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border py-12">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent">{eyebrow}</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold tracking-tight text-fg md:text-4xl">
          {titulo}
        </h2>
        {bajada && <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fg-muted">{bajada}</p>}
        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">{children}</div>
      </div>
    </section>
  );
}
