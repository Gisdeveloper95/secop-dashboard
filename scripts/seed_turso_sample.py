"""Sube 50 filas sample del CSV a Turso para que el dashboard tenga algo
mientras subimos el dataset completo.

Uso:
    python scripts/seed_turso_sample.py "ruta\\al\\csv"

Crea la tabla `contratos_csv` con las columnas mínimas usadas por el
endpoint /api/turso/contratos.
"""
from __future__ import annotations

import os
import sys
from pathlib import Path

import pandas as pd

try:
    import libsql_experimental as libsql
except ImportError:
    print("pip install libsql-experimental")
    sys.exit(1)


SCHEMA_SQL = """
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
"""


def clean_money(s) -> float:
    if pd.isna(s):
        return 0.0
    s = str(s).strip().replace("$", "").replace(",", "").replace(" ", "")
    try:
        return float(s)
    except ValueError:
        return 0.0


def main() -> None:
    if len(sys.argv) < 2:
        sys.exit("Uso: python scripts/seed_turso_sample.py <ruta_csv>")

    csv_path = Path(sys.argv[1]).resolve()
    if not csv_path.exists():
        sys.exit(f"No existe: {csv_path}")

    url = os.environ.get("TURSO_DATABASE_URL")
    auth_token = os.environ.get("TURSO_AUTH_TOKEN")
    if not url or not auth_token:
        sys.exit("Configura TURSO_DATABASE_URL y TURSO_AUTH_TOKEN en el entorno")

    print(f"[1/3] Leyendo CSV (primeras 50 filas)...")
    df = pd.read_csv(csv_path, low_memory=False, nrows=50)
    print(f"      filas: {len(df)} cols: {df.shape[1]}")

    print("[2/3] Conectando a Turso...")
    conn = libsql.connect("seed.db", sync_url=url, auth_token=auth_token)
    conn.execute(SCHEMA_SQL)

    print("[3/3] Insertando 50 filas sample...")
    insert_sql = """
        INSERT OR REPLACE INTO contratos_csv (
            id_contrato, nombre_entidad, nit_entidad, departamento, ciudad,
            modalidad, tipo_contrato, estado_contrato, es_pyme,
            fecha_de_firma, valor_del_contrato, proveedor, documento_proveedor
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """
    n = 0
    for _, r in df.iterrows():
        try:
            conn.execute(
                insert_sql,
                (
                    str(r.get("ID Contrato", "")),
                    str(r.get("Nombre Entidad", "")),
                    str(r.get("Nit Entidad", "")),
                    str(r.get("Departamento", "")),
                    str(r.get("Ciudad", "")),
                    str(r.get("Modalidad de Contratacion", "")),
                    str(r.get("Tipo de Contrato", "")),
                    str(r.get("Estado Contrato", "")),
                    str(r.get("Es Pyme", "")),
                    str(r.get("Fecha de Firma", "")),
                    clean_money(r.get("Valor del Contrato")),
                    str(r.get("Proveedor Adjudicado", "")),
                    str(r.get("Documento Proveedor", "")),
                ),
            )
            n += 1
        except Exception as e:
            print(f"  fila {n}: {e}")
    conn.commit()
    conn.sync()

    cur = conn.execute("SELECT count(*) FROM contratos_csv")
    print(f"      total en tabla tras insert: {cur.fetchone()[0]}")
    print("Listo.")


if __name__ == "__main__":
    main()
