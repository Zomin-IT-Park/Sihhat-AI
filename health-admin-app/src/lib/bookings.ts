import { supabase } from './supabase';

export type BookingStatus = 'Kutilmoqda' | 'Qabul qilindi';

export type Booking = {
  id: string;
  username: string;
  sanatory_id: number | null;
  sanatorium_name: string;
  sanatorium_image: string | null;
  region: string | null;
  specialty: string | null;
  first_name: string;
  last_name: string;
  age: string;
  complaint: string;
  price: string | null;
  status: BookingStatus;
  created_at: string;
};

// Admin faqat o'zi mas'ul bo'lgan sanatoriyaga tegishli buyurtmalarni ko'radi.
// sihhat-ai ilovasi bron yaratganda sanatory_id'ni nom bo'yicha (taxminiy)
// qidirib topadi — ba'zan mos kelmasligi mumkin (masalan AI turlicha
// yozgan bo'lsa). Shuning uchun sanatory_id bo'yicha ANIQ moslikdan tashqari,
// sanatorium_name bo'yicha ham (agar sanatoriya nomi berilgan bo'lsa)
// qo'shimcha qidiramiz — hech bir buyurtma "yo'qolib" qolmasligi uchun.
export async function getBookingsBySanatoryId(
  sanatoryId: number,
  sanatoriumName?: string | null,
): Promise<{ data: Booking[]; error: string | null }> {
  let query = supabase.from('bookings').select('*');

  if (sanatoriumName && sanatoriumName.trim()) {
    query = query.or(`sanatory_id.eq.${sanatoryId},sanatorium_name.ilike.%${sanatoriumName.trim()}%`);
  } else {
    query = query.eq('sanatory_id', sanatoryId);
  }

  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data as Booking[]) ?? [], error: null };
}

export async function approveBooking(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('bookings')
    .update({ status: 'Qabul qilindi' })
    .eq('id', id);
  return { error: error?.message ?? null };
}
