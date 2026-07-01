import { supabase } from './supabase';

export type SanatoriumRecord = {
  id: number;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  tin: string | null;
  responsible_person: string | null;
  image_url: string | null;
};

// Excel'dan yuklangan rasmiy reestr ("sanatoriums" jadvali) bo'yicha nom
// orqali qidiruv. Foydalanuvchi muassasa nomini (to'liq yoki qisman) yozsa,
// shu ro'yxatdan mos yozuvlarni topadi. Hech narsa topilmasa, bo'sh massiv
// qaytadi va chaqiruvchi kod AI-chat orqali qidiruvga o'tadi.
export async function searchSanatoriumsByName(query: string, limit = 5): Promise<SanatoriumRecord[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const { data, error } = await supabase
    .from('sanatoriums')
    .select('id, name, address, phone, email, tin, responsible_person, image_url')
    .ilike('name', `%${trimmed}%`)
    .limit(limit);
  if (error || !data) return [];
  return data as SanatoriumRecord[];
}

// "Menga yaqin hududlar" bo'limi uchun — GPS orqali topilgan shahar/tuman
// nomi bizning manzil (address) ustuni bilan matn sifatida solishtiriladi
// (aniq koordinata masofasi emas, taxminiy moslik).
export async function searchSanatoriumsByRegion(regionText: string, limit = 5): Promise<SanatoriumRecord[]> {
  const trimmed = regionText.trim();
  if (!trimmed) return [];
  // Manzil matnidan eng ma'nodor (uzun) so'zni ajratib olamiz — masalan
  // "Toshkent shahri, Chilonzor tumani" ichidan "Chilonzor" kabi.
  const keyword = trimmed
    .split(/[,\s]+/)
    .filter(w => w.length >= 3)
    .sort((a, b) => b.length - a.length)[0] || trimmed;

  const { data, error } = await supabase
    .from('sanatoriums')
    .select('id, name, address, phone, email, tin, responsible_person, image_url')
    .ilike('address', `%${keyword}%`)
    .limit(limit);
  if (error || !data) return [];
  return data as SanatoriumRecord[];
}
