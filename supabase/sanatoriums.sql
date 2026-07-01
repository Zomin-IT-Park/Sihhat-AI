-- Sihhat-AI: sanatoriyalar (tibbiyot muassasalari) jadvali
-- Bu skriptni Supabase loyihangizning SQL Editor bo'limida ishga tushiring:
-- https://supabase.com/dashboard/project/_/sql/new
--
-- ID'lar 2 xonali bo'lishi mumkin emas edi (10-99 = atigi 90 ta joy,
-- ro'yxatda esa 3228 ta muassasa bor) — shuning uchun 4 xonali (1000-9999)
-- tasodifiy, noyob ID ishlatiladi. sanatoriums.csv faylida har bir
-- muassasaga shu tartibda ID allaqachon biriktirilgan.

create table if not exists public.sanatoriums (
  id integer primary key,
  name text not null,
  address text,
  phone text,
  email text,
  tin text,
  responsible_person text,
  image_url text,
  created_at timestamptz not null default now()
);

create index if not exists sanatoriums_name_idx on public.sanatoriums (name);

alter table public.sanatoriums enable row level security;

drop policy if exists "sanatoriums_select_anon" on public.sanatoriums;
create policy "sanatoriums_select_anon" on public.sanatoriums
  for select using (true);

-- Diqqat: jadval yaratilgach, "sanatoriums.csv" faylini Supabase
-- Table Editor -> sanatoriums jadvali -> "Insert" -> "Import data from CSV"
-- orqali yuklang (3228 qator).
