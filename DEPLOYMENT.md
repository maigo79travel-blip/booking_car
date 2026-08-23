# Triển khai Supabase + Vercel

1. Tạo một Supabase project. Mở SQL Editor và chạy `supabase/migrations/20260823_booking_car.sql`.
2. Tạo user quản trị trong **Authentication → Users**, sau đó thay UUID của user vào câu lệnh cuối migration để cấp quyền `admin`.
3. Tạo Cloudinary product/environment; lấy Cloud name, API key và API secret.
4. Tạo Telegram bot qua BotFather, lấy bot token; thêm bot vào chat/nhóm nhận thông báo và lấy chat ID.
5. Toàn bộ website, API, admin và tích hợp database chạy trong **một Next.js source/deployment** (`client`). Trên Vercel, import repository một lần và chọn `client` làm **Root Directory**. Không tạo/deploy service backend riêng. Thêm toàn bộ biến trong `client/.env.example` vào Environment Variables. Không đưa `SUPABASE_SERVICE_ROLE_KEY`, `CLOUDINARY_API_SECRET` hoặc token Telegram sang biến `NEXT_PUBLIC_*`.
6. Deploy. Mở `/admin`, đăng nhập và tạo bài viết/bảng giá/nội dung. Các ảnh tải lên cần dùng endpoint chữ ký `/api/admin/cloudinary-signature`; URL Cloudinary được lưu trong `media_assets` và dùng cho ảnh bài viết/nội dung.

Không cần Docker và không deploy thư mục `server`: API Next.js trong `client/src/app/api` thay thế backend Express cũ trên Vercel. Có thể chạy toàn bộ app từ root bằng `npm run dev` hoặc `npm run build`.
