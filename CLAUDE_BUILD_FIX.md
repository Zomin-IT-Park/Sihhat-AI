# CLAUDE UCHUN PROMPT - BUILD FAILED XATOLIGINI TUZATISH

## MUAMMO:
Expo ilovasini ishga tushirishda Gradle BUILD FAILED xatoligi chiqyapti:
```
BUILD FAILED in 10m 9s
```

## SABABLARI:
1. Java/JDK versiyasi noto'g'ri (JDK 17 kerak)
2. Android SDK to'liq o'rnatilmagan
3. Gradle versiyasi noto'g'ri
4. Xotira yetarli emas
5. Eski build fayllari qolgan

## YECHIM - QUYIDAGILARNI QIL:

### 1. Java versiyasini tekshir:
```powershell
java -version
```
JDK 17 bo'lishi kerak. Agar JDK 21 yoki boshqa bo'lsa, JDK 17 o'rnating.

### 2. ANDROID_HOME muhit o'zgaruvchisini tekshir:
```powershell
echo $env:ANDROID_HOME
```
`C:\Users\<username>\AppData\Local\Android\Sdk` bo'lishi kerak.

### 3. Build fayllarini tozala:
```powershell
cd C:\Users\0091\Desktop\sihhat-ai
Remove-Item -Recurse -Force android -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force ios -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules\.cache -ErrorAction SilentlyContinue
```

### 4. Prebuild ni qayta ishga tushir:
```powershell
npx expo prebuild --clean
```

### 5. Gradle xotirasini oshir:
`android/gradle.properties` faylini och va qo'sh:
```
org.gradle.jvmargs=-Xmx4096m -XX:MaxMetaspaceSize=512m
org.gradle.daemon=true
org.gradle.parallel=true
```

### 6. Qayta build qil:
```powershell
npx expo run:android
```

### 7. Agar hali ham xatolik bo'lsa:
```powershell
# Gradle ni tozala
cd android
.\gradlew clean
cd ..

# Qayta prebuild
npx expo prebuild --clean

# Qayta ishga tushir
npx expo start --clear
```

### 8. Expo Go orqali sinab ko'r (build kerak emas):
```powershell
npx expo start --clear
```
QR kodni telefondagi Expo Go ilovasi orqali skanerlang.

## MUHIM:
- Expo Go ilovasi orqali ishga tushirish uchun `npx expo run:android` kerak EMAS
- Faqat `npx expo start` ishlatish kerak
- Expo Go ilovasi orqali QR kodni skanerlash yetarli
