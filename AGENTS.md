# Sihhat-AI - Expo/React Native Tibbiy AI Ilova

## Loyiha haqida
Sihhat-AI - sun'iy intellekt yordamda sog'lig'ingiz haqida g'amxo'rlik qiladigan tibbiy ilova. Expo SDK 52 + Expo Router + React Native.

## Expo MUHIM
Read the exact versioned docs at https://docs.expo.dev before writing any code. Expo SDK 52 ishlatilmoqda.

## Loyiha tuzilmasi
```
sihhat-ai/
├── app/
│   ├── _layout.tsx          # Root layout (Stack navigator)
│   ├── index.tsx            # Welcome dashboard (asosiy ekran)
│   ├── login.tsx            # Login sahifasi
│   ├── signup.tsx           # Ro'yxatdan o'tish
│   ├── success.tsx          # Muvaffaqiyat ekranı
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigator layout
│       ├── index.tsx        # Dashboard tab (AI chat banner, xizmatlar, oxirgi izlanmalar)
│       ├── chat.tsx         # AI Chat suhbat
│       ├── health.tsx       # Dori tekshirish / Salomatlik
│       └── profile.tsx      # Profil
├── components/
│   └── StatusBarIcons.tsx   # iOS status bar mock komponentlari
├── assets/                  # Rasmlar (hali to'ldirilmagan)
├── app.json
├── package.json
└── tsconfig.json
```

## XATOLIKLAR - bunlarni TO'G'RILASH KERAK:

### 1. Assets papkasi bo'sh
`app.json` da quyidagi rasmlar talab qilinadi, lekin ular yo'q:
- `assets/icon.png` - ilova ikonkasi (1024x1024)
- `assets/splash.png` - splash screen rasmi
- `assets/adaptive-icon.png` - Android adaptive icon (1024x1024)
- `assets/favicon.png` - web favicon (48x48)

Yechim: Expo default rasmlarni yaratish yoki `npx expo prebuild` ishlatish.

### 2. node_modules tozalanishi kerak
Eski BirbJS dependencylari qolgan bo'lishi mumkin.
Yechim: `Remove-Item -Recurse -Force node_modules; Remove-Item package-lock.json; npm install`

### 3. App.json to'liq emas
`scheme` va boshqa kerakli maydonlar yo'q.
Yechim: app.json ni to'ldirish.

## Qo'shimcha buyruqlar
Loyihani ishga tushirish uchun:
```bash
# Windows PowerShell
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item package-lock.json -ErrorAction SilentlyContinue
npm install
npx expo start
```

##Texnologiyalar
- Expo SDK 52
- Expo Router v4 (file-based routing)
- React Native 0.76
- TypeScript
- lucide-react-native (ikonkalar)
- expo-linear-gradient (gradient fonlar)
- react-native-safe-area-context
- react-native-reanimated

## UI Rang palitrasi
- Asosiy yashil: #1B6B3E
- To'q yashil: #0D4830
- Och yashil: #4CAF7C
- Sariq aksent: #F5C842
- Oq fon: #FFFFFF
- To'q matn: #111827
- Kulrang matn: #6B7280

## Xabardor qilish
Bu loyiha Sihhat-AI tibbiy ilovasi. Avval BirbJS (Discord bot) kodlari aralashgan edi, ular o'chirildi. Hozir faqat Expo/React Native ilova qoldi.
