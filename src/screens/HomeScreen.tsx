import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Bell, Bot, ChevronRight, Sparkle, TreeDeciduous, User } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { getSession, type UserSession } from '../../lib/auth';
import type { MainTabParams } from '../navigation';

const CARD_RADIUS = 32;

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParams>>();
  const [session, setSession] = useState<UserSession | null>(null);

  const chatCardAnim = useRef(new Animated.Value(0)).current;
  const serviceCardAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getSession().then(setSession);
  }, []);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(400),
      Animated.timing(chatCardAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    Animated.sequence([
      Animated.delay(650),
      Animated.timing(serviceCardAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#F7FBFA' }}>
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
              <View style={styles.bellDot} />
            </TouchableOpacity>
          </View>
        </View>

      </LinearGradient>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={[
            styles.chatCard,
            {
              opacity: chatCardAnim,
              transform: [{ translateY: chatCardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }) }],
            },
          ]}
        >
          <View style={styles.chatCardInner}>
            <View style={styles.chatCardLeft}>
              <Text style={styles.chatTitle}>
                Chat bot bilan{'\n'}suhbatlashing
              </Text>
              <Text style={styles.chatDesc}>
                Kasalliklarni erta aniqlash uchun{'\n'}AI yordamchimiz 24/7 siz bilan!
              </Text>
              <TouchableOpacity
                style={styles.chatBtn}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('Chat')}
              >
                <LinearGradient
                  colors={['#075E45', '#0A7A5A']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.chatBtnGrad}
                >
                  <Text style={styles.chatBtnText}>Boshla</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>

            <View style={styles.robotWrap}>
              <View style={styles.robotGlow} />
              <View style={styles.robotBody}>
                <View style={styles.robotHead}>
                  <Sparkle size={14} color="#075E45" strokeWidth={2.5} />
                  <View style={styles.robotEyes}>
                    <View style={styles.robotEye} />
                    <View style={styles.robotEye} />
                  </View>
                  <View style={styles.robotMouth} />
                </View>
                <View style={styles.robotLower}>
                  <Bot size={28} color="#075E45" strokeWidth={1.5} />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Asosiy xizmatlar</Text>
          <TouchableOpacity style={styles.sectionAction}>
            <Text style={styles.sectionActionText}>Barchasini ko'rish</Text>
            <ChevronRight size={14} color="#075E45" strokeWidth={2.5} />
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.serviceCard,
            {
              opacity: serviceCardAnim,
              transform: [{ translateY: serviceCardAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [40, 0],
              }) }],
            },
          ]}
        >
          <LinearGradient
            colors={['#1B8A5E', '#2EA876', '#48C490']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.5, y: 1.2 }}
            style={styles.serviceBg}
          >
            <View style={styles.serviceOverlay}>
              <View style={styles.serviceIconCircle}>
                <TreeDeciduous size={32} color="#FFFFFF" strokeWidth={1.8} />
              </View>
              <View style={styles.serviceDeco1} />
              <View style={styles.serviceDeco2} />
              <View style={styles.serviceDeco3} />
            </View>
          </LinearGradient>
          <View style={styles.serviceBody}>
            <View style={styles.serviceBodyLeft}>
              <Text style={styles.serviceTitle}>Dam olish joylarini izlash</Text>
              <Text style={styles.serviceDesc}>
                Shifobaxsh sanatoriya va kurortlarni toping
              </Text>
            </View>
            <TouchableOpacity style={styles.serviceArrow}>
              <ChevronRight size={20} color="#075E45" strokeWidth={2.5} />
            </TouchableOpacity>
          </View>
        </Animated.View>

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
  headerContent: { paddingHorizontal: 28 },
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
  bellDot: {
    position: 'absolute', top: 9, right: 9,
    width: 9, height: 9, borderRadius: 4.5,
    backgroundColor: '#F5C842', borderWidth: 2, borderColor: '#012E25',
  },
  body: { padding: 16, paddingTop: 12 },
  chatCard: {
    backgroundColor: '#FFFFFF', borderRadius: 30, marginBottom: 28,
    shadowColor: '#023E2D', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12, shadowRadius: 20, elevation: 8,
  },
  chatCardInner: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  chatCardLeft: { flex: 1, paddingRight: 12 },
  chatTitle: { fontSize: 18, fontWeight: '800', color: '#0A1F2E', lineHeight: 25, marginBottom: 8 },
  chatDesc: { fontSize: 12.5, color: '#6B7280', lineHeight: 18, marginBottom: 16 },
  chatBtn: {
    alignSelf: 'flex-start', borderRadius: 24,
    shadowColor: '#5BB58C', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  chatBtnGrad: { paddingHorizontal: 28, paddingVertical: 12, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  chatBtnText: { fontSize: 14, fontWeight: '700', color: '#FFFFFF', letterSpacing: 0.3 },
  robotWrap: { width: 110, height: 130, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  robotGlow: {
    position: 'absolute', width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(7,94,69,0.06)', top: 15,
  },
  robotBody: { alignItems: 'center' },
  robotHead: {
    width: 52, height: 42, backgroundColor: '#E8F5EE', borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 6,
    borderWidth: 1.5, borderColor: '#C8E6D0',
    shadowColor: '#075E45', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 2,
  },
  robotEyes: { flexDirection: 'row', gap: 8 },
  robotEye: { width: 7, height: 7, borderRadius: 3.5, backgroundColor: '#075E45' },
  robotMouth: { width: 12, height: 2.5, backgroundColor: '#075E45', borderRadius: 2 },
  robotLower: {
    width: 58, height: 36, backgroundColor: '#E8F5EE', borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#C8E6D0',
  },
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#0A1F2E', letterSpacing: -0.3 },
  sectionAction: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  sectionActionText: { fontSize: 13, fontWeight: '600', color: '#075E45' },
  serviceCard: {
    backgroundColor: '#FFFFFF', borderRadius: 22, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07, shadowRadius: 12, elevation: 4,
  },
  serviceBg: { height: 130 },
  serviceOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  serviceIconCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', zIndex: 2,
  },
  serviceDeco1: {
    position: 'absolute', width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.08)', top: -10, right: -8,
  },
  serviceDeco2: {
    position: 'absolute', width: 50, height: 50, borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.07)', bottom: 6, left: -6,
  },
  serviceDeco3: {
    position: 'absolute', width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.06)', bottom: -4, right: 30,
  },
  serviceBody: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 16 },
  serviceBodyLeft: { flex: 1 },
  serviceTitle: { fontSize: 14, fontWeight: '700', color: '#0A1F2E', marginBottom: 3 },
  serviceDesc: { fontSize: 11.5, color: '#6B7280', lineHeight: 16 },
  serviceArrow: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: 'rgba(7,94,69,0.08)',
    alignItems: 'center', justifyContent: 'center', marginLeft: 8,
  },
});
