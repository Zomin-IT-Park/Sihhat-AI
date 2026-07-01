import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';

import RootNavigator from './src/navigation';
import { getSession } from './src/lib/auth';

export default function App() {
  const [checking, setChecking] = useState(true);
  const [initialRoute, setInitialRoute] = useState<'Login' | 'AdminTabs'>('Login');

  useEffect(() => {
    getSession().then((session) => {
      setInitialRoute(session ? 'AdminTabs' : 'Login');
      setChecking(false);
    });
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
        <StatusBar style="light" />
        <NavigationContainer>
          <RootNavigator initialRoute={initialRoute} />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
