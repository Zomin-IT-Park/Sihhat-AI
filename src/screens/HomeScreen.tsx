import React, { useEffect, useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Bell, User, Search, MapPin, TreeDeciduous, MessageCircle, ShoppingBag, Navigation } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { getSession, type UserSession } from '../../lib/auth';
import type { MainTabParams } from '../navigation';
import { getAddressFromCoords, getCurrentPosition, requestAllPermissions, watchPosition, clearWatch } from '../../lib/location';

const categories = [
  { icon: MapPin, label: 'Joylar', color: '#075E45' },
  { icon: ShoppingBag, label: 'Bron qilish', color: '#1B8A5E' },
  { icon: MessageCircle, label: "Qo'llab-quvvatlash", color: '#0D4830' },
];

const services = [
  { icon: TreeDeciduous, label: 'Sog\'lomlashtirish joylarini qidirish', desc: 'Sanatoriya va kurortlarni toping', color: '#075E45' },
  { icon: MapPin, label: 'Xarita orqali', desc: 'Yaqin atrofdagi shifoxonalar', color: '#E74C3C' },
  { icon: ShoppingBag, label: 'Joyni bron qilish', desc: 'Shifoxona va sanatoriyalarni band qiling', color: '#F39C12' },
  { icon: MessageCircle, label: 'Qo\'llab-quvvatlash xizmati', desc: 'Operator bilan bog\'lanish', color: '#0D4830' },
];

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParams>>();
  const [session, setSession] = useState<UserSession | null>(null);
  const [address, setAddress] = useState<string>('');
  const watchId = useRef<number | null>(null);

  useEffect(() => {
    getSession().then(setSession);
    requestAllPermissions();

    getCurrentPosition().then(async (coords) => {
      if (coords) {
        const addr = await getAddressFromCoords(coords.latitude, coords.longitude);
        setAddress(addr);
      }
    });

    watchId.current = watchPosition(async (coords) => {
      const addr = await getAddressFromCoords(coords.latitude, coords.longitude);
      setAddress(addr);
    });

    return () => {
      clearWatch(watchId.current);
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F6F4' }}>
      <StatusBar barStyle="light-content" backgroundColor="#075E45" />

      <LinearGradient
        colors={['#075E45', '#056B4F', '#0A7A5A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.2, y: 1.2 }}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.avatar}>
              <User size={26} color="rgba(255,255,255,0.95)" strokeWidth={2.2} />
            </TouchableOpacity>
            <View style={styles.headerTextWrap}>
              <Text style={styles.greeting}>Assalomu alaykum,</Text>
              <Text style={styles.userName} numberOfLines={1}>
                {session ? `${session.first_name} ${session.last_name}` : 'Ozodbek Usmonqulov'}
              </Text>
            </View>
            <TouchableOpacity style={styles.bellBtn}>
              <Bell size={20} color="#FFFFFF" strokeWidth={2} />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.catRow}>
          {categories.map((item, i) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity key={i} style={styles.catItem} activeOpacity={0.8}>
                <View style={[styles.catCircle, { backgroundColor: item.color }]}>
                  <Icon size={26} color="#FFFFFF" strokeWidth={2} />
                </View>
                <Text style={styles.catLabel}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Xizmatlar</Text>
        </View>

        <View style={styles.serviceGrid}>
          {services.map((item, i) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity key={i} style={styles.serviceCard} activeOpacity={0.7}>
                <View style={[styles.serviceIconCircle, { backgroundColor: item.color + '15' }]}>
                  <Icon size={26} color={item.color} strokeWidth={1.8} />
                </View>
                <Text style={styles.serviceTitle}>{item.label}</Text>
                <Text style={styles.serviceDesc} numberOfLines={2}>{item.desc}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ height: Platform.OS === 'ios' ? 40 : 24 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingBottom: 56,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerContent: { paddingHorizontal: 16 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTextWrap: { flex: 1 },
  greeting: { fontSize: 13, color: 'rgba(255,255,255,0.7)', fontWeight: '500', marginBottom: 2 },
  userName: { fontSize: 18, fontWeight: '800', color: '#FFFFFF', letterSpacing: -0.3 },
  bellBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  body: { paddingTop: 20 },

  catRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  catItem: {
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  catCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  catLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0A1F2E', letterSpacing: -0.3 },


  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
  },
  serviceCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  serviceIconCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  serviceTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0A1F2E',
    marginBottom: 4,
    textAlign: 'center',
  },
  serviceDesc: {
    fontSize: 10.5,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 14,
  },
});
