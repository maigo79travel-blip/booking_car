import { Client } from "pg";

const client = new Client({
  connectionString:
    "postgresql://postgres.qysxwmujksnqxppluxey:bW.Q%2165SEEpk%3FBu@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres",
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
        content_type text NOT NULL DEFAULT 'text' CHECK (content_type IN ('text', 'json', 'image_url', 'html')),
        value jsonb NOT NULL,
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.posts (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        slug text NOT NULL UNIQUE,
        title jsonb NOT NULL,
        excerpt jsonb NOT NULL,
        body jsonb NOT NULL,
        cover_image text,
        published_at timestamptz,
        status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
        seo_title jsonb,
        seo_description jsonb,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.price_routes (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        route_name text NOT NULL,
        origin text NOT NULL,
        destination text NOT NULL,
        car_5_seats_price integer NOT NULL,
        car_7_seats_price integer NOT NULL,
        car_16_seats_price integer,
        is_popular boolean NOT NULL DEFAULT false,
        display_order integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now()
      );

      CREATE TABLE IF NOT EXISTS public.bookings (
        id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
        full_name text NOT NULL,
        phone_number text NOT NULL,
        pickup_address text NOT NULL,
        dropoff_address text NOT NULL,
        pickup_date date NOT NULL,
        pickup_time time NOT NULL,
        vehicle_type text NOT NULL,
        trip_type text NOT NULL DEFAULT 'one_way',
        estimated_price integer,
        notes text,
        source text NOT NULL DEFAULT 'website',
        status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    // 3. Upsert contact_info with new phone numbers
    await client.query(`
      INSERT INTO public.site_content (content_key, content_type, value)
      VALUES (
        'contact_info',
        'json',
        '{"brand_name": "maigo79.com", "hotline": "0928015280", "hotline_display": "0928.015.280", "zalo": "0905876231", "telegram": "https://t.me/maigo79_vn", "email": "contact@maigo79.com", "address": "Cột số 3 & 4 - Sảnh Đến Ga Quốc Nội & Quốc Tế, Sân bay Quốc tế Cam Ranh, Khánh Hòa", "logo_url": "/images/Brand.jpg", "working_hours": "24/7 (Phục vụ cả ngày lễ & Tết)"}'::jsonb
      )
      ON CONFLICT (content_key) DO UPDATE
      SET value = EXCLUDED.value, updated_at = now();
    `);

    console.log("Supabase initialization completed successfully!");
  } catch (err) {
    console.error("Error initializing Supabase:", err);
  } finally {
    await client.end();
  }
}

main();
