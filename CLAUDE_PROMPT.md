# Sihhat-AI - Tibbiy AI Ilova (Expo/React Native)

## LOYIHA TUZILMASI
```
sihhat-ai/
├── app/
│   ├── _layout.tsx          # Root Stack navigator
│   ├── index.tsx            # Welcome Dashboard (asosiy ekran)
│   ├── login.tsx            # Login sahifasi
│   ├── signup.tsx           # Ro'yxatdan o'tish
│   ├── success.tsx          # Muvaffaqiyat ekranı
│   └── (tabs)/
│       ├── _layout.tsx      # Tab navigator layout
│       ├── index.tsx        # Dashboard (AI chat, xizmatlar, izlanmalar)
│       ├── chat.tsx         # AI Chat suhbat
│       ├── health.tsx       # Dori tekshirish / Salomatlik
│       └── profile.tsx      # Profil
├── components/
│   └── StatusBarIcons.tsx   # iOS status bar mock
├── assets/
│   ├── icon.png             # Ilova ikonkasi (341KB, yashil logo)
│   ├── adaptive-icon.png    # Android adaptive icon
│   ├── splash-icon.png      # Splash screen
│   └── favicon.png          # Web favicon
├── app.json
├── package.json
└── tsconfig.json
```

## TEXNOLOGIYALAR
- Expo SDK 52
- Expo Router v4 (file-based routing)
- React Native 0.76.7
- TypeScript
- lucide-react-native (ikonkalar)
- expo-linear-gradient (gradient fonlar)
- react-native-safe-area-context
- react-native-reanimated

## RANG PALITRASI
- Asosiy yashil: #1B6B3E
- To'q yashil: #0D4830
- Och yashil: #4CAF7C
- Sariq aksent: #F5C842

## HOZIRGI MUAMMOLAR

### 1. Expo Go da loyiha ko'rinmaydi
- Metro bundler to'g'ri ishlashi kerak
- Terminal yopilmasligi kerak
- WiFi bir x tarmoqda bo'lishi kerak

### 2. BUILD FAILED xatoligi
- `npx expo run:android` ishlamaydi
- Expo Go orqali ishga tushirish kerak (build kerak emas)

### 3. Versiya mos kelmasligi
- @expo/vector-icons: 14.1.0 (kutilgan: ~14.0.4)
- react-native: 0.76.7 (kutilgan: 0.76.9)

## YECHIM - CLAUDE QILISHI KERAK:

1. **package.json ni yangila:**
   - react-native versiyasini 0.76.9 ga o'zgartir
   - @expo/vector-icons ni ~14.0.4 ga o'zgartir

2. **node_modules ni tozala va qayta o'rnats:**
   ```powershell
   Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
   Remove-Item package-lock.json -ErrorAction SilentlyContinue
   npm install
   ```

3. **Metro keshini tozala:**
   ```powershell
   Remove-Item -Recurse -Force .expo -ErrorAction SilentlyContinue
   Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
   ```

4. **Expo Go orqali ishga tushir:**
   ```powershell
   npx expo start --clear
   ```
   - QR kodni telefondagi Expo Go orqali skanerla
   - Terminalni YOPMA!

5. **Telefon sozlamalari:**
   - Telefon va kompyuter bir WiFi tarmog'ida bo'lishi kerak
   - Expo Go ilovasi yangi versiyada bo'lishi kerak (2.32.20+)
   - Android: Developer mode yoqilgan bo'lishi kerak

## XULOSA
Loyiha Expo Go orqali ishga tushirilishi kerak. `npx expo run:android` ishlatmaslik kerak. Faqat `npx expo start --clear` va QR kodni skanerlash yetarli.
