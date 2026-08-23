import "server-only";
import { Pool } from "pg";
import crypto from "crypto";

const connectionString =
  process.env.DIRECT_URL ||
  process.env.DATABASE_URL ||
  "postgresql://postgres.zgpeyypmfskvqlfdanfd:bW.Q%2165SEEpk%3FBu@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

// Singleton pool instance for serverless / node runtime
let pool: Pool | null = null;

export function getDbPool(): Pool {
  if (!pool) {
    pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
    });
  }
  return pool;
}

export async function query<T = any>(text: string, params?: any[]): Promise<T[]> {
  const client = getDbPool();
  const res = await client.query(text, params);
  return res.rows as T[];
}

const SESSION_SECRET =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "maigo79-secure-admin-secret-key-2026-super-safe";

export function createSessionToken(userId: string, email: string): string {
  const payload = JSON.stringify({
    userId,
    email,
    exp: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
  });
  const encoded = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", SESSION_SECRET)
    .update(encoded)
    .digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string): { userId: string; email: string } | null {
  try {
    const [encoded, signature] = token.split(".");
    if (!encoded || !signature) return null;
    const expectedSignature = crypto
      .createHmac("sha256", SESSION_SECRET)
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
