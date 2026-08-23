import "server-only";
import { cookies } from "next/headers";
import { verifySessionToken, query } from "./db";

export async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get("booking-admin-session")?.value;
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const session = verifySessionToken(token);
  if (!session) {
    throw new Error("UNAUTHORIZED");
  }

  const profiles = await query<{ role: string }>(
    "SELECT role FROM public.profiles WHERE id = $1",
    [session.userId]
  );

  if (profiles.length === 0 || profiles[0].role !== "admin") {
    throw new Error("FORBIDDEN");
  }

  return session;
}
