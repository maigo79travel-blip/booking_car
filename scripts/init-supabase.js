const { Client } = require("pg");

const client = new Client({
  connectionString:
    "postgresql://postgres.zgpeyypmfskvqlfdanfd:bW.Q%2165SEEpk%3FBu@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
  ssl: { rejectUnauthorized: false },
});

async function main() {
  try {
    console.log("Connecting to Supabase...");
    await client.connect();
    console.log("Connected to Supabase PostgreSQL!");

    // 1. Create Extensions
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    // 2. Create Public Tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS public.profiles (
        id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.site_content (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        content_key text NOT NULL UNIQUE,
        content_type text NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'rich_text', 'image', 'json')),
        value jsonb NOT NULL DEFAULT '{}'::jsonb,
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.price_routes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        origin jsonb NOT NULL DEFAULT '{}'::jsonb,
        destination jsonb NOT NULL DEFAULT '{}'::jsonb,
        vehicle_type text NOT NULL,
        trip_type text NOT NULL DEFAULT 'one_way' CHECK (trip_type IN ('one_way', 'round_trip')),
        price numeric(12,0) NOT NULL CHECK (price >= 0),
        currency text NOT NULL DEFAULT 'VND',
        is_active boolean NOT NULL DEFAULT true,
        sort_order integer NOT NULL DEFAULT 0,
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.posts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        slug text NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
        title jsonb NOT NULL DEFAULT '{}'::jsonb,
        excerpt jsonb NOT NULL DEFAULT '{}'::jsonb,
        body jsonb NOT NULL DEFAULT '{}'::jsonb,
        seo_title jsonb NOT NULL DEFAULT '{}'::jsonb,
        seo_description jsonb NOT NULL DEFAULT '{}'::jsonb,
        cover_image text,
        status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
        published_at timestamptz,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS posts_published_at_idx ON public.posts (published_at DESC) WHERE status = 'published';

      CREATE TABLE IF NOT EXISTS public.media_assets (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        public_id text NOT NULL UNIQUE,
        secure_url text NOT NULL,
        alt jsonb NOT NULL DEFAULT '{}'::jsonb,
        width integer,
        height integer,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.bookings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_name text NOT NULL,
        phone_number text NOT NULL,
        from_location text NOT NULL,
        to_location text NOT NULL,
        car_type text NOT NULL,
        trip_date text NOT NULL,
        trip_time text NOT NULL,
        way_type text NOT NULL,
        total_price numeric(12,0) NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE INDEX IF NOT EXISTS bookings_created_at_idx ON public.bookings (created_at DESC);
    `);

    // 3. Security RLS & Functions
    await client.query(`
      CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
        SELECT EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
      $$;

      ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.price_routes ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

      DROP POLICY IF EXISTS "public reads site content" ON public.site_content;
      CREATE POLICY "public reads site content" ON public.site_content FOR SELECT USING (true);

      DROP POLICY IF EXISTS "public reads active prices" ON public.price_routes;
      CREATE POLICY "public reads active prices" ON public.price_routes FOR SELECT USING (is_active = true);

      DROP POLICY IF EXISTS "public reads published posts" ON public.posts;
      CREATE POLICY "public reads published posts" ON public.posts FOR SELECT USING (status = 'published');

      DROP POLICY IF EXISTS "public reads media" ON public.media_assets;
      CREATE POLICY "public reads media" ON public.media_assets FOR SELECT USING (true);

      DROP POLICY IF EXISTS "admins manage profiles" ON public.profiles;
      CREATE POLICY "admins manage profiles" ON public.profiles FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

      DROP POLICY IF EXISTS "admins manage content" ON public.site_content;
      CREATE POLICY "admins manage content" ON public.site_content FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

      DROP POLICY IF EXISTS "admins manage routes" ON public.price_routes;
      CREATE POLICY "admins manage routes" ON public.price_routes FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

      DROP POLICY IF EXISTS "admins manage posts" ON public.posts;
      CREATE POLICY "admins manage posts" ON public.posts FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

      DROP POLICY IF EXISTS "admins manage media" ON public.media_assets;
      CREATE POLICY "admins manage media" ON public.media_assets FOR ALL USING (public.is_admin()) WITH CHECK (public.is_admin());

      DROP POLICY IF EXISTS "admins read bookings" ON public.bookings;
      CREATE POLICY "admins read bookings" ON public.bookings FOR SELECT USING (public.is_admin());
    `);

    // 4. Seed Price Routes
    await client.query(`
      DELETE FROM public.price_routes;
      INSERT INTO public.price_routes (origin, destination, vehicle_type, trip_type, price, is_active, sort_order)
      VALUES
        ('{"vi":"Hà Nội","en":"Hanoi Center","ko":"하노이 시내","ru":"Центр Ханоя","zh":"河内市区"}'::jsonb, '{"vi":"Sân bay Nội Bài","en":"Noi Bai Airport","ko":"노이바이 공항","ru":"Аэропорт Нойбай","zh":"内排机场"}'::jsonb, '5', 'one_way', 200000, true, 1),
        ('{"vi":"Sân bay Nội Bài","en":"Noi Bai Airport","ko":"노이바이 공항","ru":"Аэропорт Нойбай","zh":"内排机场"}'::jsonb, '{"vi":"Hà Nội","en":"Hanoi Center","ko":"하노이 시내","ru":"Центр Ханоя","zh":"河内市区"}'::jsonb, '5', 'one_way', 250000, true, 2),
        ('{"vi":"Hai chiều Hà Nội ↔ Nội Bài","en":"Hanoi ↔ Noi Bai Roundtrip","ko":"하노이 ↔ 노이바이 왕복","ru":"Ханой ↔ Нойбай в оба конца","zh":"河内 ↔ 内排往返"}'::jsonb, '{"vi":"Hà Nội ↔ Nội Bài","en":"Hanoi ↔ Noi Bai","ko":"하노이 ↔ 노이바이","ru":"Ханой ↔ Нойбай","zh":"河内 ↔ 内排"}'::jsonb, '5', 'round_trip', 400000, true, 3),
        ('{"vi":"Hà Nội","en":"Hanoi Center","ko":"하노이 시내","ru":"Центр Ханоя","zh":"河内市区"}'::jsonb, '{"vi":"Sân bay Nội Bài","en":"Noi Bai Airport","ko":"노이바이 공항","ru":"Аэропорт Нойбай","zh":"内排机场"}'::jsonb, '7', 'one_way', 250000, true, 4),
        ('{"vi":"Sân bay Nội Bài","en":"Noi Bai Airport","ko":"노이바이 공항","ru":"Аэропорт Нойбай","zh":"内排机场"}'::jsonb, '{"vi":"Hà Nội","en":"Hanoi Center","ko":"하노이 시내","ru":"Центр Ханоя","zh":"河内市区"}'::jsonb, '7', 'one_way', 300000, true, 5),
        ('{"vi":"Hai chiều Hà Nội ↔ Nội Bài","en":"Hanoi ↔ Noi Bai Roundtrip","ko":"하노이 ↔ 노이바이 왕복","ru":"Ханой ↔ Нойбай в оба конца","zh":"河内 ↔ 内排往返"}'::jsonb, '{"vi":"Hà Nội ↔ Nội Bài","en":"Hanoi ↔ Noi Bai","ko":"하노이 ↔ 노이바이","ru":"Ханой ↔ Нойбай","zh":"河内 ↔ 内排"}'::jsonb, '7', 'round_trip', 500000, true, 6),
        ('{"vi":"Hà Nội","en":"Hanoi Center","ko":"하노이 시내","ru":"Центр Ханоя","zh":"河内市区"}'::jsonb, '{"vi":"Sân bay Nội Bài","en":"Noi Bai Airport","ko":"노이바이 공항","ru":"Аэропорт Нойбай","zh":"内排机场"}'::jsonb, '16', 'one_way', 450000, true, 7),
        ('{"vi":"Sân bay Nội Bài","en":"Noi Bai Airport","ko":"노이바이 공항","ru":"Аэропорт Нойбай","zh":"内排机场"}'::jsonb, '{"vi":"Hà Nội","en":"Hanoi Center","ko":"하노이 시내","ru":"Центр Ханоя","zh":"河内市区"}'::jsonb, '16', 'one_way', 550000, true, 8),
        ('{"vi":"Hai chiều Hà Nội ↔ Nội Bài","en":"Hanoi ↔ Noi Bai Roundtrip","ko":"하노이 ↔ 노이바이 왕복","ru":"Ханой ↔ Нойбай в оба конца","zh":"河内 ↔ 内排往返"}'::jsonb, '{"vi":"Hà Nội ↔ Nội Bài","en":"Hanoi ↔ Noi Bai","ko":"하노이 ↔ 노이바이","ru":"Ханой ↔ Нойбай","zh":"河内 ↔ 内排"}'::jsonb, '16', 'round_trip', 900000, true, 9),
        ('{"vi":"Sân bay Nội Bài","en":"Noi Bai Airport","ko":"노이바이 공항","ru":"Аэропорт Нойбай","zh":"内排机场"}'::jsonb, '{"vi":"Bắc Ninh","en":"Bac Ninh","ko":"박닌","ru":"Бакнинь","zh":"北宁"}'::jsonb, '5', 'one_way', 400000, true, 10),
        ('{"vi":"Sân bay Nội Bài","en":"Noi Bai Airport","ko":"노이바이 공항","ru":"Аэропорт Нойбай","zh":"内排机场"}'::jsonb, '{"vi":"Hải Phòng","en":"Hai Phong","ko":"하이퐁","ru":"Хайфон","zh":"海防"}'::jsonb, '5', 'one_way', 1100000, true, 11),
        ('{"vi":"Sân bay Nội Bài","en":"Noi Bai Airport","ko":"노이바이 공항","ru":"Аэропорт Нойбай","zh":"内排机场"}'::jsonb, '{"vi":"Quảng Ninh (Hạ Long)","en":"Quang Ninh (Ha Long)","ko":"꽝닌 (하롱)","ru":"Куангнинь (Халонг)","zh":"广宁 (下龙湾)"}'::jsonb, '5', 'one_way', 1350000, true, 12);
    `);

    // 5. Seed Site Content
    await client.query(`
      INSERT INTO public.site_content (content_key, content_type, value)
      VALUES
        ('navigation', 'json', '{"vi":{"home":"Trang Chủ","vehicles":"Loại xe","pricing":"Bảng giá","articles":"Bài viết","about":"Về chúng tôi","policies":"Chính sách"},"en":{"home":"Home","vehicles":"Vehicles","pricing":"Pricing","articles":"Articles","about":"About us","policies":"Policies"},"ko":{"home":"홈","vehicles":"차량","pricing":"요금","articles":"게시물","about":"회사 소개","policies":"정책"},"ru":{"home":"Главная","vehicles":"Автомобили","pricing":"Цены","articles":"Статьи","about":"О нас","policies":"Политики"},"zh":{"home":"首页","vehicles":"车型","pricing":"价格","articles":"文章","about":"关于我们","policies":"政策"}}'::jsonb),
        ('pricing_heading', 'text', '{"vi":"BẢNG GIÁ XE SÂN BAY NỘI BÀI","en":"NOI BAI AIRPORT CAR PRICES","ko":"노이바이 공항 차량 요금","ru":"ЦЕНЫ НА ТРАНСФЕР В АЭРОПОРТ НОЙБАЙ","zh":"内排机场接送价格"}'::jsonb),
        ('contact_info', 'json', '{"hotline":"0985.791.955","email":"inoibai.vn@gmail.com","address":"Sảnh A1, T1 - Sân bay Quốc tế Nội Bài, Sóc Sơn, Hà Nội","brand_name":"inoibai.vn"}'::jsonb)
      ON CONFLICT (content_key) DO UPDATE SET
        value = EXCLUDED.value,
        updated_at = now();
    `);

    // 6. Seed Sample Bookings
    await client.query(`
      DELETE FROM public.bookings;
      INSERT INTO public.bookings (customer_name, phone_number, from_location, to_location, car_type, trip_date, trip_time, way_type, total_price, created_at)
      VALUES
        ('Nguyễn Văn An', '0912345678', 'Hoàn Kiếm, Hà Nội', 'Sân bay Nội Bài (Ga T1)', '5', CURRENT_DATE::text, '08:30', 'one-way', 200000, now() - interval '15 minutes'),
        ('Trần Thị Mai', '0987654321', 'Sân bay Nội Bài (Ga T2)', 'Cầu Giấy, Hà Nội', '7', CURRENT_DATE::text, '09:15', 'one-way', 300000, now() - interval '45 minutes'),
        ('Lê Hoàng Nam', '0903123456', 'Đống Đa, Hà Nội', 'Sân bay Nội Bài', '5', CURRENT_DATE::text, '10:00', 'two-way', 400000, now() - interval '2 hours'),
        ('Phạm Quốc Hùng', '0978999888', 'Sân bay Nội Bài', 'Bắc Ninh (KCN Quế Võ)', '7', CURRENT_DATE::text, '11:30', 'one-way', 450000, now() - interval '3 hours'),
        ('Vũ Thị Lan', '0966554433', 'Thanh Xuân, Hà Nội', 'Sân bay Nội Bài', '5', CURRENT_DATE::text, '13:00', 'one-way', 200000, now() - interval '4 hours'),
        ('Đoàn Minh Tuấn', '0933221100', 'Sân bay Nội Bài', 'Hải Phòng', '5', (CURRENT_DATE + 1)::text, '07:00', 'one-way', 1100000, now() - interval '5 hours'),
        ('David Kim (Hàn Quốc)', '0888999777', 'Sân bay Nội Bài (T2)', 'Khách sạn Lotte Liễu Giai', '7', (CURRENT_DATE + 1)::text, '14:30', 'one-way', 300000, now() - interval '6 hours'),
        ('Hoàng Anh Đức', '0915678901', 'Hà Đông, Hà Nội', 'Sân bay Nội Bài', '16', (CURRENT_DATE + 1)::text, '06:00', 'one-way', 550000, now() - interval '8 hours'),
        ('Bùi Thị Ngọc', '0944332211', 'Tây Hồ, Hà Nội', 'Sân bay Nội Bài', '5', (CURRENT_DATE - 1)::text, '16:00', 'two-way', 400000, now() - interval '1 day'),
        ('Đỗ Quang Huy', '0981239876', 'Sân bay Nội Bài', 'Ninh Bình (Tràng An)', '7', (CURRENT_DATE - 1)::text, '08:00', 'two-way', 1800000, now() - interval '1 day 2 hours'),
        ('Trương Mỹ Linh', '0971122334', 'Ba Đình, Hà Nội', 'Sân bay Nội Bài', '5', (CURRENT_DATE - 2)::text, '05:30', 'one-way', 200000, now() - interval '2 days'),
        ('Vương Kiến Quốc', '0908877665', 'Sân bay Nội Bài', 'Hạ Long, Quảng Ninh', '16', (CURRENT_DATE - 2)::text, '10:00', 'one-way', 1900000, now() - interval '2 days 4 hours'),
        ('Lê Thị Hằng', '0934567890', 'Hai Bà Trưng, Hà Nội', 'Sân bay Nội Bài', '7', (CURRENT_DATE - 3)::text, '12:00', 'one-way', 250000, now() - interval '3 days'),
        ('Ngô Văn Thanh', '0967890123', 'Sân bay Nội Bài', 'Vĩnh Phúc', '5', (CURRENT_DATE - 3)::text, '17:45', 'one-way', 380000, now() - interval '3 days 6 hours'),
        ('Phan Tuấn Anh', '0919876543', 'Long Biên, Hà Nội', 'Sân bay Nội Bài', '5', (CURRENT_DATE - 4)::text, '09:00', 'two-way', 400000, now() - interval '4 days');
    `);

    // 7. Seed SEO Posts
    await client.query(`
      INSERT INTO public.posts (slug, cover_image, status, published_at, title, seo_title, excerpt, seo_description, body)
      VALUES
        (
          'kinh-nghiem-dat-xe-taxi-san-bay-noi-bai-gia-re',
          '/images/Hero2.jpg',
          'published',
          now(),
          '{"vi":"Kinh nghiệm đặt xe taxi sân bay Nội Bài giá rẻ, không lo bị chặt chém","en":"Tips for booking cheap and reliable Noi Bai airport taxi","ko":"노이바이 공항 택시 저렴하고 안전하게 예약하는 팁","ru":"Советы по заказу недорогого такси в аэропорт Нойбай","zh":"河内内排机场便宜可靠的出租车预订经验"}'::jsonb,
          '{"vi":"Kinh Nghiệm Đặt Taxi Sân Bay Nội Bài Giá Rẻ 2026 | inoibai.vn","en":"Tips to Book Cheap Noi Bai Airport Taxi 2026 | inoibai.vn","ko":"노이바이 공항 저렴한 택시 예약 팁 2026 | inoibai.vn","ru":"Как заказать дешевое такси в аэропорт Нойбай | inoibai.vn","zh":"河内内排机场特价出租车预订攻略 2026 | inoibai.vn"}'::jsonb,
          '{"vi":"Tổng hợp kinh nghiệm đặt xe sân bay Nội Bài giúp bạn tiết kiệm chi phí tối đa, đảm bảo đúng giờ đón trả và không phát sinh phí ẩn.","en":"Comprehensive guide to booking airport transfers with maximum savings and 100% on-time guarantee.","ko":"비용을 최대한 절약하고 시간 엄수를 보장하는 노이바이 공항 교통편 종합 가이드.","ru":"Полное руководство по заказу трансфера в аэропорт с максимальной экономией và гарантией пунктуальности.","zh":"内排机场接送综合预订指南，助您最大程度节省费用并确保准时接送。"}'::jsonb,
          '{"vi":"Hướng dẫn chi tiết cách đặt taxi sân bay Nội Bài giá rẻ chỉ từ 200k, xe đời mới, đón sảnh đúng giờ, trọn gói không phụ phí tại inoibai.vn.","en":"Detailed guide on booking budget Noi Bai airport taxis from only 200,000 VND. Modern fleet, 24/7 support.","ko":"20만동부터 시작하는 저렴한 노이바이 공항 택시 예약 상세 안내. 최신 차량, 24시간 연중무휴 지원.","ru":"Подробная инструкция по заказу такси в аэропорт Нойбай от 200 000 донгов. Новые авто, круглосуточно.","zh":"内排机场特价接送预订指南，仅20万越盾起，全新车型，24小时服务。"}'::jsonb,
          '{"vi":"Dịch vụ xe riêng đón tiễn Sân bay Nội Bài trọn gói, xe đời mới, tài xế phục vụ 24/7 chu đáo.","en":"Private airport transfer services with modern fleet and 24/7 dedicated support.","ko":"최신 차량과 24시간 연중무휴 지원을 제공하는 프라이빗 공항 교통편 서비스.","ru":"Индивидуальный трансфер в аэропорт на новых автомобилях с круглосуточной поддержкой.","zh":"专车接送内排机场，全新车队，24小时竭诚为您服务。"}'::jsonb
        ),
        (
          'bang-gia-taxi-noi-bai-ve-cac-tinh-mien-bac',
          '/images/Hero1.jpg',
          'published',
          now() - interval '2 days',
          '{"vi":"Bảng giá xe taxi Nội Bài đi các tỉnh miền Bắc mới nhất 2026","en":"Latest 2026 taxi price list from Noi Bai to Northern provinces","ko":"2026년 최신 노이바이 공항발 북부 지방 택시 요금표","ru":"Прайс-лист на такси из аэропорта Нойбай в северные провинции 2026","zh":"2026最新内排机场直达越南北部各省出租车价格表"}'::jsonb,
          '{"vi":"Bảng Giá Thuê Xe Nội Bài Đi Tỉnh Trọn Gói Giá Rẻ 2026","en":"Fixed Price List from Noi Bai Airport to Provinces 2026","ko":"노이바이 공항 지방 운행 요금표 2026","ru":"Тарифы на такси из Нойбая в провинции 2026","zh":"内排机场前往各省包车一口价价格表 2026"}'::jsonb,
          '{"vi":"Cập nhật bảng giá xe đón tiễn Nội Bài đi Bắc Ninh, Hải Phòng, Quảng Ninh, Ninh Bình, Vĩnh Phúc, Thái Nguyên chi tiết nhất.","en":"Detailed fixed pricing from Noi Bai to Bac Ninh, Hai Phong, Ha Long Bay, Ninh Binh, and more.","ko":"노이바이에서 박닌, 하이퐁, 하롱베이, 닌빈 등으로 가는 정액 요금 안내.","ru":"Подробные тарифы из Нойбая в Бакнинь, Хайфон, Халонг, Ниньбинь и др.","zh":"详细提供内排机场前往北宁、海防、下龙湾、宁平的一口价资费。"}'::jsonb,
          '{"vi":"Bảng giá thuê xe taxi đường dài từ sân bay Nội Bài đi các tỉnh miền Bắc trọn gói, xe 5-7-16 chỗ đời mới đón tận nơi.","en":"Inter-provincial transfer rates from Noi Bai airport with new 5, 7, 16 seater vehicles.","ko":"노이바이 공항에서 북부 각 지방으로 운행하는 5, 7, 16인승 최신 차량 장거리 정액 요금표.","ru":"Тарифы на междугородние поездки из Нойбая на автомобилях 5, 7, 16 мест.","zh":"内排机场直达北部各省长途包车价格，5座、7座、16座全新车型接送。"}'::jsonb,
          '{"vi":"Dịch vụ xe đường dài đón trực tiếp từ Sân bay Nội Bài đi các tỉnh giúp hành khách tiết kiệm thời gian.","en":"Direct inter-city transfers from Noi Bai airport save you time and hassle.","ko":"노이바이 공항에서 각 지방으로 바로 이동하는 프라이빗 차량 서비스.","ru":"Прямой трансфер из аэропорта Нойбай в другие провинции экономит ваше время.","zh":"从内排机场直达各省的长途专车服务。"}'::jsonb
        )
      ON CONFLICT (slug) DO UPDATE SET
        title = EXCLUDED.title,
        seo_title = EXCLUDED.seo_title,
        excerpt = EXCLUDED.excerpt,
        seo_description = EXCLUDED.seo_description,
        body = EXCLUDED.body,
        cover_image = EXCLUDED.cover_image,
        status = EXCLUDED.status,
        updated_at = now();
    `);

    console.log("🎉 SUCCESS: All database tables, seed price routes, SEO posts, site content, and bookings have been initialized in Supabase!");
    await client.end();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

main();
