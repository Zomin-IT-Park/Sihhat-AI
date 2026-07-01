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

// Admin faqat o'zi mas'ul bo'lgan sanatoriyaga (sanatory_id) tegishli
// buyurtmalarni ko'radi.
export async function getBookingsBySanatoryId(sanatoryId: number): Promise<{ data: Booking[]; error: string | null }> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('sanatory_id', sanatoryId)
    .order('created_at', { ascending: false });
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
