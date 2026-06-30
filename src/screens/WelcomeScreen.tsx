import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { MessageCircle, Pill, Search, MapPin, ChevronRight, HeartPulse } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParams } from '../navigation';

const { height } = Dimensions.get('window');

const FEATURES = [
  { Icon: MessageCircle, text: "AI chat orqali maslahat oling" },
  { Icon: Pill,          text: "Dorilar haqida to'liq ma'lumot oling" },
  { Icon: Search,        text: "Shifobaxsh joylarni qidiring" },
  { Icon: MapPin,        text: "Joylashuvingizga mos tavsiyalar" },
];

export default function WelcomeScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={['#082E1E', '#0D4830', '#145C3C', '#1A6E47']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
      >
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={{ position: 'absolute', top: height * 0.07, right: -24, opacity: 0.06 }}>
            <HeartPulse size={160} color="#FFFFFF" />
          </View>
          <View style={{ position: 'absolute', top: height * 0.38, left: -28, opacity: 0.04 }}>
            <HeartPulse size={110} color="#FFFFFF" />
          </View>
          <View style={{ position: 'absolute', bottom: height * 0.18, right: 16, opacity: 0.05 }}>
            <HeartPulse size={85} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.logoCircle}>
            <HeartPulse size={44} color="#1A6E47" strokeWidth={2.5} />
          </View>

          <Text style={styles.title}>Sihhat AI</Text>
          <Text style={styles.description}>
            Sihhat AI – sun'iy intellekt yordamida sog'lig'ingiz haqida g'amxo'rlik qiladigan aqlli ilova.
          </Text>

          <View style={styles.featureList}>
            {FEATURES.map(({ Icon, text }, i) => (
              <View key={i} style={styles.featureRow}>
                <View style={styles.featureIconBox}>
                  <Icon size={20} color="#FFFFFF" strokeWidth={2} />
                </View>
                <Text style={styles.featureText}>{text}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomArea}>
          <TouchableOpacity
            style={styles.startBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.startBtnText}>Boshlash</Text>
            <View style={styles.arrowCircle}>
              <ChevronRight size={17} color="#1A6E47" strokeWidth={2.8} />
            </View>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1, alignItems: 'center', paddingHorizontal: 28,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
  },
  logoCircle: {
    width: 104, height: 104, borderRadius: 52, backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28, shadowRadius: 14, elevation: 10,
  },
  title: { fontSize: 34, fontWeight: '800', color: '#FFFFFF', marginBottom: 10, letterSpacing: -0.4 },
  description: {
    fontSize: 13.5, color: 'rgba(255,255,255,0.85)', textAlign: 'center',
    lineHeight: 21, marginBottom: 28, paddingHorizontal: 6,
  },
  featureList: { width: '100%', gap: 15 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  featureIconBox: {
    width: 44, height: 44, borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center', justifyContent: 'center',
  },
  featureText: { flex: 1, fontSize: 14.5, fontWeight: '500', color: '#FFFFFF', lineHeight: 20 },
  bottomArea: {
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'ios' ? 46 : 36,
    paddingTop: 16,
  },
  startBtn: {
    height: 56, backgroundColor: '#FFFFFF', borderRadius: 28,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2, shadowRadius: 10, elevation: 6,
  },
  startBtnText: { fontSize: 17, fontWeight: '700', color: '#1A6E47' },
  arrowCircle: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(26,110,71,0.12)',
    alignItems: 'center', justifyContent: 'center',
  },
});
