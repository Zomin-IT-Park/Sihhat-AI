const API_BASE = 'http://127.0.0.1:8080/api'; // adb reverse tcp:8080 tcp:8080
const TIMEOUT = 30000;

export type ChatResponse =
  | {
      type: 'sanatorium_list';
      sanatoriums: SanatoriumItem[];
      disclaimer: string;
    }
  | {
      type: 'text';
      message: string;
    }
  | {
      type: 'error';
      message: string;
    };

export type SanatoriumItem = {
  name: string;
  address: string;
  phone: string;
  distance: string;
  specialty: string;
  website?: string;
  owner?: string;
  image_url?: string;
};

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);
  try {
    const res = await fetch(`${API_BASE}/chat/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res.json();
  } catch (err: any) {
    clearTimeout(timer);
    if (err?.name === 'AbortError') {
      return { type: 'error', message: 'Server bilan aloqa yo\'q. Backend ishga tushirilganligini tekshiring.' };
    }
    return { type: 'error', message: 'Tarmoq xatoligi. Qayta urinib ko\'ring.' };
  }
}
