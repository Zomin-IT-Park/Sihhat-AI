import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, StatusBar, Image, ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, CheckCircle2 } from 'lucide-react-native';
import { IconlySend, IconlyWallet } from '../components/icons/IconlyIcons';
import type { RootStackParams } from '../navigation';
import { getSession } from '../../lib/auth';
import { createBooking, findSanatoriumIdByName } from '../../lib/bookings';
import { getSanatoriumImage } from '../../lib/images';
import Toast from '../components/Toast';

const GREEN = '#1B6B3E';
const DEFAULT_PRICE = "450 000 so'm";

export default function BookingScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const route = useRoute<RouteProp<RootStackParams, 'Booking'>>();
  const { sanatoriumName, specialty, image, address, price } = route.params || {};

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [complaint, setComplaint] = useState('');
  const [paid, setPaid] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const displayPrice = price || DEFAULT_PRICE;
  const canBook = firstName.trim() && lastName.trim() && age.trim() && complaint.trim();
  const canSubmit = canBook && paid && !submitting;

  function showError(msg: string) {
    setToast({ visible: false, message: '' });
    setTimeout(() => setToast({ visible: true, message: msg }), 30);
  }

  async function handleSubmit() {
    if (!canSubmit || !sanatoriumName) return;
    setSubmitting(true);
    try {
      const session = await getSession();
      if (!session) {
        showError('Sessiya topilmadi. Iltimos, qayta kiring.');
        return;
      }
      // sanatory_id topilmasa ham bron davom etishi kerak — shuning uchun
      // bu qidiruv alohida try/catch bilan himoyalangan.
      let sanatoryId: number | null = null;
      try {
        sanatoryId = await findSanatoriumIdByName(sanatoriumName);
      } catch {
        sanatoryId = null;
      }

      const { error } = await createBooking({
        username: session.username,
        sanatory_id: sanatoryId,
        sanatorium_name: sanatoriumName,
        sanatorium_image: image ?? getSanatoriumImage(sanatoriumName),
        region: address ?? null,
        specialty: specialty ?? null,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        age: age.trim(),
        complaint: complaint.trim(),
        price: displayPrice,
      });
      if (error) {
        showError(`Yuborishda xatolik: ${error}`);
        return;
      }
      navigation.navigate('MainTabs', { screen: 'Orders' });
    } catch (err: any) {
      showError(`Internetga ulanishni tekshiring. (${err?.message ?? 'noma\'lum xato'})`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: '#FFFFFF' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <Toast
        message={toast.message}
        type="error"
        visible={toast.visible}
        onHide={() => setToast(t => ({ ...t, visible: false }))}
      />
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
            <Image
              source={{ uri: image || getSanatoriumImage(sanatoriumName) }}
              style={styles.infoImage}
              resizeMode="cover"
            />
            <View style={styles.infoTextWrap}>
              <Text style={styles.infoLabel}>Sanatoriya</Text>
              <Text style={styles.infoValue}>{sanatoriumName}</Text>
              {address ? <Text style={styles.infoSub}>{address}</Text> : null}
              {specialty ? <Text style={styles.infoSub}>{specialty}</Text> : null}
            </View>
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

          <Text style={styles.label}>Shikoyat / murojaat sababi</Text>
          <TextInput
            style={[styles.input, styles.multiline]}
            placeholder="Masalan: bel og'rig'i, nafas olish muammolari..."
            placeholderTextColor="#9CA3AF"
            value={complaint}
            onChangeText={setComplaint}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.paySection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>To'lov summasi</Text>
            <Text style={styles.priceValue}>{displayPrice}</Text>
          </View>
          <TouchableOpacity
            style={[styles.payBtn, paid && styles.payBtnDone]}
            activeOpacity={paid ? 1 : 0.85}
            disabled={paid}
            onPress={() => setPaid(true)}
          >
            {paid ? (
              <>
                <CheckCircle2 size={18} color="#FFFFFF" strokeWidth={2.4} />
                <Text style={styles.payBtnText}>To'landi</Text>
              </>
            ) : (
              <>
                <IconlyWallet size={18} color="#FFFFFF" />
                <Text style={styles.payBtnText}>To'lov qilish</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          disabled={!canSubmit}
          onPress={handleSubmit}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <IconlySend size={18} color="#FFFFFF" />
              <Text style={styles.submitBtnText}>Jo'natish</Text>
            </>
          )}
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
    marginHorizontal: 20, padding: 12, backgroundColor: '#E8F5E9',
    borderRadius: 14, marginBottom: 24, flexDirection: 'row', gap: 12, alignItems: 'center',
  },
  infoImage: { width: 64, height: 64, borderRadius: 10 },
  infoTextWrap: { flex: 1 },
  infoLabel: { fontSize: 12, color: '#6B7280', fontWeight: '500', marginBottom: 2 },
  infoValue: { fontSize: 16, fontWeight: '700', color: '#1B6B3E' },
  infoSub: { fontSize: 12, color: '#374151', marginTop: 2 },
  form: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#374151', marginBottom: 6, marginTop: 12 },
  input: {
    borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, color: '#111827',
    backgroundColor: '#FAFAFA',
  },
  multiline: { minHeight: 90, paddingTop: 12 },
  paySection: { paddingHorizontal: 20, marginBottom: 20 },
  priceRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginBottom: 12,
  },
  priceLabel: { fontSize: 14, color: '#6B7280', fontWeight: '500' },
  priceValue: { fontSize: 20, fontWeight: '800', color: '#111827' },
  payBtn: {
    height: 52, backgroundColor: '#0F766E', borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  payBtnDone: { backgroundColor: '#16A34A' },
  payBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  submitBtn: {
    marginHorizontal: 20, height: 54, backgroundColor: GREEN, borderRadius: 14,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  submitBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
