import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { getSession, logout, type AdminSession } from '../lib/auth';
import type { RootStackParams } from '../navigation';

const GREEN = '#1B6B3E';
const DARK_GREEN = '#075E45';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [admin, setAdmin] = useState<AdminSession | null>(null);

  useEffect(() => {
    getSession().then(setAdmin);
  }, []);

  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
  }

  const initials = admin ? admin.display_name.trim().slice(0, 2).toUpperCase() : '?';

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_GREEN} />

      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <Text style={styles.name}>{admin?.display_name ?? '—'}</Text>
        <Text style={styles.username}>@{admin?.username ?? '—'}</Text>
      </View>

      <View style={styles.content}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.85}>
          <LogOut size={20} color="#FFFFFF" strokeWidth={2.2} />
          <Text style={styles.logoutText}>Chiqish</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F6F4' },
  header: {
    backgroundColor: DARK_GREEN,
    alignItems: 'center', justifyContent: 'center',
    paddingTop: 24, paddingBottom: 40,
    borderBottomLeftRadius: 32, borderBottomRightRadius: 32,
  },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 14, borderWidth: 2, borderColor: 'rgba(255,255,255,0.35)',
  },
  avatarText: { fontSize: 30, fontWeight: '800', color: '#FFFFFF' },
  name: { fontSize: 19, fontWeight: '800', color: '#FFFFFF' },
  username: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  content: { flex: 1, padding: 20 },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: GREEN, borderRadius: 14, padding: 16, gap: 8,
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
