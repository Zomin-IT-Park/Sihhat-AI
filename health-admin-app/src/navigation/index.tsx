import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ClipboardList, User } from 'lucide-react-native';

import LoginScreen from '../screens/LoginScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParams = {
  Login: undefined;
  AdminTabs: undefined;
};

export type AdminTabParams = {
  Orders: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();
const Tab = createBottomTabNavigator<AdminTabParams>();

const GREEN = '#1B6B3E';
const INACTIVE = '#9CA3AF';
const ICONS: Record<string, typeof ClipboardList> = { Orders: ClipboardList, Profile: User };
const LABELS: Record<string, string> = { Orders: 'Buyurtmalarim', Profile: 'Profil' };

function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.tabCard}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const Icon = ICONS[route.name] || ClipboardList;
          const label = LABELS[route.name] || route.name;
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.tabItem}
              activeOpacity={0.7}
              onPress={() => navigation.navigate(route.name)}
            >
              <Icon size={22} color={isFocused ? GREEN : INACTIVE} strokeWidth={isFocused ? 2.5 : 1.8} />
              <Text style={[styles.tabLabel, isFocused && styles.tabLabelActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

function AdminTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator({ initialRoute }: { initialRoute: 'Login' | 'AdminTabs' }) {
  return (
    <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="AdminTabs" component={AdminTabs} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    position: 'absolute', bottom: 24, left: 16, right: 16,
    borderRadius: 24, backgroundColor: '#FFFFFF',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 16, elevation: 10,
  },
  tabCard: {
    flexDirection: 'row', height: 64, borderRadius: 24,
    alignItems: 'center', justifyContent: 'space-around',
  },
  tabItem: { alignItems: 'center', justifyContent: 'center', gap: 4, paddingTop: Platform.OS === 'ios' ? 0 : 2 },
  tabLabel: { fontSize: 11, fontWeight: '600', color: INACTIVE },
  tabLabelActive: { color: GREEN, fontWeight: '700' },
});
