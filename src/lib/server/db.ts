import "server-only";
import { Pool } from "pg";
import crypto from "crypto";

const DEFAULT_DB_URL =
  "postgresql://postgres.qysxwmujksnqxppluxey:bW.Q%2165SEEpk%3FBu@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.DIRECT_URL ||
  DEFAULT_DB_URL;

// Singleton pool instance for serverless / node runtime
let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      // Vercel/build workers can create several isolated pools. Keep this
      // intentionally small for Supabase's session pooler connection limit.
      max: 2,
      connectionTimeoutMillis: 8000,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const client = getDbPool();
  const res = await client.query(text, params);
  return res.rows as T[];
}

const DEFAULT_SECRET =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpncGV5eXBtZnNrdnFsZmRhbmZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NzQ2NDgxMywiZXhwIjoyMTAzMDQwODEzfQ.Wqebj735Qo3M6XztSygCDCvU0jU44tw813-AMNMrTQ0";

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  DEFAULT_SECRET;

function getSessionSecret() {
  return SESSION_SECRET;
}

export function createSessionToken(userId: string, email: string): string {
  const payload = JSON.stringify({
    userId,
    email,
    exp: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSessionSecret())
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string): { userId: string; email: string } | null {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    const expectedSignature = crypto
      .createHmac("sha256", getSessionSecret())
      .update(encoded)
      .digest("base64url");
    if (signature !== expectedSignature) return null;
    const data = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8"));
    if (data.exp < Date.now()) return null;
    return { userId: data.userId, email: data.email };
  } catch {
    return null;
  }
}
