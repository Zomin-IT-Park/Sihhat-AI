import 'react-native-url-polyfill/auto';
import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as NavigationBar from 'expo-navigation-bar';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { requestCameraPermissionsAsync } from 'expo-camera';
import { getSession } from '../lib/auth';

async function hideSystemUI() {
  await NavigationBar.setVisibilityAsync('hidden');
  await NavigationBar.setBehaviorAsync('overlay-swipe');
}

async function requestPermissions() {
  try { await Notifications.requestPermissionsAsync(); } catch {}
  try { await Location.requestForegroundPermissionsAsync(); } catch {}
  try { await requestCameraPermissionsAsync(); } catch {}
}

export default function RootLayout() {
  const router = useRouter();

  useEffect(() => {
    hideSystemUI();
    const sub = AppState.addEventListener('change', (s) => {
      if (s === 'active') hideSystemUI();
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    requestPermissions();
  }, []);

  useEffect(() => {
    getSession().then((session) => {
      if (session) router.replace('/(tabs)');
    });
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="login" />
        <Stack.Screen name="success" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </SafeAreaProvider>
  );
}
