import { supabase } from './supabase';

export type BookingStatus = 'Kutilmoqda' | 'Qabul qilindi';

export type Booking = {
  id: string;
  username: string;
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

export type NewBooking = {
  username: string;
  sanatory_id?: number | null;
  sanatorium_name: string;
  sanatorium_image?: string | null;
  region?: string | null;
  specialty?: string | null;
  first_name: string;
  last_name: string;
  age: string;
  complaint: string;
  price?: string | null;
};

// Sihhat-AI (chat) sanatoriya nomini erkin matn shaklida qaytaradi — bu nomni
// rasmiy "sanatoriums" reestridagi yozuvga bog'lash uchun taxminiy (ILIKE)
// qidiruv. Mos yozuv topilmasa, bron baribir davom etadi (sanatory_id: null),
// faqat admin panelida sanatoriya bo'yicha filtrlash ishlamaydi.
export async function findSanatoriumIdByName(name: string): Promise<number | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;
  const { data, error } = await supabase
    .from('sanatoriums')
    .select('id')
    .ilike('name', `%${trimmed}%`)
    .limit(1)
    .maybeSingle();
  if (error || !data) return null;
  return (data as { id: number }).id;
}

export async function createBooking(input: NewBooking): Promise<{ data: Booking | null; error: string | null }> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({ ...input, status: 'Kutilmoqda' })
    .select()
    .single();
  if (error) return { data: null, error: error.message };
  return { data: data as Booking, error: null };
}

export async function getUserBookings(username: string): Promise<{ data: Booking[]; error: string | null }> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('username', username)
    .order('created_at', { ascending: false });
  if (error) return { data: [], error: error.message };
  return { data: (data as Booking[]) ?? [], error: null };
}
