import { NextRequest } from "next/server";
import { getTurso } from "@/lib/turso";

// Endpoint que sirve datos del CSV (dataset 3) almacenado en Turso.
// Por ahora devuelve un sample mientras subimos la data real.
//
// Query params soportados:
//   ?limit=10     — número de filas
//   ?stats=1      — devuelve agregaciones rápidas (count, top deptos, etc.)

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const stats = sp.get("stats");
  const limit = Math.min(parseInt(sp.get("limit") || "10", 10), 200);

  try {
    const db = getTurso();

    if (stats === "1") {
      const [total, depto, modalidad, tipo] = await Promise.all([
        db.execute("SELECT count(*) AS n FROM contratos_csv"),
        db.execute(
          "SELECT departamento, count(*) AS n FROM contratos_csv GROUP BY departamento ORDER BY n DESC LIMIT 10",
        ),
        db.execute(
          "SELECT modalidad, count(*) AS n FROM contratos_csv GROUP BY modalidad ORDER BY n DESC LIMIT 5",
        ),
        db.execute(
          "SELECT tipo_contrato, count(*) AS n FROM contratos_csv GROUP BY tipo_contrato ORDER BY n DESC LIMIT 5",
        ),
      ]);
      return Response.json({
        total: total.rows[0]?.n,
        top_deptos: depto.rows,
        top_modalidad: modalidad.rows,
        top_tipo_contrato: tipo.rows,
      });
    }

    const r = await db.execute({
      sql: "SELECT * FROM contratos_csv LIMIT ?",
      args: [limit],
    });
    return Response.json({ count: r.rows.length, rows: r.rows });
  } catch (e: unknown) {
    return Response.json(
      {
        error: "Turso no disponible o tabla no creada",
        detalle: e instanceof Error ? e.message : String(e),
        nota: "Sample data aún no subida. Variables TURSO_DATABASE_URL/TURSO_AUTH_TOKEN deben estar configuradas.",
      },
      { status: 503 },
    );
  }
}
