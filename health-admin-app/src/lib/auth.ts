import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from './supabase';

export type AdminSession = {
  username: string;
  display_name: string;
  sanatory_id: number;
  sanatorium_name: string | null;
};

const SESSION_KEY = 'health_admin_session';

export async function login(username: string, password: string): Promise<{ user?: AdminSession; error?: string }> {
  const trimmed = username.trim();
  if (!trimmed || !password) {
    return { error: "Login yoki parol noto'g'ri." };
  }
  // sanatoriums(name) — sanatory_id orqali bog'langan sanatoriya nomini ham
  // birga olamiz, buyurtmalarni nom bo'yicha ham moslashtirish uchun kerak.
  const { data, error } = await supabase
    .from('admins')
    .select('username, password, display_name, sanatory_id, sanatoriums(name)')
    .eq('username', trimmed)
    .maybeSingle();

  if (error) return { error: "Server bilan aloqa yo'q. Qayta urinib ko'ring." };
  if (!data || data.password !== password) {
    return { error: "Login yoki parol noto'g'ri." };
  }

  const sanatoriumRel = Array.isArray(data.sanatoriums) ? data.sanatoriums[0] : data.sanatoriums;

  const user: AdminSession = {
    username: data.username,
    display_name: data.display_name,
    sanatory_id: data.sanatory_id,
    sanatorium_name: (sanatoriumRel as { name: string } | null)?.name ?? null,
  };
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { user };
}

export async function logout(): Promise<void> {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function getSession(): Promise<AdminSession | null> {
  const str = await AsyncStorage.getItem(SESSION_KEY);
  if (!str) return null;
  try {
    return JSON.parse(str) as AdminSession;
  } catch {
    return null;
  }
}
