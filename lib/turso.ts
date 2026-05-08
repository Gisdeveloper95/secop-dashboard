import { createClient, type Client } from "@libsql/client";

let _client: Client | null = null;

export function getTurso(): Client {
  if (_client) return _client;
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;
  if (!url || !authToken) {
    throw new Error(
      "Faltan TURSO_DATABASE_URL / TURSO_AUTH_TOKEN. Configura en .env.local o Vercel.",
    );
  }
  _client = createClient({ url, authToken });
  return _client;
}
