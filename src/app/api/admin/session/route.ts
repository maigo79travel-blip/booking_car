import { NextResponse } from "next/server";
import { query, createSessionToken } from "@/lib/server/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Vui lòng nhập đầy đủ email và mật khẩu" },
        { status: 400 }
      );
    }

    const rows = await query<{ id: string; email: string; role: string }>(
      `SELECT u.id, u.email, p.role
       FROM auth.users u
       JOIN public.profiles p ON u.id = p.id
       WHERE LOWER(u.email) = LOWER($1)
         AND u.encrypted_password = extensions.crypt($2, u.encrypted_password)`,
      [email.trim(), password]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Email hoặc mật khẩu không đúng" },
        { status: 401 }
      );
    }

    const user = rows[0];
    if (user.role !== "admin") {
      return NextResponse.json(
        { message: "Tài khoản không có quyền quản trị" },
        { status: 403 }
      );
    }

    const token = createSessionToken(user.id, user.email);
    const response = NextResponse.json({ ok: true, email: user.email });
    response.cookies.set("booking-admin-session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8, // 8 hours
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { message: "Lỗi hệ thống khi đăng nhập. Vui lòng thử lại." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete("booking-admin-session");
  return response;
}
