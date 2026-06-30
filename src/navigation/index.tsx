import React from 'react';
import { BackHandler, Platform } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { Home, MessageCircle, Pill, User } from 'lucide-react-native';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SuccessScreen from '../screens/SuccessScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import HealthScreen from '../screens/HealthScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParams = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Success: undefined;
  MainTabs: undefined;
};

export type MainTabParams = {
  Home: undefined;
  Chat: undefined;
  Health: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();
const Tab = createBottomTabNavigator<MainTabParams>();

const GREEN = '#1B6B3E';
const INACTIVE = '#9CA3AF';

function MainTabs() {
  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, []),
  );

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: GREEN,
        tabBarInactiveTintColor: INACTIVE,
        tabBarLabelStyle: { fontSize: 10, fontWeight: '600', marginTop: 2 },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 88 : 68,
          paddingBottom: Platform.OS === 'ios' ? 28 : 12,
          paddingTop: 8,
          elevation: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Bosh sahifa',
          tabBarIcon: ({ color, focused }) => (
            <Home size={24} color={color} strokeWidth={focused ? 2.5 : 1.8} />
          ),
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatScreen}
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, focused }) => (
            <MessageCircle size={24} color={color} strokeWidth={focused ? 2.5 : 1.8} />
          ),
        }}
      />
      <Tab.Screen
        name="Health"
        component={HealthScreen}
        options={{
          title: 'Dori',
          tabBarIcon: ({ color, focused }) => (
            <Pill size={24} color={color} strokeWidth={focused ? 2.5 : 1.8} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused }) => (
            <User size={24} color={color} strokeWidth={focused ? 2.5 : 1.8} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function RootNavigator({ initialRoute }: { initialRoute: 'Welcome' | 'MainTabs' }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} />
    </Stack.Navigator>
  );
}
