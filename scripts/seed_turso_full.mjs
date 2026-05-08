// Sube el CSV completo a Turso en batches transaccionales.
// Usa @libsql/client batch API para minimizar round-trips.
//
// Uso:
//   node scripts/seed_turso_full.mjs <ruta_al_csv> [BATCH=500]

import fs from "node:fs";
import { parse } from "csv-parse";
import { createClient } from "@libsql/client";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS contratos_csv (
  id_contrato         TEXT PRIMARY KEY,
  nombre_entidad      TEXT,
  nit_entidad         TEXT,
  departamento        TEXT,
  ciudad              TEXT,
  modalidad           TEXT,
  tipo_contrato       TEXT,
  estado_contrato     TEXT,
  es_pyme             TEXT,
  habilita_pago_adelantado TEXT,
  obligacion_ambiental TEXT,
  genero_rep_legal    TEXT,
  fecha_de_firma      TEXT,
  valor_del_contrato  REAL,
  proveedor           TEXT,
  documento_proveedor TEXT,
  tipo_doc_proveedor  TEXT
);
CREATE INDEX IF NOT EXISTS idx_depto ON contratos_csv(departamento);
CREATE INDEX IF NOT EXISTS idx_modalidad ON contratos_csv(modalidad);
CREATE INDEX IF NOT EXISTS idx_tipo ON contratos_csv(tipo_contrato);
CREATE INDEX IF NOT EXISTS idx_year ON contratos_csv(substr(fecha_de_firma,7,4));
`;

const cleanMoney = (s) => {
  if (s == null || s === "") return 0;
  const v = parseFloat(String(s).replace(/[$,\s]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

async function main() {
  const csvPath = process.argv[2];
  const BATCH = parseInt(process.argv[3] || "500", 10);
  if (!csvPath) {
    console.error("Uso: node scripts/seed_turso_full.mjs <csv> [BATCH=500]");
    process.exit(1);
  }

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    console.error("Faltan TURSO_DATABASE_URL / TURSO_AUTH_TOKEN");
    process.exit(1);
  }

  const db = createClient({ url, authToken });

  console.log("[1] Schema + índices...");
  for (const stmt of SCHEMA.split(";").map((s) => s.trim()).filter(Boolean)) {
    await db.execute(stmt);
  }

  console.log("[2] Streaming CSV (csv-parse, multiline-safe) + insert por batches...");
  const parser = fs.createReadStream(csvPath, { encoding: "utf-8" }).pipe(
    parse({
      columns: true,            // primer fila → header → objetos
      relax_quotes: true,
      relax_column_count: true,
      skip_records_with_error: true,
      bom: true,
      trim: false,
    }),
  );
  let buf = [];
  let total = 0;
  let descartadas = 0;
  const t0 = Date.now();

  const insertSql = `INSERT OR REPLACE INTO contratos_csv (
    id_contrato, nombre_entidad, nit_entidad, departamento, ciudad,
    modalidad, tipo_contrato, estado_contrato, es_pyme,
    habilita_pago_adelantado, obligacion_ambiental, genero_rep_legal,
    fecha_de_firma, valor_del_contrato, proveedor, documento_proveedor,
    tipo_doc_proveedor
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  async function flush() {
    if (buf.length === 0) return;
    try {
      await db.batch(
        buf.map((args) => ({ sql: insertSql, args })),
        "write",
      );
      total += buf.length;
      const elapsed = (Date.now() - t0) / 1000;
      const rate = total / elapsed;
      console.log(
        `  +${buf.length} → total ${total.toLocaleString()} (${rate.toFixed(0)}/s, descartadas ${descartadas})`,
      );
    } catch (e) {
      console.error(`  batch fail: ${e.message}`);
      // intentar insertar uno por uno para no perder todo el batch
      for (const args of buf) {
        try {
          await db.execute({ sql: insertSql, args });
          total++;
        } catch {
          descartadas++;
        }
      }
    }
    buf = [];
  }

  for await (const r of parser) {
    if (!r["ID Contrato"]) {
      descartadas++;
      continue;
    }

    buf.push([
      r["ID Contrato"] || "",
      r["Nombre Entidad"] || "",
      r["Nit Entidad"] || "",
      r["Departamento"] || "",
      r["Ciudad"] || "",
      r["Modalidad de Contratacion"] || "",
      r["Tipo de Contrato"] || "",
      r["Estado Contrato"] || "",
      r["Es Pyme"] || "",
      r["Habilita Pago Adelantado"] || "",
      r["Obligación Ambiental"] || r["Obligacion Ambiental"] || "",
      r["Género Representante Legal"] || r["Genero Representante Legal"] || "",
      r["Fecha de Firma"] || "",
      cleanMoney(r["Valor del Contrato"]),
      r["Proveedor Adjudicado"] || "",
      r["Documento Proveedor"] || "",
      r["TipoDocProveedor"] || "",
    ]);

    if (buf.length >= BATCH) await flush();
  }
  await flush();

  const t = await db.execute("SELECT count(*) AS n FROM contratos_csv");
  const elapsed = ((Date.now() - t0) / 60000).toFixed(1);
  console.log(`\n LISTO. Total filas insertadas: ${t.rows[0].n} | descartadas: ${descartadas} | tiempo: ${elapsed} min`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
