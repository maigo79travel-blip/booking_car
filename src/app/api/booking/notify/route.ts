import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";

type BookingPayload = {
  customerName?: string;
  customerPhone?: string;
  fromLocation?: string;
  toLocation?: string;
  carType?: string;
  tripDate?: string;
  tripTime?: string;
  wayType?: string;
  price?: number;
};

function telegramMessage(
  data: Required<Pick<BookingPayload, "customerName" | "customerPhone">> &
    BookingPayload
) {
  const tripType =
    data.wayType === "two-way" || data.wayType === "round_trip"
      ? "Khứ hồi (2 chiều)"
      : "Một chiều";
  const formattedPrice =
    Number(data.price || 0) > 0
      ? `${Number(data.price).toLocaleString("vi-VN")} đ`
      : "Liên hệ báo giá";

  return [
    "🔔 <b>CÓ ĐƠN ĐẶT XE MỚI - MAIGO79.COM</b>",
    "━━━━━━━━━━━━━━━━━━━━━━",
    "👤 <b>THÔNG TIN KHÁCH HÀNG:</b>",
    `• Họ tên: <b>${data.customerName}</b>`,
    `• Điện thoại: <b>${data.customerPhone}</b>`,
    "",
    "📍 <b>LỘ TRÌNH ĐẶT XE:</b>",
    `• Điểm đón: <b>${data.fromLocation || "-"}</b>`,
    `• Điểm đến: <b>${data.toLocation || "-"}</b>`,
    "",
    "🕒 <b>CHI TIẾT CHUYẾN ĐI:</b>",
    `• Thời gian đón: <b>${data.tripTime || "08:00"}</b> - Ngày: <b>${data.tripDate || "-"}</b>`,
    `• Loại xe: <b>Xe ${data.carType || "5"} chỗ</b>`,
    `• Hình thức: <b>${tripType}</b>`,
    `• Giá dự kiến: <b>${formattedPrice}</b>`,
    "━━━━━━━━━━━━━━━━━━━━━━",
    "⚡ <i>Vui lòng liên hệ với khách hàng sớm nhất để xác nhận chuyến đi!</i>",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as BookingPayload;
    if (!data.customerName?.trim() || !data.customerPhone?.trim()) {
      return NextResponse.json(
        { success: false, message: "Thiếu thông tin khách hàng" },
        { status: 400 }
      );
    }

    // Save to Database
    await query(
      `INSERT INTO public.bookings
        (customer_name, phone_number, from_location, to_location, car_type, trip_date, trip_time, way_type, total_price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        data.customerName.trim(),
        data.customerPhone.trim(),
        data.fromLocation || "",
        data.toLocation || "",
        data.carType || "5",
        data.tripDate || new Date().toISOString().split("T")[0],
        data.tripTime || "08:00",
        data.wayType || "one-way",
        Number(data.price || 0),
      ]
    );

    // 1. Get Telegram Config from DB (site_content) or process.env
    let isEnabled = true;
    let botToken = process.env.TELEGRAM_BOT_TOKEN || "";
    let chatId = process.env.TELEGRAM_CHAT_ID || "";
    let topicId = "";

    try {
      const configRows = await query<{
        value: {
          is_enabled?: boolean;
          bot_token?: string;
          chat_id?: string;
          topic_id?: string;
        };
      }>(
        "SELECT value FROM public.site_content WHERE content_key = 'telegram_config' LIMIT 1"
      );
      if (configRows.length > 0 && configRows[0].value) {
        const val = configRows[0].value;
        if (val.is_enabled !== undefined) isEnabled = Boolean(val.is_enabled);
        if (val.bot_token) botToken = val.bot_token.trim();
        if (val.chat_id) chatId = val.chat_id.trim();
        if (val.topic_id) topicId = val.topic_id.trim();
      }
    } catch {
      // ignore
    }

    // 2. Send Telegram Message if configured
    if (isEnabled && botToken && chatId) {
      const payload: Record<string, unknown> = {
        chat_id: chatId,
        text: telegramMessage(
          data as Required<
            Pick<BookingPayload, "customerName" | "customerPhone">
          > &
            BookingPayload
        ),
        parse_mode: "HTML",
        disable_web_page_preview: true,
      };

      if (topicId) {
        payload.message_thread_id = Number(topicId);
      }

      fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }).catch((err) => {
        console.error("Async Telegram notification error:", err);
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Booking notification failed", error);
    return NextResponse.json(
      { success: false, message: "Unable to process booking" },
      { status: 500 }
    );
  }
}
