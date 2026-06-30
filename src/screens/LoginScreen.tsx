import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { ChevronLeft, AtSign, Lock, Eye, EyeOff } from 'lucide-react-native';
import { login } from '../../lib/auth';
import Toast from '../components/Toast';
import type { RootStackParams } from '../navigation';

const GREEN = '#1B6B3E';

export default function LoginScreen() {
  const navigation = useNavigation<StackNavigationProp<RootStackParams>>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const canLogin = username.trim().length >= 3 && password.length >= 6 && !loading;

  function showErrorToast(msg: string) {
    setToast({ visible: false, message: '' });
    setTimeout(() => setToast({ visible: true, message: msg }), 30);
  }

  async function handleLogin() {
    if (!canLogin) return;
    setLoading(true);
    try {
      const { user, error } = await login(username.trim(), password);
      if (error || !user) {
        showErrorToast(error ?? "Username yoki parol noto'g'ri.");
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'MainTabs' }] });
      }
    } catch {
      showErrorToast('Internetga ulanishni tekshiring.');
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
        type="error"
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
            <Text style={styles.headerTitle}>Kirish</Text>
            <Text style={styles.headerSub}>
              Ro'yxatdan o'tishda yaratgan username va parolingizni kiriting
            </Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <View style={styles.form}>
          <View style={styles.fieldWrap}>
            <View style={styles.fieldIcon}><AtSign size={18} color="#9CA3AF" /></View>
            <TextInput
              style={styles.fieldInput}
              placeholder="Username"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="none"
              value={username}
              onChangeText={(v) => setUsername(v.replace(/\s/g, ''))}
            />
          </View>

          <View style={styles.fieldWrap}>
            <View style={styles.fieldIcon}><Lock size={18} color="#9CA3AF" /></View>
            <TextInput
              style={styles.fieldInput}
              placeholder="Parol"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPass}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleLogin}
              returnKeyType="done"
            />
            <TouchableOpacity onPress={() => setShowPass(v => !v)} hitSlop={8}>
              {showPass ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotWrap}>
          <Text style={styles.forgotText}>Parolni unutdingizmi?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginBtn, !canLogin && styles.loginBtnDisabled]}
          activeOpacity={canLogin ? 0.85 : 1}
          onPress={handleLogin}
          disabled={!canLogin}
        >
          {loading
            ? <ActivityIndicator color="#FFFFFF" />
            : <Text style={styles.loginBtnText}>Kirish</Text>
          }
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Hisobingiz yo'qmi? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={[styles.footerText, styles.footerLink]}>Ro'yxatdan o'tish</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1, backgroundColor: '#FFFFFF', paddingBottom: 40,
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
  },
  headerRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingBottom: 36,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6',
    alignItems: 'center', justifyContent: 'center', marginTop: 2,
  },
  headerCenter: { flex: 1, alignItems: 'center', paddingHorizontal: 10 },
  headerTitle: { fontSize: 22, fontWeight: '700', color: '#1C1C1E', marginBottom: 8 },
  headerSub: { fontSize: 13, color: '#6B7280', textAlign: 'center', lineHeight: 19 },
  form: { paddingHorizontal: 24, gap: 14, marginBottom: 16 },
  fieldWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 14, height: 54, paddingHorizontal: 14,
    backgroundColor: '#FAFAFA',
  },
  fieldIcon: { marginRight: 10 },
  fieldInput: { flex: 1, fontSize: 15, color: '#1C1C1E' },
  forgotWrap: { alignItems: 'center', paddingVertical: 6, marginBottom: 28 },
  forgotText: { fontSize: 14.5, color: GREEN, fontWeight: '600' },
  loginBtn: {
    marginHorizontal: 24, height: 54, backgroundColor: GREEN, borderRadius: 27,
    alignItems: 'center', justifyContent: 'center', marginBottom: 24,
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  loginBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  loginBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  footerText: { fontSize: 14.5, color: '#6B7280' },
  footerLink: { color: GREEN, fontWeight: '600' },
});
