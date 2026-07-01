declare module '@env' {
  export const SUPABASE_URL: string;
  export const SUPABASE_ANON_KEY: string;
}

// Ba'zi paketlarning tayyor .d.ts fayli node_modules ichida topilmay qolgan
// holatlar uchun zaxira e'lon (build xatosiga yo'l qo'ymaslik uchun).
declare module 'expo-notifications';
declare module 'expo-device';
