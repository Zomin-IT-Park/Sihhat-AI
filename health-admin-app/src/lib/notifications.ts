import { PermissionsAndroid, Platform } from 'react-native';

// Ilova ochilganda bildirishnoma ruxsatini so'raydi. Android 13+ (API 33+)
// runtime'da alohida ruxsat talab qiladi; undan pastki versiyalarda
// ruxsat avtomatik berilgan hisoblanadi. iOS uchun bu loyihada alohida
// native modul ulanmagani sababli hozircha faqat Android qo'llab-quvvatlanadi.
export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;

  if (Platform.Version < 33) {
    // Android 12 va pastda POST_NOTIFICATIONS ruxsati mavjud emas -
    // bildirishnomalar standart holda ruxsat etilgan.
    return true;
  }

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      {
        title: 'Bildirishnomalar',
        message: 'Yangi buyurtmalar haqida xabar olish uchun bildirishnomalarga ruxsat bering.',
        buttonPositive: 'Ruxsat berish',
        buttonNegative: 'Bekor qilish',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}
