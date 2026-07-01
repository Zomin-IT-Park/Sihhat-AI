# Sihhat-AI

O'zbekistondagi sanatoriylar va sog'lomlashtirish markazlari haqida ma'lumot beruvchi AI yordamchi.

## Imkoniyatlar

- AI chat orqali sanatoriyalar haqida ma'lumot olish
- Internetdan real vaqtda qidirish (Perplexity Sonar Pro)
- Sanatoriyalarning rasmi, nomi, ixtisoslashuvi
- Xaritada ko'rish va veb-saytga o'tish
- Foydalanuvchi joylashuviga asoslangan tavsiyalar
- Ro'yxatdan o'tish va profil
-Foydalanuvchilar hadma Sog'lomlashtirish maskanlarini bir biri bilan ulash. 

## Texnologiyalar

**Frontend:**
- React Native 0.76
- TypeScript
- React Navigation
- Lucide React Native (ikonkalar)
- React Native Linear Gradient
- React Native Geolocation Service

**Backend:**
- Django 6.0 + Django REST Framework
- Supabase (auth uchun)
- OpenRouter API (Perplexity Sonar Pro / GPT-4o-mini)
- SQLite

## Ishga tushirish

```bash
# Backend
cd sihhat-ai-backend
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8080

# Frontend (yangi terminalda)
npm install
npx react-native start
npm run android
```

## Muhim

- Backend `0.0.0.0:8080` da ishlashi kerak
- `adb reverse tcp:8080 tcp:8080` (real device uchun)
- `.env` faylida OpenRouter API kaliti bo'lishi shart

## Loyiha tuzilmasi

```
sihhat-ai/
├── App.tsx                 # Asosiy ilova
├── src/
│   ├── screens/            # Ekranlar
│   │   ├── ChatScreen.tsx  # AI chat
│   │   ├── HealthScreen.tsx# Qidiruv ekrani
│   │   ├── HomeScreen.tsx  # Bosh sahifa
│   │   ├── LoginScreen.tsx # Kirish
│   │   └── ...
│   └── navigation/         # Navigator
├── lib/                    # API sozlamalari
│   ├── auth.ts             # Login/register
│   ├── chat.ts             # AI chat API
│   └── location.ts         # Joylashuv
├── sihhat-ai-backend/      # Django backend
│   ├── apps/api/views.py   # Chat, health check API
│   ├── apps/users/views.py # Auth (Supabase)
│   └── .env                # API kalitlar
└── assets/                 # Rasmlar
```
