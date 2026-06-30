import React, { useEffect, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, ScrollView,
  Dimensions, Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  Bell, Bot, ChevronRight, TreeDeciduous, Pill,
  Clock, Navigation, MapPin, User,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { getSession, type UserSession } from '../../lib/auth';
import type { MainTabParams } from '../navigation';

const { width } = Dimensions.get('window');
const GREEN = '#1B6B3E';
const CARD_W = (width - 48 - 12) / 2;

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParams>>();
  const [session, setSession] = useState<UserSession | null>(null);

  useEffect(() => {
    getSession().then(setSession);
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F0F5F2' }}>
      <LinearGradient
        colors={['#0D4830', GREEN]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.userRow}>
          <View style={styles.avatar}>
            <User size={26} color="rgba(255,255,255,0.92)" strokeWidth={2} />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.greeting}>Assalomu alaykum,</Text>
            <Text style={styles.userName}>
              {session ? `${session.first_name} ${session.last_name}` : '—'}
            </Text>
          </View>
          <TouchableOpacity style={styles.bellBtn}>
            <Bell size={20} color="#FFFFFF" strokeWidth={2} />
            <View style={styles.bellDot} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        <View style={styles.chatBanner}>
          <View style={styles.chatBannerLeft}>
            <Text style={styles.chatBannerTitle}>Chat bot bilan suhbatlashing</Text>
            <Text style={styles.chatBannerSub}>
              Sog'lig'ingiz haqida savollaringiz bormi? AI yordamchimiz 24/7 siz bilan!
            </Text>
            <TouchableOpacity style={styles.chatStartBtn} activeOpacity={0.85} onPress={() => navigation.navigate('Chat')}>
              <Text style={styles.chatStartBtnText}>Boshlash</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.robotWrap}>
            <View style={styles.robotHead}>
              <View style={styles.robotEyes}>
                <View style={styles.robotEye} />
                <View style={styles.robotEye} />
              </View>
              <View style={styles.robotMouth} />
            </View>
            <View style={styles.robotBody}>
              <Bot size={32} color={GREEN} strokeWidth={1.5} />
            </View>
            <View style={[styles.decCircle, { width: 60, height: 60, top: -10, right: -12, opacity: 0.12 }]} />
            <View style={[styles.decCircle, { width: 36, height: 36, bottom: 8, left: -8, opacity: 0.1 }]} />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Asosiy xizmatlar</Text>
        <View style={styles.servicesRow}>
          <TouchableOpacity style={[styles.serviceCard, { width: CARD_W }]} activeOpacity={0.88}>
            <LinearGradient colors={['#2E7D52', '#4CAF7C']} style={styles.serviceCardBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <TreeDeciduous size={38} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
              <View style={[styles.diagonalCut, { width: CARD_W + 40 }]} />
            </LinearGradient>
            <View style={styles.serviceCardBody}>
              <Text style={styles.serviceCardTitle}>Dam olish joylarini izlash</Text>
              <Text style={styles.serviceCardDesc}>Shifobaxsh sanatoriya va kurortlarni toping</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.serviceCard, { width: CARD_W }]} activeOpacity={0.88}>
            <LinearGradient colors={['#1976A8', '#42A9D4']} style={styles.serviceCardBg} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <Pill size={38} color="rgba(255,255,255,0.85)" strokeWidth={1.5} />
              <View style={[styles.diagonalCut, { width: CARD_W + 40 }]} />
            </LinearGradient>
            <View style={styles.serviceCardBody}>
              <Text style={styles.serviceCardTitle}>Dori vositalari haqida ma'lumot olish</Text>
              <Text style={styles.serviceCardDesc}>Dorining tarkibi va qo'llanilishini bilib oling</Text>
            </View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Mening oxirgi izlanmalarim</Text>
        <View style={styles.recentList}>
          <TouchableOpacity style={styles.recentRow} activeOpacity={0.88}>
            <View style={[styles.recentThumb, { backgroundColor: '#D4EDDA' }]}>
              <TreeDeciduous size={22} color="#2E7D52" strokeWidth={1.8} />
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentTitle}>Chimyon sanatoriyasi</Text>
              <View style={styles.recentMetaRow}>
                <Navigation size={11} color="#9CA3AF" strokeWidth={2} />
                <Text style={styles.recentMeta}>Toshkent vil., Chimyon</Text>
              </View>
              <View style={styles.recentMetaRow}>
                <MapPin size={11} color="#9CA3AF" strokeWidth={2} />
                <Text style={styles.recentMeta}>45 km</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#9CA3AF" strokeWidth={2} />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.recentRow} activeOpacity={0.88}>
            <View style={[styles.recentThumb, { backgroundColor: '#FEF3C7' }]}>
              <Pill size={22} color="#D97706" strokeWidth={1.8} />
            </View>
            <View style={styles.recentInfo}>
              <Text style={styles.recentTitle}>Paratsetamol</Text>
              <View style={styles.recentMetaRow}>
                <Clock size={11} color="#9CA3AF" strokeWidth={2} />
                <Text style={styles.recentMeta}>Skanerlangan vaqt: 22.05.2024 14:30</Text>
              </View>
            </View>
            <ChevronRight size={18} color="#9CA3AF" strokeWidth={2} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 16 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerGradient: { paddingBottom: 20, paddingTop: Platform.OS === 'ios' ? 54 : 38 },
  userRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 4, gap: 12 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  userInfo: { flex: 1 },
  greeting: { fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 1 },
  userName: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  bellBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute', top: 8, right: 8,
    width: 8, height: 8, borderRadius: 4,
    backgroundColor: '#F5C842', borderWidth: 1.5, borderColor: GREEN,
  },
  body: { padding: 16, paddingTop: 20 },
  chatBanner: {
    backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center', marginBottom: 24,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07, shadowRadius: 8, elevation: 3, overflow: 'hidden',
  },
  chatBannerLeft: { flex: 1, paddingRight: 12 },
  chatBannerTitle: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 6, lineHeight: 21 },
  chatBannerSub: { fontSize: 12, color: '#6B7280', lineHeight: 17, marginBottom: 14 },
  chatStartBtn: { alignSelf: 'flex-start', backgroundColor: GREEN, paddingHorizontal: 20, paddingVertical: 9, borderRadius: 20 },
  chatStartBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  robotWrap: { width: 90, height: 90, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  robotHead: {
    width: 44, height: 36, backgroundColor: '#E8F5EE', borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4,
    borderWidth: 1.5, borderColor: '#C8E6D0',
  },
  robotEyes: { flexDirection: 'row', gap: 8 },
  robotEye: { width: 8, height: 8, borderRadius: 4, backgroundColor: GREEN },
  robotMouth: { width: 14, height: 3, backgroundColor: GREEN, borderRadius: 2 },
  robotBody: {
    width: 50, height: 40, backgroundColor: '#E8F5EE', borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#C8E6D0',
  },
  decCircle: { position: 'absolute', backgroundColor: GREEN, borderRadius: 999 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 12 },
  servicesRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  serviceCard: {
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  serviceCardBg: { height: 96, alignItems: 'center', justifyContent: 'center' },
  diagonalCut: {
    position: 'absolute', bottom: -10, left: -20, height: 26,
    backgroundColor: '#FFFFFF', transform: [{ rotate: '-8deg' }],
  },
  serviceCardBody: { padding: 12 },
  serviceCardTitle: { fontSize: 12.5, fontWeight: '700', color: '#111827', lineHeight: 18, marginBottom: 4 },
  serviceCardDesc: { fontSize: 11, color: '#6B7280', lineHeight: 15 },
  recentList: {
    backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  recentRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  recentThumb: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  recentInfo: { flex: 1 },
  recentTitle: { fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 4 },
  recentMetaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  recentMeta: { fontSize: 11.5, color: '#9CA3AF' },
  divider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 14 },
});
