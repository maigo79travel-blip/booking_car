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
  return [
    "🚗 <b>ĐẶT XE MỚI</b>",
    "",
    "<b>THÔNG TIN CHUYẾN ĐI</b>",
    `Điểm đi: ${data.fromLocation || "-"}`,
    `Điểm đến: ${data.toLocation || "-"}`,
    `Ngày / giờ: ${data.tripDate || "-"} ${data.tripTime || ""}`,
    `Loại xe: ${data.carType || "-"} chỗ`,
    `Loại vé: ${data.wayType === "two-way" ? "Hai chiều" : "Một chiều"}`,
    `Giá dự kiến: ${(data.price || 0).toLocaleString("vi-VN")}đ`,
    "",
    "<b>KHÁCH HÀNG</b>",
    `Họ tên: ${data.customerName}`,
    `Điện thoại: ${data.customerPhone}`,
  ].join("\n");
}

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as BookingPayload;
    if (!data.customerName?.trim() || !data.customerPhone?.trim()) {
      return NextResponse.json(
        { success: false, message: "Missing customer details" },
        { status: 400 }
      );
    }

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

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (token && chatId) {
      const telegram = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage(
              data as Required<
                Pick<BookingPayload, "customerName" | "customerPhone">
              > &
                BookingPayload
            ),
            parse_mode: "HTML",
          }),
        }
      );
      if (!telegram.ok) {
        console.error("Telegram notification failed", await telegram.text());
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
