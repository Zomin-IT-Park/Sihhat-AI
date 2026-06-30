import { supabase } from './supabase';
import EncryptedStorage from 'react-native-encrypted-storage';

export type UserSession = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
};

const SESSION_KEY = 'sihhat_session';

export async function register(params: {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<{ error?: string }> {
  const { data, error } = await supabase.rpc('register_user', {
    p_username:   params.username,
    p_password:   params.password,
    p_first_name: params.first_name,
    p_last_name:  params.last_name,
  });
  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };
  return {};
}

export async function login(
  username: string,
  password: string,
): Promise<{ user?: UserSession; error?: string }> {
  const { data, error } = await supabase.rpc('login_user', {
    p_username: username,
    p_password: password,
  });
  if (error) return { error: error.message };
  if (data?.error) return { error: data.error };

  const user: UserSession = {
    id:         data.id,
    username:   data.username,
    first_name: data.first_name,
    last_name:  data.last_name,
  };
  await EncryptedStorage.setItem(SESSION_KEY, JSON.stringify(user));
  return { user };
}

export async function logout(): Promise<void> {
  await EncryptedStorage.removeItem(SESSION_KEY);
}

export async function getSession(): Promise<UserSession | null> {
  const str = await EncryptedStorage.getItem(SESSION_KEY);
  if (!str) return null;
  try { return JSON.parse(str) as UserSession; }
  catch { return null; }
}
