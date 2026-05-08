// Sube ~50 filas sample del CSV a Turso. Más adelante subimos todo.
//
// Uso:
//   node scripts/seed_turso_sample.mjs <ruta_al_csv> [N=50]

import fs from "node:fs";
import readline from "node:readline";
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
  fecha_de_firma      TEXT,
  valor_del_contrato  REAL,
  proveedor           TEXT,
  documento_proveedor TEXT
);
`;

const cleanMoney = (s) => {
  if (s == null || s === "") return 0;
  const v = parseFloat(String(s).replace(/[$,\s]/g, ""));
  return Number.isFinite(v) ? v : 0;
};

// CSV parser muy simple — el SECOP usa comma + comillas dobles para quoting.
function parseCsvLine(line) {
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) {
      if (c === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (c === '"') {
        inQ = false;
      } else cur += c;
    } else {
      if (c === '"') inQ = true;
      else if (c === ",") {
        out.push(cur);
        cur = "";
      } else cur += c;
    }
  }
  out.push(cur);
  return out;
}

async function main() {
  const csvPath = process.argv[2];
  const N = parseInt(process.argv[3] || "50", 10);
  if (!csvPath) {
    console.error("Uso: node scripts/seed_turso_sample.mjs <csv> [N]");
    process.exit(1);
  }

  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    console.error("Faltan TURSO_DATABASE_URL / TURSO_AUTH_TOKEN");
    process.exit(1);
  }

  const db = createClient({ url, authToken });
  console.log("[1/3] Creando schema...");
  await db.execute(SCHEMA);

  console.log(`[2/3] Leyendo ${N} filas del CSV...`);
  const rl = readline.createInterface({
    input: fs.createReadStream(csvPath, { encoding: "utf-8" }),
    crlfDelay: Infinity,
  });
  let header = null;
  let rows = [];
  for await (const line of rl) {
    if (!header) {
      header = parseCsvLine(line);
      continue;
    }
    if (rows.length >= N) break;
    const cells = parseCsvLine(line);
    if (cells.length < header.length) continue;
    const r = Object.fromEntries(header.map((h, i) => [h, cells[i]]));
    rows.push(r);
  }
  rl.close();
  console.log(`      filas leídas: ${rows.length}`);

  console.log("[3/3] Insertando en Turso...");
  let n = 0;
  for (const r of rows) {
    try {
      await db.execute({
        sql: `INSERT OR REPLACE INTO contratos_csv (
          id_contrato, nombre_entidad, nit_entidad, departamento, ciudad,
          modalidad, tipo_contrato, estado_contrato, es_pyme,
          fecha_de_firma, valor_del_contrato, proveedor, documento_proveedor
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          r["ID Contrato"] || "",
          r["Nombre Entidad"] || "",
          r["Nit Entidad"] || "",
          r["Departamento"] || "",
          r["Ciudad"] || "",
          r["Modalidad de Contratacion"] || "",
          r["Tipo de Contrato"] || "",
          r["Estado Contrato"] || "",
          r["Es Pyme"] || "",
          r["Fecha de Firma"] || "",
          cleanMoney(r["Valor del Contrato"]),
          r["Proveedor Adjudicado"] || "",
          r["Documento Proveedor"] || "",
        ],
      });
      n++;
    } catch (e) {
      console.warn(`  fila ${n}: ${e.message}`);
    }
  }

  const t = await db.execute("SELECT count(*) AS n FROM contratos_csv");
  console.log(`      insertadas: ${n}`);
  console.log(`      total en tabla: ${t.rows[0].n}`);
  console.log("Listo.");
}

main().catch((e) => {
  console.error("ERROR:", e);
  process.exit(1);
});
