# Sihhat-AI

Sizning shaxsiy tibbiy sunʼiy intellekt yordamchingiz. Salomatligingizni xavfsiz nazorat qiling.

## Xususiyatlar

- 🤖 AI bilan suhbat - tibbiy savollaringizga javob oling
- 💪 Salomatlik kuzatuvi - yurak urishi, faollik, suv va uyquni kuzating
- 🔒 Maxfiylik - maʼlumotlaringiz toʻliq himoyalangan
- 📱 iOS uslubida chiroyli dizayn

## O'rnatish

```bash
# Node.js va npm o'rnatilgan bo'lishi kerak
npm install
```

## Ishga tushirish

```bash
# iOS uchun
npm run ios

# Android uchun
npm run android

# Web uchun
npm run web
```

## Loyiha tuzilmasi

```
sihhat-ai/
├── app/                    # Expo Router sahifalari
│   ├── _layout.tsx        # Root layout
│   ├── index.tsx          # Bosh sahifa
│   └── (tabs)/            # Tab navigatsiya
│       ├── _layout.tsx    # Tab layout
│       ├── index.tsx      # Bosh sahifa tab
│       ├── chat.tsx       # Suhbat tab
│       ├── health.tsx     # Salomatlik tab
│       └── profile.tsx    # Profil tab
├── assets/                # Rasmlar va resurslar
├── components/            # Qayta ishlatiladigan komponentlar
├── constants/             # Konstantalar
├── hooks/                 # Maxsus React hookslar
└── package.json
```

## Texnologiyalar

- [Expo](https://expo.dev) - React Native framework
- [Expo Router](https://docs.expo.dev/router/introduction) - File-based navigatsiya
- [Lucide React Native](https://lucide.dev) - Ikonkalar
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) - Animatsiyalar

## Litsenziya

MIT
