import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/admin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const { bot_token, chat_id, topic_id } = await request.json();

    if (!bot_token?.trim() || !chat_id?.trim()) {
      return NextResponse.json(
        { success: false, message: "Vui lòng nhập đầy đủ Bot Token và Chat ID" },
        { status: 400 }
      );
    }

    const payload: Record<string, unknown> = {
      chat_id: chat_id.trim(),
      text: [
        "🧪 <b>TEST THÔNG BÁO TELEGRAM - MAIGO79.COM</b>",
        "━━━━━━━━━━━━━━━━━━━━━━",
        "✅ <b>Cấu hình kết nối thành công!</b>",
        "🚗 Khi có khách hàng đặt xe trên website, hệ thống sẽ tự động gửi thông tin chi tiết về Telegram này ngay lập tức.",
        `⏰ <i>Thời gian kiểm tra: ${new Date().toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })}</i>`,
      ].join("\n"),
      parse_mode: "HTML",
    };

    if (topic_id?.trim()) {
      payload.message_thread_id = Number(topic_id.trim());
    }

    const res = await fetch(
      `https://api.telegram.org/bot${bot_token.trim()}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    if (!res.ok || !data.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.description || "Không thể gửi tin nhắn. Vui lòng kiểm tra lại Bot Token hoặc Chat ID.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gửi tin nhắn thử nghiệm thành công! Hãy kiểm tra Telegram của bạn.",
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Lỗi hệ thống";
    return NextResponse.json({ success: false, message: msg }, { status: 500 });
  }
}
