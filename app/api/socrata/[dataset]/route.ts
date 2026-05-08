import { NextRequest } from "next/server";

// Proxy a Socrata SoQL para los 2 datasets públicos.
// Uso: /api/socrata/jbjy-vk9h?$query=SELECT count(*)
//      /api/socrata/dmgg-8hin?$query=SELECT count(*)

const ALLOWED = new Set(["jbjy-vk9h", "dmgg-8hin"]);

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ dataset: string }> },
) {
  const { dataset } = await params;
  if (!ALLOWED.has(dataset)) {
    return Response.json({ error: "dataset no permitido" }, { status: 400 });
  }

  const sp = req.nextUrl.searchParams;
  const url = new URL(`https://www.datos.gov.co/resource/${dataset}.json`);
  sp.forEach((v, k) => url.searchParams.set(k, v));

  const id = process.env.SOCRATA_API_KEY_ID;
  const secret = process.env.SOCRATA_API_KEY_SECRET;
  const headers: Record<string, string> = { Accept: "application/json" };
  if (id && secret) {
    headers.Authorization = "Basic " + Buffer.from(`${id}:${secret}`).toString("base64");
  }

  try {
    const r = await fetch(url, { headers, next: { revalidate: 300 } });
    const data = await r.json();
    return Response.json(data, { status: r.status });
  } catch (e: unknown) {
    return Response.json(
      { error: "fetch failed", detalle: e instanceof Error ? e.message : String(e) },
      { status: 500 },
    );
  }
}
