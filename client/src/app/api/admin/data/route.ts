import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    await requireAdmin();
    const [posts, routes, content, bookings] = await Promise.all([
      query("SELECT * FROM public.posts ORDER BY updated_at DESC"),
      query("SELECT * FROM public.price_routes ORDER BY sort_order ASC"),
      query("SELECT * FROM public.site_content ORDER BY content_key ASC"),
      query("SELECT * FROM public.bookings ORDER BY created_at DESC LIMIT 200"),
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

    const keys = Object.keys(data);
    if (keys.length === 0) {
      return NextResponse.json({ message: "No data to update" }, { status: 400 });
    }

    const setClauses = keys.map((key, index) => `"${key}" = $${index + 1}`).join(", ");
    const values = keys.map((key) => {
      const val = data[key];
      if (typeof val === "object" && val !== null) {
        return JSON.stringify(val);
      }
      return val;
    });

    values.push(id);
    const sql = `UPDATE public.${table} SET ${setClauses}, updated_at = now() WHERE id = $${values.length} RETURNING *`;
    const rows = await query(sql, values);

    return NextResponse.json(rows[0] || { success: true });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json(
      { message: "Không thể lưu dữ liệu" },
      { status: 500 }
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

    const keys = Object.keys(data);
    const columnNames = keys.map((k) => `"${k}"`).join(", ");
    const valuePlaceholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const values = keys.map((key) => {
      const val = data[key];
      if (typeof val === "object" && val !== null) {
        return JSON.stringify(val);
      }
      return val;
    });

    const sql = `INSERT INTO public.${table} (${columnNames}) VALUES (${valuePlaceholders}) RETURNING *`;
    const rows = await query(sql, values);

    return NextResponse.json(rows[0] || { success: true });
  } catch (error) {
    console.error("POST error:", error);
    return NextResponse.json(
      { message: "Không thể tạo dữ liệu" },
      { status: 500 }
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

    await query(`DELETE FROM public.${table} WHERE id = $1`, [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { message: "Không thể xóa dữ liệu" },
      { status: 500 }
    );
  }
}
