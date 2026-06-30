import React, { useEffect, useState } from 'react';
import { StatusBar, PermissionsAndroid, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RootNavigator from './src/navigation';
import { getSession } from './lib/auth';

async function requestPermissions() {
  if (Platform.OS !== 'android') return;
  try {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.CAMERA,
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    ]);
  } catch {}
}

export default function App() {
  const [initialRoute, setInitialRoute] = useState<'Welcome' | 'MainTabs' | null>(null);

  useEffect(() => {
    requestPermissions();
    getSession().then((session) => {
      setInitialRoute(session ? 'MainTabs' : 'Welcome');
    });
  }, []);

  if (!initialRoute) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar hidden />
        <NavigationContainer>
          <RootNavigator initialRoute={initialRoute} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
