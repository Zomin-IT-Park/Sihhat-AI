// Sanatoriya rasmlari uchun yordamchi funksiya.
// Backend (chat API) rasm bermasa, sanatoriya nomiga bog'liq (seed asosida)
// takrorlanmaydigan fon rasm avtomatik biriktiriladi — API kalit talab qilmaydi.
// Kelajakda haqiqiy fotosuratlar kerak bo'lsa, bu yerga Pexels/Unsplash API
// chaqiruvini qo'shish kifoya, chaqiruvchi kod o'zgarmaydi.
export function getSanatoriumImage(name: string, existingUrl?: string | null): string {
  if (existingUrl && existingUrl.trim()) return existingUrl;
  const seed = encodeURIComponent(name.trim().toLowerCase() || 'sihhat-ai');
  return `https://picsum.photos/seed/${seed}/800/600`;
}
