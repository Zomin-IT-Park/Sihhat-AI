# Sihhat-AI

O'zbekistondagi sanatoriya va sog'lomlashtirish markazlarini topish, ular haqida ma'lumot olish, bron qilish va sanatoriya egalari (admin) tomonidan buyurtmalarni boshqarish uchun AI yordamchi tizim.

## Loyiha tuzilmasi

Bu monorepo 3 ta mustaqil loyihadan iborat:

```
sihhat-ai/
├── sihhat-ai-app/       # Foydalanuvchi mobil ilovasi (bare React Native 0.76)
├── health-admin-app/    # Sanatoriya adminlari uchun mobil ilova (Expo)
├── sihhat-ai-backend/   # Auth + AI-chat backend (Django REST Framework)
├── supabase/            # Umumiy Supabase SQL migratsiyalari va CSV ma'lumotlar
└── README.md
```

Uchala loyiha ham bitta Supabase bazasidan foydalanadi:

- **sihhat-ai-app** — foydalanuvchi ro'yxatdan o'tadi, sanatoriya qidiradi, bron qiladi
- **sihhat-ai-backend** — login/register/profil/AI-chatni boshqaradi (Supabase RPC funksiyalari orqali)
- **health-admin-app** — sanatoriya admin sifatida kirib, o'ziga tegishli bronlarni ko'radi va tasdiqlaydi

## Imkoniyatlar

- AI chat orqali sanatoriyalarni qidirish (ro'yxatdan, topilmasa internetdan)
- Sanatoriyani bron qilish va to'lov qilish oqimi
- Bron holatini kuzatish (Kutilmoqda / Qabul qilindi)
- Har bir sanatoriyaga tegishli admin panel orqali bronlarni tasdiqlash
- Foydalanuvchi profilini tahrirlash

## Talab qilinadigan dasturlar

| Dastur | Nima uchun |
|---|---|
| Node.js 18+ va npm | ikkala mobil ilova uchun |
| Python 3.10+ va pip | backend uchun |
| Android Studio (Android SDK + emulyator yoki jismoniy telefon) | ilovalarni ishga tushirish uchun |
| JDK 17 | Android build uchun |

## 1. Supabase bazasini sozlash (bir marta)

`supabase/` papkasidagi SQL fayllarni Supabase loyihangizning **SQL Editor**ida **shu tartibda** ishga tushiring:

1. `sanatoriums.sql` — sanatoriyalar jadvali
2. `sanatoriums.csv` — Table Editor orqali shu jadvalga import qiling
3. `bookings.sql` — bronlar jadvali (`sanatory_id` FK orqali sanatoriumsga bog'langan)
4. `admins.sql` — har bir sanatoriyaga tegishli admin login jadvali
5. `update_user_profile.sql` — profilni tahrirlash uchun RPC funksiya (agar sizning `users` jadvalingiz ustun nomlari boshqacha bo'lsa, faylning ichidagi izohlarga qarab moslang)

`login_user` / `register_user` RPC funksiyalari allaqachon loyihangizda mavjud bo'lishi kerak (backend shularga tayanadi).

## 2. sihhat-ai-app (foydalanuvchi ilovasi)

```bash
cd sihhat-ai-app
npm install --legacy-peer-deps
npx react-native run-android --port 8081
```

> Diqqat: `health-admin-app` uchun `react-native run-android` ISHLATILMAYDI — u Expo loyiha, o'zining `android/` papkasi yo'q. Pastdagi 3-bo'limga qarang (`npx expo start`).

> `--legacy-peer-deps` shart — `lucide-react-native` eski `react-native-svg` versiyasini so'raydi, lekin loyihadagi yangi versiya bilan ham muammosiz ishlaydi. Bu shunchaki ogohlantirish, real xato emas.

Metro serverini alohida ishga tushirish kerak bo'lsa:

```bash
npx react-native start
```

`.env` fayli (`SUPABASE_URL`, `SUPABASE_ANON_KEY`) allaqachon loyihada mavjud.

## 3. health-admin-app (admin ilovasi)

```bash
cd health-admin-app
npm install --legacy-peer-deps
npx expo start
```

Keyin terminalda `a` tugmasini bosib Android emulyator/qurilmada oching, yoki Expo Go ilovasi orqali QR kodni skaner qiling.

**Diqqat:** bu Expo loyiha — `npx react-native run-android` ishlatilmaydi, faqat `npx expo start`.

## 4. sihhat-ai-backend (Django backend)

```bash
cd sihhat-ai-backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 0.0.0.0:8080
```

`.env` faylida quyidagilar bo'lishi shart:

```
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
OPENAI_API_KEY=...   # OpenRouter kaliti — AI-chat uchun
```

### Jismoniy telefonda ishlatish (emulyator emas)

Backend kompyuterda `127.0.0.1:8080` da ishlaydi, lekin telefon uni to'g'ridan-to'g'ri ko'ra olmaydi. USB orqali ulangan bo'lsa:

```bash
adb reverse tcp:8080 tcp:8080
```

Emulyatorda ishlatilsa, qo'shimcha sozlash odatda shart emas — aks holda `ALLOWED_HOSTS` va ilova ichidagi backend manzilini telefon tarmog'idagi kompyuter IP'siga moslang.

### Backend API

| Method | Endpoint | Vazifasi |
|---|---|---|
| POST | `/api/auth/login/` | Kirish |
| POST | `/api/auth/register/` | Ro'yxatdan o'tish |
| POST | `/api/auth/profile/` | Profilni tahrirlash |
| POST | `/api/chat/` | AI-chat (sanatoriya tavsiyasi) |
| GET | `/api/health/` | Holat tekshiruvi |

## Muammolarni bartaraf etish

**"ERESOLVE could not resolve" / peer dependency xatosi** — `npm install --legacy-peer-deps` bilan o'rnating, bu real xato emas.

**`npm audit fix --force` ishlatmang** — bu `@react-native-community/cli` kabi paketlarni mos kelmaydigan major versiyaga ko'tarib, ilovani ishlamay qolishiga sabab bo'lishi mumkin. Xavfsizlik ogohlantirishlari faqat dev-vositalarga tegishli, ilovaning o'ziga ta'sir qilmaydi.

**Metro "port band" xatosi** — ikkala mobil ilova ham bir vaqtda ishga tushirilsa, portlar to'qnashishi mumkin: `npx react-native start --port 8088` (sihhat-ai-app) va `npx expo start --port 8082` (health-admin-app) kabi turli portlardan foydalaning.

**`run-android` "No connected devices"** — Android emulyatorni oldindan qo'lda ishga tushiring (Android Studio > Device Manager) yoki USB orqali haqiqiy telefon ulang (`adb devices` bilan tekshiring), so'ng buyruqni qayta ishga tushiring.

**health-admin-app'da `react-native run-android` ishlatmang** — bu Expo loyiha, faqat `npx expo start` ishlatiladi.

## Texnologiyalar

**Mobil ilovalar:** React Native 0.76, TypeScript, React Navigation, Lucide React Native, Supabase JS client

**Backend:** Django 5 + DRF, Supabase (auth/RPC), OpenRouter (AI-chat), SQLite (Django admin uchun)
