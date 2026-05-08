import { getTurso } from "@/lib/turso";

// Devuelve agregaciones para los gráficos del dashboard.
// Cacheado por 5 minutos para no martillar Turso.

export const revalidate = 300;

export async function GET() {
  try {
    const db = getTurso();

    const [total, deptos, modalidad, tipo, genero, pyme, anticipo, ambiental] = await Promise.all([
      db.execute("SELECT count(*) AS n FROM contratos_csv"),
      db.execute(
        "SELECT departamento AS label, count(*) AS value FROM contratos_csv WHERE departamento IS NOT NULL AND departamento != '' GROUP BY departamento ORDER BY value DESC LIMIT 10",
      ),
      db.execute(
        "SELECT modalidad AS label, count(*) AS value FROM contratos_csv WHERE modalidad IS NOT NULL AND modalidad != '' GROUP BY modalidad ORDER BY value DESC LIMIT 5",
      ),
      db.execute(
        "SELECT tipo_contrato AS label, count(*) AS value FROM contratos_csv WHERE tipo_contrato IS NOT NULL AND tipo_contrato != '' GROUP BY tipo_contrato ORDER BY value DESC LIMIT 5",
      ),
      db.execute(
        "SELECT genero_rep_legal AS label, count(*) AS contratos, ROUND(SUM(valor_del_contrato)) AS dinero FROM contratos_csv WHERE genero_rep_legal IS NOT NULL AND genero_rep_legal != '' GROUP BY genero_rep_legal ORDER BY dinero DESC",
      ),
      db.execute(
        "SELECT es_pyme AS label, count(*) AS value FROM contratos_csv WHERE es_pyme IS NOT NULL AND es_pyme != '' GROUP BY es_pyme",
      ),
      db.execute(
        "SELECT habilita_pago_adelantado AS label, count(*) AS value FROM contratos_csv WHERE habilita_pago_adelantado IS NOT NULL AND habilita_pago_adelantado != '' GROUP BY habilita_pago_adelantado",
      ),
      db.execute(
        "SELECT obligacion_ambiental AS label, count(*) AS value FROM contratos_csv WHERE obligacion_ambiental IS NOT NULL AND obligacion_ambiental != '' GROUP BY obligacion_ambiental",
      ),
    ]);

    return Response.json({
      total: Number(total.rows[0]?.n ?? 0),
      top_deptos: deptos.rows.map((r) => ({ label: String(r.label), value: Number(r.value) })),
      top_modalidad: modalidad.rows.map((r) => ({ label: String(r.label), value: Number(r.value) })),
      top_tipo_contrato: tipo.rows.map((r) => ({ label: String(r.label), value: Number(r.value) })),
      genero: genero.rows.map((r) => ({
        label: String(r.label),
        contratos: Number(r.contratos),
        dinero: Number(r.dinero),
      })),
      pyme: pyme.rows.map((r) => ({ label: String(r.label), value: Number(r.value) })),
      anticipo: anticipo.rows.map((r) => ({ label: String(r.label), value: Number(r.value) })),
      ambiental: ambiental.rows.map((r) => ({ label: String(r.label), value: Number(r.value) })),
    });
  } catch (e: unknown) {
    return Response.json(
      {
        error: "Turso stats unavailable",
        detalle: e instanceof Error ? e.message : String(e),
        nota: "Si la tabla aún no terminó de poblarse, se reintenta en 5 min",
      },
      { status: 503 },
    );
  }
}
