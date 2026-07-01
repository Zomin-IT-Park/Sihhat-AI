import React from 'react';
import { BackHandler, Platform, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { Home, MessageCircle, Search, User, ShoppingBag } from 'lucide-react-native';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import SuccessScreen from '../screens/SuccessScreen';
import BookingScreen from '../screens/BookingScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import HealthScreen from '../screens/HealthScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type RootStackParams = {
  Welcome: undefined;
  Login: undefined;
  SignUp: undefined;
  Success: undefined;
  MainTabs: undefined;
  Booking: { sanatoriumName?: string; specialty?: string };
};

export type MainTabParams = {
  Home: undefined;
  Chat: undefined;
  Health: undefined;
  Orders: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParams>();
const Tab = createBottomTabNavigator<MainTabParams>();

const INACTIVE = '#9CA3AF';
const ICONS: Record<string, typeof Home> = {
  Home, Chat: MessageCircle, Health: Search, Orders: ShoppingBag, Profile: User,
};
const LABELS: Record<string, string> = {
  Home: 'Bosh sahifa',
  Chat: 'AI dan maslahat',
  Health: 'Qidiruv',
  Orders: 'Buyurtmalarim',
  Profile: 'Profil',
};

function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  return (
    <View style={customTab.container}>
      <View style={customTab.card}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const Icon = ICONS[route.name] || Home;
          const label = LABELS[route.name] || route.name;

          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };

          if (route.name === 'Chat') return null;
          return (
            <TouchableOpacity key={route.key} style={customTab.item} activeOpacity={0.7} onPress={onPress}>
              <View style={customTab.iconWrap}>
                {isFocused && (
                  <LinearGradient
                    colors={['rgba(7, 94, 69, 0.85)', 'rgba(245, 200, 66, 0.7)']}
                    start={{ x: 0, y: 1 }}
                    end={{ x: 1, y: 0 }}
                    style={customTab.activeBg}
                  />
                )}
                <Icon size={isFocused ? 24 : 22} color={isFocused ? '#FFFFFF' : INACTIVE} strokeWidth={isFocused ? 2.5 : 1.8} />
              </View>
              <Text style={[customTab.label, isFocused && customTab.labelActive]}>{label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const customTab = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    left: 16,
    right: 16,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 10,
  },
  card: {
    flexDirection: 'row',
    height: 66,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingTop: 0,
  },
  item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    paddingTop: 4,
  },
  iconWrap: {
    width: 38,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  activeBg: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    shadowColor: '#F5C842',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 10,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#9CA3AF',
    marginTop: 3,
  },
  labelActive: {
    color: '#075E45',
    fontWeight: '700',
  },
});

function MainTabs() {
  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, []),
  );

  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false, tabBarActiveTintColor: '#075E45', tabBarInactiveTintColor: '#9CA3AF' }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chat" component={ChatScreen} />
      <Tab.Screen name="Health" component={HealthScreen} />
      <Tab.Screen name="Orders" component={OrdersScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
