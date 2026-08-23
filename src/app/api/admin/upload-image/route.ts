import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin";
import { query } from "@/lib/server/db";
import crypto from "crypto";

export const runtime = "nodejs";

// Max file size: 10MB
export const maxDuration = 30;

export async function POST(request: Request) {
  try {
    await requireAdmin();

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "maigo79";

    if (!file) {
      return NextResponse.json(
        { message: "Không tìm thấy file ảnh" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/jpeg";
    const dataUri = `data:${mimeType};base64,${base64}`;

    // 1. Get Cloudinary Config from DB (site_content) or process.env
    let cloudName = process.env.CLOUDINARY_CLOUD_NAME || "";
    let apiKey = process.env.CLOUDINARY_API_KEY || "";
    let apiSecret = process.env.CLOUDINARY_API_SECRET || "";
    let uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET || "";

    try {
      const configRows = await query(
        "SELECT value FROM public.site_content WHERE content_key = 'cloudinary_config' LIMIT 1"
      );
      if (configRows.length > 0 && configRows[0].value) {
        const val = configRows[0].value;
        if (val.cloud_name) cloudName = val.cloud_name;
        if (val.api_key) apiKey = val.api_key;
        if (val.api_secret) apiSecret = val.api_secret;
        if (val.upload_preset) uploadPreset = val.upload_preset;
      }
    } catch {
      // ignore
    }

    // 2. If Cloudinary credentials exist, upload to Cloudinary API
    if (cloudName && (apiSecret || uploadPreset)) {
      const timestamp = Math.floor(Date.now() / 1000);
      const cloudinaryFormData = new FormData();
      cloudinaryFormData.append("file", dataUri);
      cloudinaryFormData.append("folder", folder);

      if (uploadPreset) {
        cloudinaryFormData.append("upload_preset", uploadPreset);
      } else if (apiKey && apiSecret) {
        cloudinaryFormData.append("api_key", apiKey);
        cloudinaryFormData.append("timestamp", timestamp.toString());
        const stringToSign = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
        const signature = crypto
          .createHash("sha1")
          .update(stringToSign)
          .digest("hex");
        cloudinaryFormData.append("signature", signature);
      }

      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: cloudinaryFormData,
        }
      );

      if (uploadRes.ok) {
        const result = await uploadRes.json();
        return NextResponse.json({
          success: true,
          url: result.secure_url || result.url,
          public_id: result.public_id,
          width: result.width,
          height: result.height,
          provider: "cloudinary",
        });
      } else {
        const errText = await uploadRes.text();
        console.error("Cloudinary upload failed:", errText);
      }
    }

    // 3. Fallback: Return data URI if Cloudinary is not configured yet
    return NextResponse.json({
      success: true,
      url: dataUri,
      provider: "local_base64",
      warning: !cloudName
        ? "Vui lòng cấu hình Cloudinary trong trang Quản trị để lưu trữ ảnh vĩnh viễn trên đám mây!"
        : undefined,
    });
  } catch (error: any) {
    console.error("Image upload error:", error);
    return NextResponse.json(
      { message: error.message || "Lỗi khi tải ảnh lên" },
      { status: 500 }
    );
  }
}
