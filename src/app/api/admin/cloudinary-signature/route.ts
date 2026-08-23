import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireAdmin();

    let folder = "maigo79";
    try {
      const body = await request.json().catch(() => ({}));
      if (body.folder) folder = body.folder;
    } catch {
      // ignore
    }

    let cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
    let apiKey = process.env.CLOUDINARY_API_KEY || "";
    let apiSecret = process.env.CLOUDINARY_API_SECRET || "";
    let uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "";

    try {
      const rows = await query<{ value: { cloud_name?: string; api_key?: string; api_secret?: string; upload_preset?: string } }>(
        "SELECT value FROM public.site_content WHERE content_key = 'cloudinary_config' LIMIT 1"
      );
      if (rows.length > 0 && rows[0].value) {
        const val = rows[0].value;
        if (val.cloud_name) cloudName = val.cloud_name;
        if (val.api_key) apiKey = val.api_key;
        if (val.api_secret) apiSecret = val.api_secret;
        if (val.upload_preset) uploadPreset = val.upload_preset;
      }
    } catch {
      // ignore
    }

    if (!cloudName) {
      return NextResponse.json(
        { message: "Chưa cấu hình Cloudinary trong trang Admin" },
        { status: 400 }
      );
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = createHash("sha1")
      .update(stringToSign)
      .digest("hex");

    return NextResponse.json({
      cloudName,
      apiKey,
      timestamp,
      folder,
      signature,
      uploadPreset,
    });
  } catch (error) {
    console.error("Signature error:", error);
    return NextResponse.json(
      { message: "Không thể tạo chữ ký tải ảnh" },
      { status: 500 }
    );
  }
}
