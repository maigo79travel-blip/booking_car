import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin";
import { supabaseRest } from "@/lib/server/supabase";

export async function GET() {
  try {
    await requireAdmin();
    const [posts, routes, content, bookings] = await Promise.all([
      supabaseRest("posts?order=updated_at.desc"),
      supabaseRest("price_routes?order=sort_order"),
      supabaseRest("site_content?order=content_key"),
      supabaseRest("bookings?order=created_at.desc&limit=200"),
    ]);
    return NextResponse.json({ posts, routes, content, bookings });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNAUTHORIZED";
    return NextResponse.json(
      { message },
      { status: message === "UNAUTHORIZED" ? 401 : 403 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    await requireAdmin();
    const { table, id, data } = await request.json();
    if (
      !["posts", "price_routes", "site_content", "bookings"].includes(table) ||
      !id ||
      !data
    ) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
    const rows = await supabaseRest<Record<string, unknown>[]>(
      `${table}?id=eq.${id}`,
      {
        method: "PATCH",
        body: JSON.stringify(data),
      }
    );
    return NextResponse.json(rows[0] || { success: true });
  } catch {
    return NextResponse.json(
      { message: "Không thể lưu dữ liệu" },
      { status: 403 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { table, data } = await request.json();
    if (!["posts", "price_routes", "site_content"].includes(table) || !data) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }
    const rows = await supabaseRest<Record<string, unknown>[]>(table, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return NextResponse.json(rows[0] || { success: true });
  } catch {
    return NextResponse.json(
      { message: "Không thể tạo dữ liệu" },
      { status: 403 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(request.url);
    const table = searchParams.get("table");
    const id = searchParams.get("id");

    if (
      !table ||
      !id ||
      !["posts", "price_routes", "site_content", "bookings"].includes(table)
    ) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    await supabaseRest(`${table}?id=eq.${id}`, {
      method: "DELETE",
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Không thể xóa dữ liệu" },
      { status: 403 }
    );
  }
}
