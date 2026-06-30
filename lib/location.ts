import { PermissionsAndroid, Platform } from 'react-native';
import Geolocation from 'react-native-geolocation-service';

export type LocationCoords = {
  latitude: number;
  longitude: number;
};

export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    {
      title: 'Joylashuvga ruxsat',
      message: 'Sihhat-AI sizning joylashuvingizni aniqlash uchun ruxsat kerak',
      buttonPositive: 'Ruxsat berish',
      buttonNegative: 'Rad etish',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function requestCameraPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') return true;

  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.CAMERA,
    {
      title: 'Kameraga ruxsat',
      message: 'Sihhat-AI kamera orqali suratga olish uchun ruxsat kerak',
      buttonPositive: 'Ruxsat berish',
      buttonNegative: 'Rad etish',
    },
  );
  return granted === PermissionsAndroid.RESULTS.GRANTED;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (Platform.OS === 'ios') return true;

  try {
    const granted = await PermissionsAndroid.request(
      'android.permission.POST_NOTIFICATIONS' as any,
      {
        title: 'Bildirishnomalarga ruxsat',
        message: 'Sihhat-AI sizga muhim xabarlarni yuborish uchun ruxsat kerak',
        buttonPositive: 'Ruxsat berish',
        buttonNegative: 'Rad etish',
      },
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } catch {
    return false;
  }
}

export async function requestAllPermissions(): Promise<void> {
  await requestLocationPermission();
  await requestCameraPermission();
  await requestNotificationPermission();
}

export async function getCurrentPosition(): Promise<LocationCoords | null> {
  const hasPermission = await requestLocationPermission();
  if (!hasPermission) return null;

  return new Promise((resolve) => {
    Geolocation.getCurrentPosition(
      (pos) => resolve({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
      }),
      () => resolve(null),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  });
}

export function watchPosition(
  onPosition: (coords: LocationCoords) => void,
  onError?: (err: any) => void,
): number | null {
  const id = Geolocation.watchPosition(
    (pos) => onPosition({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    }),
    onError || (() => {}),
    { enableHighAccuracy: true, distanceFilter: 10, interval: 5000 },
  );
  return id;
}

export function clearWatch(id: number | null): void {
  if (id !== null) {
    Geolocation.clearWatch(id);
  }
}

export async function getAddressFromCoords(
  lat: number,
  lng: number,
): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=uz`,
    );
    const data = await res.json();
    if (data?.display_name) {
      const parts = data.display_name.split(', ');
      return parts.slice(0, 3).join(', ');
    }
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}
