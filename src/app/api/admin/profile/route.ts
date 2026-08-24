import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query, verifySessionToken, createSessionToken } from "@/lib/server/db";

export const runtime = "nodejs";

// GET current admin profile
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("booking-admin-session")?.value;
    if (!token) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ message: "Phiên đăng nhập hết hạn" }, { status: 401 });
    }

    const rows = await query<{
      id: string;
      email: string;
      role: string;
      display_name: string | null;
      phone: string | null;
      avatar_url: string | null;
    }>(
      `SELECT u.id, u.email, p.role, p.display_name, p.phone, p.avatar_url
       FROM auth.users u
       LEFT JOIN public.profiles p ON u.id = p.id
       WHERE u.id = $1::uuid OR LOWER(u.email) = LOWER($2)`,
      [session.userId, session.email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ message: "Không tìm thấy thông tin tài khoản" }, { status: 404 });
    }

    const user = rows[0];
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role || "admin",
      display_name: user.display_name || "Admin maigo79.com",
      phone: user.phone || "0928015280",
      avatar_url: user.avatar_url || "",
    });
  } catch (error) {
    console.error("Get admin profile error:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: `Lỗi: ${errMsg}` }, { status: 500 });
  }
}

// UPDATE admin profile or password
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("booking-admin-session")?.value;
    if (!token) {
      return NextResponse.json({ message: "Chưa đăng nhập" }, { status: 401 });
    }

    const session = verifySessionToken(token);
    if (!session) {
      return NextResponse.json({ message: "Phiên đăng nhập hết hạn" }, { status: 401 });
    }

    const body = await request.json();
    const {
      display_name,
      phone,
      avatar_url,
      new_email,
      current_password,
      new_password,
    } = body;

    // 1. Fetch current user from DB
    const users = await query<{ id: string; email: string; encrypted_password: string }>(
      `SELECT u.id, u.email, u.encrypted_password
       FROM auth.users u
       WHERE u.id = $1::uuid OR LOWER(u.email) = LOWER($2)`,
      [session.userId, session.email]
    );

    if (users.length === 0) {
      return NextResponse.json({ message: "Tài khoản không tồn tại" }, { status: 404 });
    }

    const user = users[0];

    // 2. If changing password or email, verify current password first
    if (new_password || (new_email && new_email !== user.email)) {
      if (!current_password) {
        return NextResponse.json(
          { message: "Vui lòng nhập mật khẩu hiện tại để xác nhận thay đổi bảo mật" },
          { status: 400 }
        );
      }

      // Check current password
      const checkPass = await query<{ id: string }>(
        `SELECT id FROM auth.users 
         WHERE id = $1::uuid AND encrypted_password = extensions.crypt($2, encrypted_password)`,
        [user.id, current_password]
      );

      if (checkPass.length === 0) {
        return NextResponse.json(
          { message: "Mật khẩu hiện tại không chính xác" },
          { status: 400 }
        );
      }
    }

    // 3. Update password if requested
    if (new_password) {
      if (new_password.length < 6) {
        return NextResponse.json(
          { message: "Mật khẩu mới phải có ít nhất 6 ký tự" },
          { status: 400 }
        );
      }

      await query(
        `UPDATE auth.users 
         SET encrypted_password = extensions.crypt($1, extensions.gen_salt('bf')),
             updated_at = now()
         WHERE id = $2::uuid`,
        [new_password, user.id]
      );
    }

    // 4. Update email if changed
    let updatedEmail = user.email;
    if (new_email && new_email.trim().toLowerCase() !== user.email.toLowerCase()) {
      const emailFormatted = new_email.trim().toLowerCase();
      // Check if email already exists
      const existing = await query<{ id: string }>(
        `SELECT id FROM auth.users WHERE LOWER(email) = LOWER($1) AND id != $2::uuid`,
        [emailFormatted, user.id]
      );
      if (existing.length > 0) {
        return NextResponse.json(
          { message: "Email này đã được sử dụng bởi một tài khoản khác" },
          { status: 400 }
        );
      }

      await query(
        `UPDATE auth.users SET email = $1, updated_at = now() WHERE id = $2::uuid`,
        [emailFormatted, user.id]
      );
      updatedEmail = emailFormatted;
    }

    // 5. Update profiles table
    await query(
      `INSERT INTO public.profiles (id, role, display_name, phone, avatar_url)
       VALUES ($1::uuid, 'admin', $2, $3, $4)
       ON CONFLICT (id) DO UPDATE
       SET display_name = EXCLUDED.display_name,
           phone = EXCLUDED.phone,
           avatar_url = EXCLUDED.avatar_url`,
      [
        user.id,
        display_name || "Admin maigo79.com",
        phone || "",
        avatar_url || "",
      ]
    );

    // 6. Refresh session token with updated info
    const newToken = createSessionToken(user.id, updatedEmail);
    const response = NextResponse.json({
      success: true,
      message: "Cập nhật thông tin tài khoản thành công!",
      profile: {
        id: user.id,
        email: updatedEmail,
        display_name: display_name || "Admin maigo79.com",
        phone: phone || "",
        avatar_url: avatar_url || "",
      },
    });

    response.cookies.set("booking-admin-session", newToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });

    return response;
  } catch (error) {
    console.error("Update admin profile error:", error);
    const errMsg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ message: `Lỗi cập nhật: ${errMsg}` }, { status: 500 });
  }
}
