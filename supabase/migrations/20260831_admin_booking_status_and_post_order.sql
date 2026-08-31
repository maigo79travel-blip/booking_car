-- Allow admins to mark bookings completed and control the public post order.
alter table public.bookings
  add column if not exists status text not null default 'pending',
  add column if not exists note text,
  add column if not exists updated_at timestamptz not null default now();

-- Normalize any legacy values before enforcing the allowed states.
update public.bookings
set status = 'pending'
where status is null or status not in ('pending', 'completed');

alter table public.bookings
  drop constraint if exists bookings_status_check;

alter table public.bookings
  add constraint bookings_status_check check (status in ('pending', 'completed'));

alter table public.posts
  add column if not exists sort_order integer not null default 0;

-- Existing posts keep their current newest-first order until an admin changes it.
with ranked_posts as (
  select id, row_number() over (order by published_at desc nulls last, created_at desc) as position
  from public.posts
  where sort_order = 0
)
update public.posts posts
set sort_order = ranked_posts.position
from ranked_posts
where posts.id = ranked_posts.id;

create index if not exists posts_sort_order_idx
  on public.posts (sort_order asc, published_at desc)
  where status = 'published';
