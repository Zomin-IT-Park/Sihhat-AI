import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import RootNavigator from './src/navigation';
import { getSession } from './src/lib/auth';
import { requestNotificationPermission } from './src/lib/notifications';

export default function App() {
  const [checking, setChecking] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Login' | 'AdminTabs'>('Login');

  useEffect(() => {
    getSession().then((session) => {
      setInitialRoute(session ? 'AdminTabs' : 'Login');
      setChecking(false);
    });
    requestNotificationPermission();
  }, []);

  if (checking) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F2F6F4' }}>
        <ActivityIndicator size="large" color="#1B6B3E" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" />
        <NavigationContainer>
          <RootNavigator initialRoute={initialRoute} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
