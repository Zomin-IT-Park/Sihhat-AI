import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ShieldCheck, User, Lock, Eye, EyeOff } from 'lucide-react-native';
import { login } from '../lib/auth';
import type { RootStackParams } from '../navigation';

const GREEN = '#1B6B3E';
const DARK_GREEN = '#075E45';

export default function LoginScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const canLogin = username.trim().length > 0 && password.length > 0 && !loading;

  async function handleLogin() {
    if (!canLogin) return;
    setLoading(true);
    setError('');
    try {
      const { user, error: err } = await login(username.trim(), password);
      if (err || !user) {
        setError(err ?? "Login yoki parol noto'g'ri.");
      } else {
        navigation.reset({ index: 0, routes: [{ name: 'AdminTabs' }] });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <StatusBar barStyle="light-content" backgroundColor={DARK_GREEN} />

      <View style={styles.header}>
        <View style={styles.logoCircle}>
          <ShieldCheck size={40} color="#FFFFFF" strokeWidth={2} />
        </View>
        <Text style={styles.headerTitle}>Health Admin</Text>
        <Text style={styles.headerSub}>Administrator paneli</Text>
      </View>

      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.fieldWrap}>
          <View style={styles.fieldIcon}><User size={18} color="#9CA3AF" /></View>
          <TextInput
            style={styles.fieldInput}
            placeholder="Login"
            placeholderTextColor="#9CA3AF"
            autoCapitalize="none"
            value={username}
            onChangeText={(v) => { setUsername(v.replace(/\s/g, '')); setError(''); }}
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
            onChangeText={(v) => { setPassword(v); setError(''); }}
            onSubmitEditing={handleLogin}
            returnKeyType="done"
          />
          <TouchableOpacity onPress={() => setShowPass(v => !v)} hitSlop={8}>
            {showPass ? <EyeOff size={18} color="#9CA3AF" /> : <Eye size={18} color="#9CA3AF" />}
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.loginBtn, !canLogin && styles.loginBtnDisabled]}
          activeOpacity={canLogin ? 0.85 : 1}
          onPress={handleLogin}
          disabled={!canLogin}
        >
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginBtnText}>Kirish</Text>}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F6F4' },
  header: {
    backgroundColor: DARK_GREEN,
    alignItems: 'center', justifyContent: 'center',
    paddingTop: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: 48,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoCircle: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)',
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: '#FFFFFF' },
  headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  form: { paddingHorizontal: 24, paddingTop: 32, gap: 14 },
  errorText: { color: '#DC2626', fontSize: 13.5, fontWeight: '600', marginBottom: 4, textAlign: 'center' },
  fieldWrap: {
    flexDirection: 'row', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E5E7EB',
    borderRadius: 14, height: 54, paddingHorizontal: 14,
    backgroundColor: '#FFFFFF',
  },
  fieldIcon: { marginRight: 10 },
  fieldInput: { flex: 1, fontSize: 15, color: '#1C1C1E' },
  loginBtn: {
    height: 54, backgroundColor: GREEN, borderRadius: 14,
    alignItems: 'center', justifyContent: 'center', marginTop: 8,
    shadowColor: GREEN, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5,
  },
  loginBtnDisabled: { backgroundColor: '#9CA3AF', shadowOpacity: 0, elevation: 0 },
  loginBtnText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
});
