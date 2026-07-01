-- Sihhat-AI: har bir sanatoriyaga tegishli admin login'lari
-- Bu skriptni "sanatoriums.sql" dan KEYIN ishga tushiring (sanatory_id
-- shu jadvaldagi yozuvlarga bog'lanadi).
--
-- health-admin-app shu jadval orqali login qiladi: kiritilgan
-- username+password mos kelsa, o'sha adminning sanatory_id'si sessiyada
-- saqlanadi va "Buyurtmalarim" faqat shu sanatory_id bo'yicha filtrlanadi.

create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password text not null,
  sanatory_id integer not null references public.sanatoriums (id),
  display_name text not null,
  created_at timestamptz not null default now()
);

-- Diqqat: parol oddiy matn (plaintext) holida saqlanmoqda va anon kalit
-- bilan o'qish mumkin — bu ishlab chiqarish (production) uchun xavfsiz
-- emas, faqat loyihaning joriy oddiy arxitekturasiga mos yechim.
alter table public.admins enable row level security;

drop policy if exists "admins_select_anon" on public.admins;
create policy "admins_select_anon" on public.admins
  for select using (true);

-- Namuna: bitta sanatoriyaga admin qo'shish. "name ilike" qismini
-- kerakli sanatoriyaning nomiga moslab o'zgartiring, keyin username va
-- password'ni belgilang.
insert into public.admins (username, password, sanatory_id, display_name)
select 'ibnsino_admin', 'ibnsino123', id, 'Ibn-Sino sanatoriyasi admin'
from public.sanatoriums
where name ilike '%Ibn-Sino%'
limit 1
on conflict (username) do nothing;
