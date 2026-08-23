import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const rows = await query<{ content_key: string; value: unknown }>(
      `SELECT content_key, value
       FROM public.site_content
       WHERE content_key NOT IN ('cloudinary_config', 'telegram_config')`
    );
    const contentMap: Record<string, unknown> = {};
    for (const row of rows) {
      contentMap[row.content_key] = row.value;
    }
    return NextResponse.json(contentMap, {
      headers: {
        "Cache-Control": "public, s-maxage=10, stale-while-revalidate=59",
      },
    });
  } catch (error) {
    console.error("Error fetching site content API:", error);
    return NextResponse.json({}, { status: 500 });
  }
}
