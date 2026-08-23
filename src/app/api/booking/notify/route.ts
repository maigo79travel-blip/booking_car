import { NextResponse } from "next/server";
import { query } from "@/lib/server/db";

export const runtime = "nodejs";

type BookingPayload = {
  customerName?: string;
  customer_name?: string;
  customerPhone?: string;
  phone_number?: string;
  fromLocation?: string;
  from_location?: string;
  toLocation?: string;
  to_location?: string;
  carType?: string;
  car_type?: string;
  tripDate?: string;
  trip_date?: string;
  tripTime?: string;
  trip_time?: string;
  wayType?: string;
  way_type?: string;
  tripType?: string;
  trip_type?: string;
  distanceKm?: number;
  distance_km?: number;
  price?: number;
  total_price?: number;
};

function formatTelegramMessage(data: {
  customerName: string;
  customerPhone: string;
  fromLocation: string;
  toLocation: string;
  carType: string;
  tripDate: string;
  tripTime: string;
  wayType: string;
  tripType: string;
  distanceKm: number;
  totalPrice: number;
}) {
  const serviceType =
    data.tripType === "airport"
      ? "✈️ Xe đưa đón Sân bay Cam Ranh"
      : "🛣️ Xe đường dài / Tour liên tỉnh";

  const wayText =
    data.wayType === "two-way" || data.wayType === "round_trip"
      ? "🔄 Khứ hồi (2 chiều)"
      : "➡️ Một chiều";

  const formattedPrice =
    data.totalPrice > 0
      ? `${data.totalPrice.toLocaleString("vi-VN")} đ`
      : "Liên hệ báo giá";

  const distanceText =
    data.distanceKm > 0 ? `~${data.distanceKm} km` : "Theo lộ trình";

  const nowStr = new Date().toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return [
    "🔔 <b>CÓ ĐƠN ĐẶT XE MỚI - MAIGO79.COM</b>",
    "━━━━━━━━━━━━━━━━━━━━━━━━━",
    "👤 <b>THÔNG TIN KHÁCH HÀNG:</b>",
    `• Họ và tên: <b>${data.customerName}</b>`,
    `• Số điện thoại: <b><a href="tel:${data.customerPhone}">${data.customerPhone}</a></b>`,
    "",
    "🚗 <b>DỊCH VỤ & LOẠI XE:</b>",
    `• Loại dịch vụ: <b>${serviceType}</b>`,
    `• Loại xe: <b>${data.carType}</b>`,
    `• Hình thức di chuyển: <b>${wayText}</b>`,
    "",
    "📍 <b>LỘ TRÌNH DI CHUYỂN:</b>",
    `• Điểm đón: <b>${data.fromLocation}</b>`,
    `• Điểm đến: <b>${data.toLocation}</b>`,
    `• Quãng đường dự kiến: <b>${distanceText}</b>`,
    "",
    "⏰ <b>THỜI GIAN ĐÓN:</b>",
    `• Giờ đón: <b>${data.tripTime}</b>`,
    `• Ngày đón: <b>${data.tripDate}</b>`,
    "",
    "💰 <b>CƯỚC PHÍ DỰ KIẾN:</b>",
    `• Tổng tiền: <b>${formattedPrice}</b> (Trọn gói)`,
    "━━━━━━━━━━━━━━━━━━━━━━━━━",
    `⏱ <i>Thời gian đặt: ${nowStr}</i>`,
    "⚡ <b>Vui lòng liên hệ với khách hàng sớm nhất để xác nhận chuyến đi!</b>",
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const raw = (await request.json()) as BookingPayload;

    const customerName = (raw.customer_name || raw.customerName || "").trim();
    const customerPhone = (raw.phone_number || raw.customerPhone || "").trim();
    const fromLocation = (raw.from_location || raw.fromLocation || "").trim();
    const toLocation = (raw.to_location || raw.toLocation || "").trim();
    const carType = (raw.car_type || raw.carType || "5 chỗ").trim();
    const tripDate = (raw.trip_date || raw.tripDate || new Date().toISOString().split("T")[0]).trim();
    const tripTime = (raw.trip_time || raw.tripTime || "08:00").trim();
    const wayType = (raw.way_type || raw.wayType || "one-way").trim();
    const tripType = (raw.trip_type || raw.tripType || "airport").trim();
    const distanceKm = Number(raw.distance_km || raw.distanceKm || 0);
    const totalPrice = Number(raw.total_price || raw.price || 0);

    if (!customerName || !customerPhone) {
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
        customerName,
        customerPhone,
        fromLocation,
        toLocation,
        carType,
        tripDate,
        tripTime,
        wayType,
        totalPrice,
      ]
    );

    // 1. Get Telegram Config from DB (site_content) or process.env with default fallback
    let isEnabled = true;
    let botToken =
      process.env.TELEGRAM_BOT_TOKEN ||
      "8618729009:AAFdooRLIgp4g1e0P9Vs7l9qATid-8cIPt4";
    let chatId = process.env.TELEGRAM_CHAT_ID || "5728513036";
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
    } catch (e) {
      console.error("Error reading telegram_config:", e);
    }

    // 2. Send Telegram Message with FULL FORM DATA (Awaited to ensure delivery)
    if (isEnabled && botToken && chatId) {
      const messageText = formatTelegramMessage({
        customerName,
        customerPhone,
        fromLocation: fromLocation || "Theo thỏa thuận",
        toLocation: toLocation || "Theo thỏa thuận",
        carType: carType.includes("chỗ") ? carType : `Xe ${carType} chỗ`,
        tripDate,
        tripTime,
        wayType,
        tripType,
        distanceKm,
        totalPrice,
      });

      const payload: Record<string, unknown> = {
        chat_id: chatId,
        text: messageText,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      };

      if (topicId) {
        payload.message_thread_id = Number(topicId);
      }

      try {
        const teleRes = await fetch(
          `https://api.telegram.org/bot${botToken}/sendMessage`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          }
        );
        const teleData = await teleRes.json();
        if (!teleRes.ok || !teleData.ok) {
          console.error("Telegram send message failed:", teleData);
        } else {
          console.log("Telegram notification sent successfully to chat:", chatId);
        }
      } catch (teleErr) {
        console.error("Failed to send Telegram message:", teleErr);
      }
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
