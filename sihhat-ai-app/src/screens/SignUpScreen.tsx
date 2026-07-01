import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ChevronLeft, User, Users, Lock, Eye, EyeOff, AtSign } from 'lucide-react-native';
import { register } from '../../lib/auth';
import Toast from '../components/Toast';
import type { RootStackParams } from '../navigation';

const GREEN = '#1B6B3E';

function validateUsername(u: string): string | null {
  if (/\s/.test(u)) return "Username da bo'sh joy bo'lmasligi kerak";
  if (u.length < 3) return 'Username kamida 3 ta belgi bo\'lishi kerak';
  if (u.length > 20) return "Username ko'pi bilan 20 ta belgi";
  if (!/^[a-zA-Z0-9_]+$/.test(u)) return 'Faqat harflar, raqamlar va _ ishlatish mumkin';
  return null;
}

export default function SignUpScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const [firstName, setFirstName]             = useState('');
  const [lastName, setLastName]               = useState('');
  const [username, setUsername]               = useState('');
  const [password, setPassword]               = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPass, setShowPass]               = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [confirmTouched, setConfirmTouched]   = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [loading, setLoading]                 = useState(false);
  const [toast, setToast]                     = useState({ visible: false, message: '', type: 'error' as 'error' | 'success' });

  const usernameError = usernameTouched ? validateUsername(username) : null;
  const passwordsMatch = password === confirmPassword;
  const showPasswordError = confirmTouched && confirmPassword.length > 0 && !passwordsMatch;
  const showPasswordOk    = confirmTouched && confirmPassword.length > 0 && passwordsMatch;

  const canSubmit =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    validateUsername(username) === null &&
    password.length >= 6 &&
    passwordsMatch &&
    !loading;

  function showToast(message: string, type: 'error' | 'success' = 'error') {
    setToast({ visible: true, message, type });
  }

  async function handleSignUp() {
    if (!canSubmit) return;
    setLoading(true);
    try {
      const { error } = await register({
        username: username.toLowerCase(),
        password,
        first_name: firstName.trim(),
        last_name: lastName.trim(),
      });
      if (error) {
        showToast(error);
      } else {
        navigation.navigate('Success');
      }
    } catch {
      showToast('Internetga ulanishni tekshiring.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#FFFFFF' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={() => setToast(t => ({ ...t, visible: false }))}
      />

      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ChevronLeft size={22} color="#1C1C1E" strokeWidth={2.5} />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Ro'yxatdan o'tish</Text>
            <Text style={styles.headerSub}>Hisob yaratish uchun ma'lumotlaringizni kiriting</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.form}>
          <Field icon={<User size={18} color="#9CA3AF" />} placeholder="Ismingiz" value={firstName} onChangeText={setFirstName} />
          <Field icon={<Users size={18} color="#9CA3AF" />} placeholder="Familiyangiz" value={lastName} onChangeText={setLastName} />

          <View>
            <Field
              icon={<AtSign size={18} color={usernameError ? '#EF4444' : '#9CA3AF'} />}
              placeholder="Username (bo'sh joy bo'lmasin)"
              value={username}
              onChangeText={(v) => {
                const clean = v.replace(/\s/g, '');
                setUsername(clean);
                if (!usernameTouched && clean.length > 0) setUsernameTouched(true);
              }}
              autoCapitalize="none"
              borderColor={usernameError ? '#EF4444' : undefined}
            />
            {usernameError && <Text style={styles.errorText}>⚠ {usernameError}</Text>}
            {usernameTouched && !usernameError && username.length > 0 && (
              <Text style={styles.successText}>✓ Username to'g'ri</Text>
            )}
          </View>

          <Field
            icon={<Lock size={18} color="#9CA3AF" />}
            placeholder="Parol (kamida 6 ta belgi)"
            value={password}
            onChangeText={setPassword}
            secure={!showPass}
            autoCapitalize="none"
            rightSlot={
              <TouchableOpacity onPress={() => setShowPass(v => !v)} hitSlop={8}>
                {showPass ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
              </TouchableOpacity>
            }
          />

          <View>
            <Field
              icon={<Lock size={18} color={showPasswordError ? '#EF4444' : '#9CA3AF'} />}
              placeholder="Parolni qayta kiriting"
              value={confirmPassword}
              onChangeText={(v) => {
                setConfirmPassword(v);
                if (!confirmTouched) setConfirmTouched(true);
              }}
              secure={!showConfirm}
              autoCapitalize="none"
              borderColor={showPasswordError ? '#EF4444' : showPasswordOk ? '#16A34A' : undefined}
              rightSlot={
                <TouchableOpacity onPress={() => setShowConfirm(v => !v)} hitSlop={8}>
                  {showConfirm ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
                </TouchableOpacity>
              }
            />
            {showPasswordError && <Text style={styles.errorText}>⚠ Parollar bir-biriga mos emas</Text>}
            {showPasswordOk && <Text style={styles.successText}>✓ Parollar mos keldi</Text>}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.submitBtn, !canSubmit && styles.submitBtnDisabled]}
          activeOpacity={canSubmit ? 0.85 : 1}
          onPress={handleSignUp}
          disabled={!canSubmit}
        >
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitBtnText}>Ro'yxatdan o'tish</Text>}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hisobingiz bormi? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.footerText, styles.footerLink]}>Kirish</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Field({
  icon, placeholder, value, onChangeText, secure, rightSlot, autoCapitalize, borderColor,
}: {
  icon: React.ReactNode; placeholder: string; value: string;
  onChangeText: (v: string) => void; secure?: boolean; rightSlot?: React.ReactNode;
  autoCapitalize?: 'none' | 'sentences' | 'words'; borderColor?: string;
}) {
  return (
    <View style={[styles.fieldWrap, borderColor ? { borderColor } : undefined]}>
      <View style={styles.fieldIcon}>{icon}</View>
      <TextInput
        style={styles.fieldInput}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        secureTextEntry={secure}
        autoCapitalize={autoCapitalize ?? 'words'}
        value={value}
        onChangeText={onChangeText}
      />
      {rightSlot && <View style={styles.fieldRight}>{rightSlot}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1, backgroundColor: '#FFFFFF', paddingBottom: 32,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingBottom: 28,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  headerCenter: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1C1C1E', marginBottom: 6 },
  headerSub: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 19 },
  form: { paddingHorizontal: 24, gap: 14, marginBottom: 28 },
  fieldWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 14, height: 54, paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
  },
  fieldIcon: { marginRight: 10 },
  fieldInput: { flex: 1, fontSize: 15, color: '#1C1C1E' },
  fieldRight: { marginLeft: 8 },
  errorText: { fontSize: 12.5, color: '#EF4444', marginTop: 6, marginLeft: 4, fontWeight: '500' },
  successText: { fontSize: 12.5, color: '#16A34A', marginTop: 6, marginLeft: 4, fontWeight: '500' },
  submitBtn: {
    marginHorizontal: 24, height: 54, backgroundColor: GREEN, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginBottom: 20,
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  submitBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  submitBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14.5, color: '#6B7280' },
  footerLink: { color: GREEN, fontWeight: '600' },
});
