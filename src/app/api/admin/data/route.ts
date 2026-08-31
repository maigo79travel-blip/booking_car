import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/server/admin";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";

const editableColumns = {
  posts: new Set(["slug", "title", "excerpt", "body", "seo_title", "seo_description", "cover_image", "status", "published_at", "sort_order"]),
  price_routes: new Set(["origin", "destination", "vehicle_type", "trip_type", "price", "currency", "is_active", "sort_order"]),
  site_content: new Set(["content_key", "content_type", "value"]),
  bookings: new Set(["customer_name", "phone_number", "from_location", "to_location", "car_type", "trip_date", "trip_time", "way_type", "total_price", "status", "note"]),
} as const;

type EditableTable = keyof typeof editableColumns;

function isEditableTable(table: unknown): table is EditableTable {
  return typeof table === "string" && table in editableColumns;
}

function hasOnlyEditableColumns(table: EditableTable, data: Record<string, unknown>) {
  return Object.keys(data).every((key) => editableColumns[table].has(key));
}

function revalidatePosts(post?: { slug?: string }) {
  revalidatePath("/bai-viet");
  if (post?.slug) revalidatePath(`/bai-viet/${post.slug}`);
}

export async function GET() {
  try {
    await requireAdmin();
    const [posts, routes, content, bookings] = await Promise.all([
      query("SELECT * FROM public.posts ORDER BY sort_order ASC NULLS LAST, published_at DESC NULLS LAST, created_at DESC"),
      query("SELECT * FROM public.price_routes ORDER BY sort_order ASC"),
      query("SELECT * FROM public.site_content ORDER BY content_key ASC"),
      query("SELECT * FROM public.bookings ORDER BY created_at DESC"),
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
    if (!isEditableTable(table) || !id || !data || typeof data !== "object" || Array.isArray(data)) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const keys = Object.keys(data);
    if (keys.length === 0 || !hasOnlyEditableColumns(table, data)) {
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

    if (!rows[0]) {
      return NextResponse.json({ message: "Không tìm thấy dữ liệu cần cập nhật" }, { status: 404 });
    }

    if (table === "posts") revalidatePosts(rows[0]);

    return NextResponse.json(rows[0]);
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
    if (!isEditableTable(table) || table === "bookings" || !data || typeof data !== "object" || Array.isArray(data)) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    const payload = { ...data } as Record<string, unknown>;
    if (table === "posts" && payload.sort_order === undefined) {
      const rows = await query<{ next_sort_order: number }>(
        "SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_sort_order FROM public.posts"
      );
      payload.sort_order = rows[0]?.next_sort_order || 1;
    }

    const keys = Object.keys(payload);
    if (keys.length === 0 || !hasOnlyEditableColumns(table, payload)) {
      return NextResponse.json({ message: "Invalid fields" }, { status: 400 });
    }
    const columnNames = keys.map((k) => `"${k}"`).join(", ");
    const valuePlaceholders = keys.map((_, i) => `$${i + 1}`).join(", ");
    const values = keys.map((key) => {
      const val = payload[key];
      if (typeof val === "object" && val !== null) {
        return JSON.stringify(val);
      }
      return val;
    });

    const sql = `INSERT INTO public.${table} (${columnNames}) VALUES (${valuePlaceholders}) RETURNING *`;
    const rows = await query(sql, values);

    if (table === "posts") revalidatePosts(rows[0]);

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
      !isEditableTable(table)
    ) {
      return NextResponse.json({ message: "Invalid request" }, { status: 400 });
    }

    if (table === "posts") {
      const rows = await query<{ slug?: string }>(`DELETE FROM public.posts WHERE id = $1 RETURNING slug`, [id]);
      if (rows[0]) revalidatePosts(rows[0]);
    } else {
      await query(`DELETE FROM public.${table} WHERE id = $1`, [id]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE error:", error);
    return NextResponse.json(
      { message: "Không thể xóa dữ liệu" },
      { status: 500 }
    );
  }
}
