import React, { createContext, useCallback, useContext, useRef } from 'react';
import { BackHandler, Platform, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
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

type TabBarCtx = { setVisible: (v: boolean) => void };
export const TabBarContext = createContext<TabBarCtx>({ setVisible: () => {} });

const ICON_MAP: Record<string, typeof Home> = {
  Home, Chat: MessageCircle, Health: Pill, Profile: User,
};

function AnimatedTabBar({ state, descriptors, navigation, tabOffset }: BottomTabBarProps & { tabOffset: Animated.SharedValue<number> }) {
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: withTiming(tabOffset.value, { duration: 200 }) }],
  }));

  return (
    <Animated.View style={[tabStyles.container, animatedStyle]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.title || route.name;
        const isFocused = state.index === index;
        const Icon = ICON_MAP[route.name] || Home;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={tabStyles.item} activeOpacity={0.7}>
            <Icon size={24} color={isFocused ? GREEN : INACTIVE} strokeWidth={isFocused ? 2.5 : 1.8} />
            <Text style={[tabStyles.label, { color: isFocused ? GREEN : INACTIVE }]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </Animated.View>
  );
}

const tabStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 12,
    height: Platform.OS === 'ios' ? 88 : 68,
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  label: { fontSize: 10, fontWeight: '600', marginTop: 2 },
});

function MainTabs() {
  const tabOffset = useSharedValue(0);

  const setVisible = useCallback((visible: boolean) => {
    tabOffset.value = withTiming(visible ? 0 : 100, { duration: 200 });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const sub = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => sub.remove();
    }, []),
  );

  return (
    <TabBarContext.Provider value={{ setVisible }}>
      <Tab.Navigator
        tabBar={(props) => <AnimatedTabBar {...props} tabOffset={tabOffset} />}
        screenOptions={{
          headerShown: false,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Bosh sahifa' }} />
        <Tab.Screen name="Chat" component={ChatScreen} options={{ title: 'AI Chat' }} />
        <Tab.Screen name="Health" component={HealthScreen} options={{ title: 'Dori' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
      </Tab.Navigator>
    </TabBarContext.Provider>
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
      <Stack.Screen name="MainTabs" component={MainTabs} options={{ gestureEnabled: false }} />
    </Stack.Navigator>
  );
}
