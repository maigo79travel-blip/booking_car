create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'editor' check (role in ('admin', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  content_type text not null default 'text' check (content_type in ('text', 'rich_text', 'image', 'json')),
  value jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.price_routes (
  id uuid primary key default gen_random_uuid(),
  origin jsonb not null default '{}'::jsonb,
  destination jsonb not null default '{}'::jsonb,
  vehicle_type text not null,
  trip_type text not null default 'one_way' check (trip_type in ('one_way', 'round_trip')),
  price numeric(12,0) not null check (price >= 0),
  currency text not null default 'VND',
  is_active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title jsonb not null default '{}'::jsonb,
  excerpt jsonb not null default '{}'::jsonb,
  body jsonb not null default '{}'::jsonb,
  seo_title jsonb not null default '{}'::jsonb,
  seo_description jsonb not null default '{}'::jsonb,
  cover_image text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists posts_published_at_idx on public.posts (published_at desc) where status = 'published';
create index if not exists posts_sort_order_idx on public.posts (sort_order asc, published_at desc) where status = 'published';

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique,
  secure_url text not null,
  alt jsonb not null default '{}'::jsonb,
  width integer,
  height integer,
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone_number text not null,
  from_location text not null,
  to_location text not null,
  car_type text not null,
  trip_date text not null,
  trip_time text not null,
  way_type text not null,
  total_price numeric(12,0) not null default 0,
  status text not null default 'pending' check (status in ('pending', 'completed')),
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists bookings_created_at_idx on public.bookings (created_at desc);

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.site_content enable row level security;
alter table public.price_routes enable row level security;
alter table public.posts enable row level security;
alter table public.media_assets enable row level security;
alter table public.bookings enable row level security;

create policy "public reads site content" on public.site_content for select using (true);
create policy "public reads active prices" on public.price_routes for select using (is_active = true);
create policy "public reads published posts" on public.posts for select using (status = 'published');
create policy "public reads media" on public.media_assets for select using (true);
create policy "admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage content" on public.site_content for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage routes" on public.price_routes for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage posts" on public.posts for all using (public.is_admin()) with check (public.is_admin());
create policy "admins manage media" on public.media_assets for all using (public.is_admin()) with check (public.is_admin());
create policy "admins read bookings" on public.bookings for select using (public.is_admin());

insert into public.site_content (content_key, content_type, value) values
  ('navigation', 'json', '{"vi":{"home":"Trang Chủ","vehicles":"Loại xe","pricing":"Bảng giá","posts":"Bài viết","about":"Về chúng tôi","policies":"Chính sách"},"en":{"home":"Home","vehicles":"Vehicles","pricing":"Pricing","posts":"Articles","about":"About us","policies":"Policies"},"ko":{"home":"홈","vehicles":"차량","pricing":"요금","posts":"게시물","about":"회사 소개","policies":"정책"},"ru":{"home":"Главная","vehicles":"Автомобили","pricing":"Цены","posts":"Статьи","about":"О нас","policies":"Политики"},"zh":{"home":"首页","vehicles":"车型","pricing":"价格","posts":"文章","about":"关于我们","policies":"政策"}}'::jsonb),
  ('pricing_heading', 'text', '{"vi":"BẢNG GIÁ XE SÂN BAY NỘI BÀI","en":"NOI BAI AIRPORT CAR PRICES","ko":"노이바이 공항 차량 요금","ru":"ЦЕНЫ НА ТРАНСФЕР В АЭРОПОРТ НОЙБАЙ","zh":"内排机场接送价格"}'::jsonb)
on conflict (content_key) do nothing;

-- After creating the first auth user in Supabase Dashboard, grant it admin:
-- insert into public.profiles (id, role) values ('AUTH_USER_UUID', 'admin') on conflict (id) do update set role = 'admin';
