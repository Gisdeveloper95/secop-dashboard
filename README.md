# SECOP II — Dashboard forense

Dashboard del equipo **Master Minds** para el Hackathon Nacional Colombia 5.0.
Consume tres datasets oficiales de contratación pública (SECOP II) y muestra
las respuestas a las preguntas de la Ronda 1 y Ronda 2 con sus queries SoQL
reales para que cualquiera pueda reproducirlas.

## Datasets y APIs

| # | Dataset | ID | Fuente | Endpoint |
|---|---|---|---|---|
| 1 | SECOP II — Contratos Electrónicos | `jbjy-vk9h` | Socrata (datos.gov.co) | `/api/socrata/jbjy-vk9h` |
| 2 | SECOP II — Archivos Descarga Desde 2025 | `dmgg-8hin` | Socrata (datos.gov.co) | `/api/socrata/dmgg-8hin` |
| 3 | CSV — Snapshot 2025 | local | **Turso (libSQL)** | `/api/turso/contratos` |

## Stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS con paleta **Sentinel forense** (carbón #0c1118 + terracota #d97757 + Fraunces serif)
- libSQL client (`@libsql/client`) para conectar a Turso
- Vercel para deploy

## Setup local

```bash
npm install
cp .env.example .env.local        # llenar las 4 variables
npm run dev                       # http://localhost:3000
```

Variables `.env.local`:

```
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=<jwt token>
SOCRATA_API_KEY_ID=<api key id>
SOCRATA_API_KEY_SECRET=<api key secret>
```

## Subir sample a Turso

```bash
pip install libsql-experimental pandas
$env:TURSO_DATABASE_URL="libsql://..."
$env:TURSO_AUTH_TOKEN="..."
python scripts/seed_turso_sample.py "ruta\al\csv"
```

## Deploy a Vercel

1. `vercel link`
2. Configurar las 4 variables de entorno en el dashboard de Vercel.
3. `vercel --prod`.

## Estructura

```
app/
  api/
    socrata/[dataset]/route.ts   # proxy SoQL para datasets 1 y 2
    turso/contratos/route.ts     # consume Turso (dataset 3)
  page.tsx                       # página principal con todas las respuestas
  layout.tsx
  globals.css
components/
  Card.tsx                       # RespuestaCard + Section editorial
lib/
  datasets.ts                    # catálogo de los 3 datasets
  respuestas.ts                  # respuestas precomputadas (Ronda 1 + 2)
  turso.ts                       # cliente libSQL singleton
scripts/
  seed_turso_sample.py           # sube 50 filas sample del CSV
```

## Reproducir respuestas

Las queries que generaron cada respuesta están listadas en `lib/respuestas.ts`
y también aparecen en cada card del dashboard. Ejemplos:

- **Total de contratos jbjy-vk9h** = `5,614,448`
  ```sql
  SELECT count(*)
  ```
- **Top 5 tipos de contrato CSV 2025**:
  ```sql
  SELECT tipo_contrato, count(*) AS n FROM contratos_csv
  GROUP BY tipo_contrato ORDER BY n DESC LIMIT 5
  ```

## Equipo

Master Minds — Hackathon Nacional Colombia 5.0 — 2026.
