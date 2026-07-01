
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  username text not null,
  sanatory_id integer references public.sanatoriums (id),
  sanatorium_name text not null,
  sanatorium_image text,
  region text,
  specialty text,
  first_name text not null,
  last_name text not null,
  age text not null,
  complaint text not null,
  price text,
  status text not null default 'Kutilmoqda',
  created_at timestamptz not null default now()
);


alter table public.bookings add column if not exists sanatory_id integer references public.sanatoriums (id);

create index if not exists bookings_username_idx on public.bookings (username);
create index if not exists bookings_status_idx on public.bookings (status);
create index if not exists bookings_sanatory_id_idx on public.bookings (sanatory_id);


alter table public.bookings enable row level security;

drop policy if exists "bookings_select_anon" on public.bookings;
create policy "bookings_select_anon" on public.bookings
  for select using (true);

drop policy if exists "bookings_insert_anon" on public.bookings;
create policy "bookings_insert_anon" on public.bookings
  for insert with check (true);

drop policy if exists "bookings_update_anon" on public.bookings;
create policy "bookings_update_anon" on public.bookings
  for update using (true);
