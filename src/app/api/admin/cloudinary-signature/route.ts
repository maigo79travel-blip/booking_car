import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin";

export async function POST() { try { await requireAdmin(); const cloudName = process.env.CLOUDINARY_CLOUD_NAME; const apiKey = process.env.CLOUDINARY_API_KEY; const apiSecret = process.env.CLOUDINARY_API_SECRET; if (!cloudName || !apiKey || !apiSecret) throw new Error("Cloudinary is not configured"); const timestamp = Math.floor(Date.now() / 1000); const folder = "booking-car"; const signature = createHash("sha1").update(`folder=${folder}&timestamp=${timestamp}${apiSecret}`).digest("hex"); return NextResponse.json({ cloudName, apiKey, timestamp, folder, signature }); } catch { return NextResponse.json({ message: "Không thể tạo chữ ký tải ảnh" }, { status: 403 }); } }
