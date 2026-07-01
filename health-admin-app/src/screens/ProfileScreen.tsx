import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LogOut, Building2, BadgeCheck } from 'lucide-react-native';
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
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Building2 size={18} color={GREEN} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Sanatoriya</Text>
              <Text style={styles.infoValue}>{admin?.sanatorium_name ?? '—'}</Text>
            </View>
          </View>
          <View style={styles.infoDivider} />
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <BadgeCheck size={18} color={GREEN} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoLabel}>Lavozim</Text>
              <Text style={styles.infoValue}>Administrator</Text>
            </View>
          </View>
        </View>

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
  infoCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 6, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', padding: 12, gap: 12 },
  infoIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#F0F7F3',
    alignItems: 'center', justifyContent: 'center',
  },
  infoLabel: { fontSize: 11.5, color: '#8E8E93', fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 14.5, color: '#1C1C1E', fontWeight: '700' },
  infoDivider: { height: 1, backgroundColor: '#F2F2F7', marginHorizontal: 12 },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: GREEN, borderRadius: 14, padding: 16, gap: 8,
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
