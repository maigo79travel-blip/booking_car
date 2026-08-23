# inoibai.vn - Hệ thống Đặt Xe Taxi Sân Bay Nội Bài

Dự án đặt xe trực tuyến cao cấp, chuẩn SEO, hỗ trợ 5 ngôn ngữ và tích hợp trang quản trị Admin Dashboard chuyên nghiệp.

## 🚀 Công nghệ sử dụng
- **Core Framework**: [Next.js 16 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/)
- **Ngôn ngữ**: [TypeScript](https://www.typescriptlang.org/)
- **Giao diện**: [Tailwind CSS 4](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **Đa ngôn ngữ (i18n)**: 5 thứ tiếng (🇻🇳 Tiếng Việt, 🇬🇧 English, 🇰🇷 한국어, 🇷🇺 Русский, 🇨🇳 中文)
- **Database & Auth**: [Supabase](https://supabase.com/) PostgreSQL + RLS + REST API
- **SEO Ready**: Schema.org Multi-Entity (TaxiService, LocalBusiness, FAQPage, BlogPosting, Breadcrumbs), Dynamic Robots, Sitemap XML, Manifest PWA

---

## 🛠️ Cài đặt & Chạy Local

### 1. Cài đặt thư viện dependencies
```bash
npm install
```

### 2. Cấu hình biến môi trường
Tạo file `.env.local` (dựa trên `.env.example`):
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
TELEGRAM_BOT_TOKEN=your-telegram-bot-token
TELEGRAM_CHAT_ID=your-telegram-chat-id
NEXT_PUBLIC_SITE_URL=https://inoibai.vn
```

### 3. Chạy môi trường phát triển (Development)
```bash
npm run dev
```
- Website khách hàng: `http://localhost:3000`
- Trang quản trị Admin: `http://localhost:3000/admin`

### 4. Build kiểm tra sản phẩm (Production Build)
```bash
npm run build
```
