import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Check } from 'lucide-react-native';

const GREEN = '#1B6B3E';

const DOTS = [
  { top: 10,  left: 80,  size: 10, color: '#A8D5BB' },
  { top: 0,   left: 130, size: 8,  color: '#7EC8A0' },
  { top: 20,  left: 172, size: 12, color: '#B3E0C5' },
  { top: 70,  left: 192, size: 9,  color: '#82CFA6' },
  { top: 120, left: 182, size: 11, color: '#A0D9BE' },
  { top: 158, left: 148, size: 8,  color: '#6EC49A' },
  { top: 168, left: 100, size: 10, color: '#B8E4CA' },
  { top: 150, left: 58,  size: 9,  color: '#8FD0AE' },
  { top: 108, left: 20,  size: 12, color: '#A5D8BC' },
  { top: 58,  left: 10,  size: 8,  color: '#7ACBA2' },
  { top: 35,  left: 28,  size: 7,  color: '#90C5D8' },
  { top: 140, left: 30,  size: 7,  color: '#8BBAD5' },
];

export default function SuccessScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <View style={styles.decorRing}>
          {DOTS.map((dot, i) => (
            <View
              key={i}
              style={{
                position: 'absolute',
                top: dot.top, left: dot.left,
                width: dot.size, height: dot.size,
                borderRadius: dot.size / 2,
                backgroundColor: dot.color,
              }}
            />
          ))}
          <View style={styles.checkCircle}>
            <Check size={56} color="#FFFFFF" strokeWidth={3} />
          </View>
        </View>

        <Text style={styles.title}>Muvaffaqiyatli!</Text>
        <Text style={styles.desc}>
          Hisobingiz muvaffaqiyatli yaratildi.{'\n'}Iltimos, tizimga kiring.
        </Text>
      </View>

      <View style={styles.bottomArea}>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={0.85}
          onPress={() => router.replace('/login')}
        >
          <Text style={styles.btnText}>Kirish sahifasiga o'tish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  center: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32,
  },
  decorRing: {
    width: 200, height: 200,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 36, position: 'relative',
  },
  checkCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: GREEN,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: GREEN, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 10,
  },
  title: { fontSize: 28, fontWeight: '800', color: '#111827', marginBottom: 14, textAlign: 'center' },
  desc: { fontSize: 15, color: '#6B7280', textAlign: 'center', lineHeight: 23 },
  bottomArea: {
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'ios' ? 46 : 36,
    paddingTop: 16,
  },
  btn: {
    height: 54, backgroundColor: GREEN, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  btnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
