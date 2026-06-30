import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Settings, Bell, Shield, LogOut } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getSession, logout, type UserSession } from '../../lib/auth';
import { TabBarContext, type RootStackParams } from '../navigation';

const MENU_ITEMS = [
  { id: '1', title: 'Sozlamalar', icon: Settings },
  { id: '2', title: 'Bildirishnomalar', icon: Bell },
  { id: '3', title: 'Maxfiylik', icon: Shield },
];

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [user, setUser] = useState<UserSession | null>(null);
  const { setVisible } = useContext(TabBarContext);
  const lastY = useRef(0);

  useEffect(() => {
    getSession().then(setUser);
  }, []);

  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  }

  const onScroll = useCallback((e: any) => {
    const y = e.nativeEvent.contentOffset.y;
    if (y > lastY.current && y > 50) {
      setVisible(false);
    } else if (y < lastY.current || y <= 0) {
      setVisible(true);
    }
    lastY.current = y;
  }, [setVisible]);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView style={styles.content}
        onScroll={onScroll} scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: 32 }}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <User size={48} color="#8E8E93" />
          </View>
          <Text style={styles.name}>
            {user ? `${user.first_name} ${user.last_name}` : '—'}
          </Text>
          <Text style={styles.username}>@{user?.username ?? '—'}</Text>
        </View>

        <View style={styles.menuSection}>
          {MENU_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.menuItem}>
              <View style={styles.menuIcon}>
                <item.icon size={20} color="#007AFF" />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut size={20} color="#FF3B30" />
          <Text style={styles.logoutText}>Chiqish</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    backgroundColor: '#FFFFFF', padding: 16,
    borderBottomWidth: 1, borderBottomColor: '#E5E5EA',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1C1C1E', textAlign: 'center' },
  content: { flex: 1, padding: 16 },
  avatarSection: { alignItems: 'center', paddingVertical: 32 },
  avatar: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#E5E5EA',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  name: { fontSize: 22, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  username: { fontSize: 15, color: '#8E8E93' },
  menuSection: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderBottomWidth: 1, borderBottomColor: '#E5E5EA',
  },
  menuIcon: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#F2F2F7',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  menuTitle: { fontSize: 16, color: '#1C1C1E' },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginTop: 24, gap: 8,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#FF3B30' },
});
