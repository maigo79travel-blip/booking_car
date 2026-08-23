import { cookies } from "next/headers";
import { getSupabaseUser, supabaseRest } from "./supabase";

export async function requireAdmin() {
  const token = (await cookies()).get("booking-admin-session")?.value;
  if (!token) throw new Error("UNAUTHORIZED");
  const user = await getSupabaseUser(token);
  if (!user) throw new Error("UNAUTHORIZED");
  const profiles = await supabaseRest<{ role: string }[]>(`profiles?id=eq.${user.id}&select=role`);
  if (profiles[0]?.role !== "admin") throw new Error("FORBIDDEN");
  return user;
}
