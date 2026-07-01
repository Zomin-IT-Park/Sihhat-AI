# Sihhat-AI

O'zbekistondagi sanatoriylar va sog'lomlashtirish markazlarini topish, ular haqida ma'lumot olish va egalari bilan bog'lanish uchun AI yordamchi ilova.

## Maqsad

Sihhat-AI oddiy foydalanuvchilarni O'zbekistondagi sanatoriya va sog'lomlashtirish markazlari egalari bilan bog'laydi. Foydalanuvchilar AI yordamida o'zlariga mos sanatoriyani topadi, uning rasmi, ixtisoslashuvi haqida ma'lumot oladi va bevosita bog'lanish imkoniyatiga ega bo'ladi.

## Imkoniyatlar

- 🤖 AI chat orqali sanatoriyalarni qidirish
- 🌐 Internetdan real vaqtda ma'lumot olish
- 🖼️ Sanatoriyalarning rasmlari va nomlari
- 🏥 Ixtisoslashuv turlari bo'yicha qidirish
- 🗺️ Xaritada ko'rish
- 🌍 Veb-saytga o'tish
- 👤 Foydalanuvchi profili va autentifikatsiya

## Texnologiyalar

**Frontend:**
- React Native 0.76
- TypeScript
- React Navigation
- Lucide React Native
- React Native Linear Gradient

**Backend:**
- Django 6.0 + DRF
- Supabase (auth)
- OpenRouter API
- SQLite

## Ishga tushirish

```bash
# Backend
cd sihhat-ai-backend
pip install -r requirements.txt
python manage.py runserver 0.0.0.0:8080

# Frontend
npm install
npx react-native start
npm run android
```

## Muhim

- Backend `0.0.0.0:8080` da ishlashi kerak
- `adb reverse tcp:8080 tcp:8080` (real device)
- `.env` da OpenRouter API kaliti bo'lishi shart

## Loyiha tuzilmasi

```
sihhat-ai/
├── App.tsx
├── src/
│   ├── screens/        # Ekranlar
│   ├── navigation/     # Navigator
│   └── components/     # Komponentlar
├── lib/                # API sozlamalari
├── sihhat-ai-backend/  # Django backend
└── assets/             # Rasmlar
```
