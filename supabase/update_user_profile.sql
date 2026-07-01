-- Profilni tahrirlash (ProfileScreen -> lib/auth.ts -> updateProfile) uchun
-- Supabase RPC funksiyasi. login_user / register_user RPC'lari qanday
-- jadvalga yozgan bo'lsa (odatda public.users), shu funksiya ham o'sha
-- jadvalni yangilaydi.
--
-- DIQQAT: agar sizning jadval nomi "users" emas yoki ustun nomlari
-- (username / password / first_name / last_name) boshqacha bo'lsa,
-- pastdagi "public.users" va ustun nomlarini shunga moslab o'zgartiring —
-- men bu yerdan sizning haqiqiy Supabase sxemangizni ko'ra olmayman,
-- shuning uchun login_user/register_user bilan bir xil konventsiyaga
-- asoslanib yozdim.

create or replace function public.update_user_profile(
  p_id uuid,
  p_first_name text,
  p_last_name text,
  p_username text,
  p_password text default null
)
returns json
language plpgsql
security definer
as $$
declare
  v_existing record;
  v_row record;
begin
  -- Username boshqa foydalanuvchida band emasligini tekshirish
  select id into v_existing
  from public.users
  where username = p_username and id <> p_id
  limit 1;

  if found then
    return json_build_object('error', 'Bu foydalanuvchi nomi band');
  end if;

  if p_password is not null and p_password <> '' then
    update public.users
    set first_name = p_first_name,
        last_name = p_last_name,
        username = p_username,
        password = p_password
    where id = p_id
    returning id, username, first_name, last_name into v_row;
  else
    update public.users
    set first_name = p_first_name,
        last_name = p_last_name,
        username = p_username
    where id = p_id
    returning id, username, first_name, last_name into v_row;
  end if;

  if not found then
    return json_build_object('error', 'Foydalanuvchi topilmadi');
  end if;

  return json_build_object(
    'id', v_row.id,
    'username', v_row.username,
    'first_name', v_row.first_name,
    'last_name', v_row.last_name
  );
end;
$$;

grant execute on function public.update_user_profile(uuid, text, text, text, text) to anon, authenticated;
