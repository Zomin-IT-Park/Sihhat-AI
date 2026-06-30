import EncryptedStorage from 'react-native-encrypted-storage';

const API_BASE = 'http://127.0.0.1:8080/api/auth';
const TIMEOUT = 8000;

export type UserSession = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
};

const SESSION_KEY = 'sihhat_session';

async function apiPost(path: string, body: Record<string, string>) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.json();
  } catch (err: any) {
    clearTimeout(timer);
    if (err?.name === 'AbortError') {
      return { error: 'Server bilan aloqa yo\'q. Backend ishga tushirilganligini tekshiring.' };
    }
    return { error: 'Tarmoq xatoligi. Qayta urinib ko\'ring.' };
  }
}

export async function register(params: {
  username: string;
  password: string;
  first_name: string;
  last_name: string;
}): Promise<{ error?: string }> {
  const json = await apiPost('/register/', {
    username: params.username,
    password: params.password,
    first_name: params.first_name,
    last_name: params.last_name,
  });
  if (json.error) return { error: json.error };
  return {};
}

export async function login(
  username: string,
  password: string,
): Promise<{ user?: UserSession; error?: string }> {
  const json = await apiPost('/login/', { username, password });
  if (json.error) return { error: json.error };

  const user: UserSession = {
    id: json.user.id,
    username: json.user.username,
    first_name: json.user.first_name,
    last_name: json.user.last_name,
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
  try {
    return JSON.parse(str) as UserSession;
  } catch {
    return null;
  }
}
