Sen Expo/React Native mutaxassisan. Sihhat-AI loyihasini ishga tushirishga tayyorla.

## LOYIHA: Sihhat-AI (Tibbiy AI Ilova)
Expo SDK 52 + Expo Router v4 + React Native 0.76

## HOZIRGI HOLAT:
- app/ papkasida 10 ta .tsx fayl bor (layout, dashboard, chat, health, profile, login, signup, success)
- components/StatusBarIcons.tsx bor
- assets/ papkasi BOSH - rasmlar yo'q
- node_modules bor lekin tozalanishi kerak
- package.json da ba'zi versiyalar noto'g'ri bo'lishi mumkin

## QILISH KERAK:

### 1. AVVALO - Barcha xatoliklarni top:
```
npx tsc --noEmit
```
TypeScript xatoliklarini ko'rsat.

### 2. Assets rasmlarni yarat:
assets/ papkasiga quyidagi rasmlarni qo'sh (Expo default yoki SVG dan):
- icon.png (1024x1024) - yashil fon, oq plus belgisi
- splash.png (1284x2778) - yashil gradient fon, markazda logo
- adaptive-icon.png (1024x1024) - Android uchun
- favicon.png (48x48) - Web uchun

Yechim: `npx expo prebuild --clean` yoki manual yaratish.

### 3. node_modules ni tozala va o'rnats:
```powershell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
```

### 4. app.json ni to'ldir:
Quyidagi maydonlarni qo'sh:
- "scheme": "sihhat-ai"
- "web": { "bundler": "metro" }
- "plugins": ["expo-router", "expo-font"]

### 5. Ishga tushirishga tayyorla:
```bash
npx expo start --clear
```

### 6. Agar xatolik bo'lsa - ularni tuzat:
- Import xatoliklari
- TypeScript xatoliklari
- Routing xatoliklari
- Dependency konfliktlari

## MUHIM QOIDALAR:
- Expo SDK 52 versiyasini ishlat (https://docs.expo.dev ni o'qish kerak)
- Expo Router v4 file-based routing ishlatadi
- React Native 0.76 yangi arxitektura
- lucide-react-native ikonkalar uchun
- expo-linear-gradient gradient fonlar uchun
- Sihhat-AI tibbiy ilova - yashil rang palitrasi (#1B6B3E, #0D4830, #4CAF7C, #F5C842)

## NATIJA:
Loyiha `npx expo start` bilan ishlaydigan bo'lishi kerak. Telefonda Expo Go orqali sinash mumkin.
