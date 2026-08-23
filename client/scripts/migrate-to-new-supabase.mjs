import { Client } from "pg";

const connectionString =
  "postgresql://postgres.qysxwmujksnqxppluxey:bW.Q%2165SEEpk%3FBu@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres";

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function run() {
  try {
    console.log("Connecting to new Supabase PostgreSQL (qysxwmujksnqxppluxey)...");
    await client.connect();
    console.log("Connected successfully!");

    // 1. Extensions
    console.log("Creating extensions...");
    await client.query(`
      CREATE EXTENSION IF NOT EXISTS pgcrypto;
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    // 2. Auth schema & users check
    console.log("Checking auth.users...");
    try {
      await client.query(`
        DO $$
        DECLARE
          v_admin_id uuid := 'a1111111-1111-1111-1111-111111111111'::uuid;
        BEGIN
          INSERT INTO auth.users (
            id, instance_id, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
          )
          VALUES (
            v_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@inoibai.vn',
            crypt('Admin@123456', gen_salt('bf')), now(),
            '{"provider":"email","providers":["email"]}', '{"full_name":"Admin maigo79"}',
            now(), now(), 'authenticated', 'authenticated'
          )
          ON CONFLICT (id) DO UPDATE SET
            email = 'admin@inoibai.vn',
            encrypted_password = crypt('Admin@123456', gen_salt('bf')),
            email_confirmed_at = now();
        EXCEPTION WHEN OTHERS THEN
          RAISE NOTICE 'Could not insert into auth.users directly: %', SQLERRM;
        END $$;
      `);
    } catch (e) {
      console.log("Auth users notice:", e.message);
    }

    // 3. Public Tables
    console.log("Creating public tables...");
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

    // 4. Create or Replace helper functions
    console.log("Setting up functions & RLS...");
    await client.query(`
      CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
      BEGIN
        IF auth.uid() IS NULL THEN
          RETURN true;
        END IF;
        RETURN EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin');
      END;
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

    // 5. Seed Admin User
    console.log("Seeding Admin accounts...");
    await client.query(`
      DO $$
      DECLARE
        v_admin_id uuid := 'a1111111-1111-1111-1111-111111111111'::uuid;
      BEGIN
        INSERT INTO auth.users (
          id, instance_id, email, encrypted_password, email_confirmed_at,
          raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
        )
        VALUES (
          v_admin_id, '00000000-0000-0000-0000-000000000000', 'admin@inoibai.vn',
          crypt('Admin@123456', gen_salt('bf')), now(),
          '{"provider":"email","providers":["email"]}', '{"full_name":"Admin maigo79"}',
          now(), now(), 'authenticated', 'authenticated'
        )
        ON CONFLICT (id) DO UPDATE SET
          email = 'admin@inoibai.vn',
          encrypted_password = crypt('Admin@123456', gen_salt('bf')),
          email_confirmed_at = now();

        INSERT INTO public.profiles (id, role, created_at)
        VALUES (v_admin_id, 'admin', now())
        ON CONFLICT (id) DO UPDATE SET role = 'admin';
      END $$;
    `);

    // Also support admin@maigo79.com
    await client.query(`
      DO $$
      DECLARE
        v_admin2_id uuid := 'a2222222-2222-2222-2222-222222222222'::uuid;
      BEGIN
        INSERT INTO auth.users (
          id, instance_id, email, encrypted_password, email_confirmed_at,
          raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
        )
        VALUES (
          v_admin2_id, '00000000-0000-0000-0000-000000000000', 'admin@maigo79.com',
          crypt('Admin@123456', gen_salt('bf')), now(),
          '{"provider":"email","providers":["email"]}', '{"full_name":"Admin maigo79"}',
          now(), now(), 'authenticated', 'authenticated'
        )
        ON CONFLICT (id) DO UPDATE SET
          email = 'admin@maigo79.com',
          encrypted_password = crypt('Admin@123456', gen_salt('bf')),
          email_confirmed_at = now();

        INSERT INTO public.profiles (id, role, created_at)
        VALUES (v_admin2_id, 'admin', now())
        ON CONFLICT (id) DO UPDATE SET role = 'admin';
      END $$;
    `);

    // 6. Seed Site Content
    console.log("Seeding Site Content & Contact Info...");
    await client.query(`
      INSERT INTO public.site_content (content_key, content_type, value)
      VALUES (
        'contact_info',
        'json',
        '{"brand_name": "maigo79.com", "hotline": "0928015280", "hotline_display": "0928.015.280", "zalo": "0905876231", "telegram": "https://t.me/maigo79_vn", "email": "contact@maigo79.com", "address": "Cột số 3 & 4 - Sảnh Đến Ga Quốc Nội & Quốc Tế, Sân bay Quốc tế Cam Ranh, Khánh Hòa", "logo_url": "/images/Brand.jpg", "working_hours": "24/7 (Phục vụ cả ngày lễ & Tết)"}'::jsonb
      )
      ON CONFLICT (content_key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = now();

      INSERT INTO public.site_content (content_key, content_type, value)
      VALUES (
        'hero_section',
        'json',
        '{"title": "DỊCH VỤ XE ĐƯA ĐÓN SÂN BAY CAM RANH", "subtitle": "Uy tín - Đúng giờ - Giá niêm yết trọn gói không phát sinh", "bg_image": "", "pricing_bg_image": "", "banner_images": ["/images/Hero1.jpg", "/images/Hero2.jpg", "/images/Hero3.jpg"]}'::jsonb
      )
      ON CONFLICT (content_key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = now();
    `);

    // 7. Seed Routes
    console.log("Seeding Price Routes...");
    await client.query(`
      INSERT INTO public.price_routes (origin, destination, vehicle_type, trip_type, price, is_active, sort_order)
      VALUES
        ('{"vi":"Sân bay Cam Ranh","en":"Cam Ranh Airport","ko":"깜라인 공항","ru":"Аэропорт Камрань","zh":"金兰机场"}'::jsonb, '{"vi":"TP. Nha Trang","en":"Nha Trang City","ko":"냐짱 시내","ru":"г. Нячанг","zh":"芽庄市区"}'::jsonb, '5', 'one_way', 250000, true, 1),
        ('{"vi":"TP. Nha Trang","en":"Nha Trang City","ko":"냐짱 시내","ru":"г. Нячанг","zh":"芽庄市区"}'::jsonb, '{"vi":"Sân bay Cam Ranh","en":"Cam Ranh Airport","ko":"깜라인 공항","ru":"Аэропорт Камрань","zh":"金兰机场"}'::jsonb, '5', 'one_way', 250000, true, 2),
        ('{"vi":"Khứ hồi Cam Ranh ↔ Nha Trang","en":"Roundtrip Cam Ranh ↔ Nha Trang"}'::jsonb, '{"vi":"Cam Ranh ↔ Nha Trang","en":"Cam Ranh ↔ Nha Trang"}'::jsonb, '5', 'round_trip', 480000, true, 3),
        ('{"vi":"Sân bay Cam Ranh","en":"Cam Ranh Airport"}'::jsonb, '{"vi":"TP. Nha Trang","en":"Nha Trang City"}'::jsonb, '7', 'one_way', 300000, true, 4),
        ('{"vi":"TP. Nha Trang","en":"Nha Trang City"}'::jsonb, '{"vi":"Sân bay Cam Ranh","en":"Cam Ranh Airport"}'::jsonb, '7', 'one_way', 300000, true, 5),
        ('{"vi":"Khứ hồi Cam Ranh ↔ Nha Trang"}'::jsonb, '{"vi":"Cam Ranh ↔ Nha Trang"}'::jsonb, '7', 'round_trip', 580000, true, 6),
        ('{"vi":"Sân bay Cam Ranh","en":"Cam Ranh Airport"}'::jsonb, '{"vi":"TP. Nha Trang","en":"Nha Trang City"}'::jsonb, '16', 'one_way', 550000, true, 7),
        ('{"vi":"TP. Nha Trang","en":"Nha Trang City"}'::jsonb, '{"vi":"Sân bay Cam Ranh","en":"Cam Ranh Airport"}'::jsonb, '16', 'one_way', 550000, true, 8),
        ('{"vi":"Khứ hồi Cam Ranh ↔ Nha Trang"}'::jsonb, '{"vi":"Cam Ranh ↔ Nha Trang"}'::jsonb, '16', 'round_trip', 1050000, true, 9)
      ON CONFLICT DO NOTHING;
    `);

    // Verify
    const tables = await client.query(`
      SELECT table_name FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `);
    console.log("Public tables in database:", tables.rows.map(r => r.table_name));

    const contentCount = await client.query("SELECT count(*) FROM public.site_content");
    console.log("Site content records:", contentCount.rows[0].count);

    const routesCount = await client.query("SELECT count(*) FROM public.price_routes");
    console.log("Price routes records:", routesCount.rows[0].count);

    console.log("🎉 All tables and seed data pushed to new Supabase database successfully!");
  } catch (err) {
    console.error("Migration error:", err);
    process.exit(1);
  } finally {
    await client.end();
  }
}

run();
