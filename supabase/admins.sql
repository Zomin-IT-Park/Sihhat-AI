
create table if not exists public.admins (
  id uuid primary key default gen_random_uuid(),
  username text not null unique,
  password text not null,
  sanatory_id integer not null references public.sanatoriums (id),
  display_name text not null,
  created_at timestamptz not null default now()
);


alter table public.admins enable row level security;

drop policy if exists "admins_select_anon" on public.admins;
create policy "admins_select_anon" on public.admins
  for select using (true);


insert into public.admins (username, password, sanatory_id, display_name)
select 'ibnsino_admin', 'ibnsino123', id, 'Ibn-Sino sanatoriyasi admin'
from public.sanatoriums
where name ilike '%Ibn-Sino%'
limit 1
on conflict (username) do nothing;
