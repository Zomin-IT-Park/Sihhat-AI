import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft } from 'lucide-react-native';
import type { RootStackParams } from '../navigation';

const GREEN = '#1B6B3E';

export default function BookingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const route = useRoute<RouteProp<RootStackParams, 'Booking'>>();
  const { sanatoriumName, specialty } = route.params || {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [disease, setDisease] = useState('');

  function handleBook() {
    if (!firstName.trim() || !lastName.trim() || !age.trim() || !disease.trim()) return;
    navigation.navigate('Success');
  }

  const canBook = firstName.trim() && lastName.trim() && age.trim() && disease.trim();

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#FFFFFF' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={22} color="#1C1C1E" strokeWidth={2.5} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Bron qilish</Text>
          <View style={{ width: 40 }} />
        </View>

        {sanatoriumName ? (
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Sanatoriya</Text>
            <Text style={styles.infoValue}>{sanatoriumName}</Text>
            {specialty ? <Text style={styles.infoSub}>{specialty}</Text> : null}
          </View>
        ) : null}

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Shaxsiy ma'lumotlar</Text>

          <Text style={styles.label}>Ism</Text>
          <TextInput
            style={styles.input}
            placeholder="Ismingiz"
            placeholderTextColor="#9CA3AF"
            value={firstName}
            onChangeText={setFirstName}
          />

          <Text style={styles.label}>Familiya</Text>
          <TextInput
            style={styles.input}
            placeholder="Familiyangiz"
            placeholderTextColor="#9CA3AF"
            value={lastName}
            onChangeText={setLastName}
          />

          <Text style={styles.label}>Yosh</Text>
          <TextInput
            style={styles.input}
            placeholder="Yoshingiz"
            placeholderTextColor="#9CA3AF"
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
            maxLength={3}
          />

          <Text style={styles.label}>Qaysi kasallik bo'yicha</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Masalan: bel og'rig'i, nafas olish muammolari..."
            placeholderTextColor="#9CA3AF"
            value={disease}
            onChangeText={setDisease}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <TouchableOpacity
          style={[styles.bookBtn, !canBook && styles.bookBtnDisabled]}
          disabled={!canBook}
          onPress={handleBook}
        >
          <Text style={{ fontSize: 18 }}>📅</Text>
          <Text style={styles.bookBtnText}>Bron qilish</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1, paddingBottom: 40, paddingTop: Platform.OS === 'ios' ? 60 : 48 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, marginBottom: 24,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  infoCard: {
    marginHorizontal: 20, padding: 16, backgroundColor: '#E8F5E9',
    borderRadius: 14, marginBottom: 24,
  },
  infoLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500', marginBottom: 4 },
  infoValue: { fontSize: 17, fontWeight: '700', color: '#1B6B3E' },
  infoSub: { fontSize: 13, color: '#374151', marginTop: 2 },
  form: { paddingHorizontal: 20, marginBottom: 28 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111827',
    backgroundColor: '#FAFAFA',
  },
  multiline: { minHeight: 80, paddingTop: 12 },
  bookBtn: {
    marginHorizontal: 20, height: 54, backgroundColor: GREEN, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  bookBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  bookBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
