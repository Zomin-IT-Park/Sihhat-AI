import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, TextInput,
  ScrollView, Animated, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  User, Bell, Shield, LogOut, Globe, ChevronDown, Check, Eye, EyeOff,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import EncryptedStorage from 'react-native-encrypted-storage';
import { getSession, logout, updateProfile, type UserSession } from '../../lib/auth';
import { IconlyEditSquare } from '../components/icons/IconlyIcons';
import type { RootStackParams } from '../navigation';

const GREEN = '#075E45';
const LANGUAGE_KEY = 'sihhat_language';

const LANGUAGES: { code: 'uz' | 'ru' | 'en'; label: string }[] = [
  { code: 'uz', label: "O'zbek tili" },
  { code: 'ru', label: 'Rus tili' },
  { code: 'en', label: 'Ingliz tili' },
];

type FieldKey = 'firstName' | 'lastName' | 'username' | 'password';

export default function ProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [user, setUser] = useState<UserSession | null>(null);

  const [editMode, setEditMode] = useState(false);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [editable, setEditable] = useState<Record<FieldKey, boolean>>({
    firstName: false, lastName: false, username: false, password: false,
  });
  const [saving, setSaving] = useState(false);

  const [langOpen, setLangOpen] = useState(false);
  const [language, setLanguage] = useState<'uz' | 'ru' | 'en'>('uz');
  const langAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    getSession().then(setUser);
    EncryptedStorage.getItem(LANGUAGE_KEY).then((val) => {
      if (val === 'uz' || val === 'ru' || val === 'en') setLanguage(val);
    });
  }, []);

  useEffect(() => {
    Animated.spring(langAnim, {
      toValue: langOpen ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [langOpen, langAnim]);

  function loadFormFromSession(session: UserSession | null) {
    setFirstName(session?.first_name ?? '');
    setLastName(session?.last_name ?? '');
    setUsername(session?.username ?? '');
    setPassword('');
  }

  function openEditProfile() {
    loadFormFromSession(user);
    setEditable({ firstName: false, lastName: false, username: false, password: false });
    setEditMode(true);
  }

  function toggleField(field: FieldKey) {
    setEditable((prev) => ({ ...prev, [field]: !prev[field] }));
  }

  function handleCancel() {
    loadFormFromSession(user);
    setEditable({ firstName: false, lastName: false, username: false, password: false });
    setEditMode(false);
  }

  async function handleSave() {
    if (!user) return;
    if (!firstName.trim() || !lastName.trim() || !username.trim()) {
      Alert.alert("Xatolik", "Ism, familiya va foydalanuvchi nomi bo'sh bo'lmasligi kerak.");
      return;
    }
    setSaving(true);
    const res = await updateProfile({
      id: user.id,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      username: username.trim(),
      password: password.trim() ? password.trim() : undefined,
    });
    setSaving(false);

    if (res.error) {
      Alert.alert("Saqlashda xatolik", res.error);
      return;
    }
    if (res.user) setUser(res.user);
    setPassword('');
    setEditable({ firstName: false, lastName: false, username: false, password: false });
    setEditMode(false);
    Alert.alert("Saqlandi", "Profil ma'lumotlari yangilandi.");
  }

  async function handleLogout() {
    await logout();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  }

  async function selectLanguage(code: 'uz' | 'ru' | 'en') {
    setLanguage(code);
    setLangOpen(false);
    await EncryptedStorage.setItem(LANGUAGE_KEY, code);
  }

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profil</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <User size={48} color="#8E8E93" />
          </View>
          <Text style={styles.name}>
            {user ? `${user.first_name} ${user.last_name}` : '—'}
          </Text>
          <Text style={styles.username}>@{user?.username ?? '—'}</Text>
        </View>

        {!editMode ? (
          <>
            <View style={styles.menuSection}>
              <TouchableOpacity style={styles.menuItem} onPress={openEditProfile} activeOpacity={0.7}>
                <View style={styles.menuIcon}>
                  <IconlyEditSquare size={18} color={GREEN} />
                </View>
                <Text style={styles.menuTitle}>Profilni tahrirlash</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuIcon}>
                  <Bell size={20} color={GREEN} />
                </View>
                <Text style={styles.menuTitle}>Bildirishnomalar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
                <View style={styles.menuIcon}>
                  <Shield size={20} color={GREEN} />
                </View>
                <Text style={styles.menuTitle}>Maxfiylik</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, { borderBottomWidth: langOpen ? 0 : undefined }]}
                onPress={() => setLangOpen((v) => !v)}
                activeOpacity={0.7}
              >
                <View style={styles.menuIcon}>
                  <Globe size={20} color={GREEN} />
                </View>
                <Text style={styles.menuTitle}>Tilni almashtirish</Text>
                <View style={{ flex: 1 }} />
                <Text style={styles.langCurrent}>
                  {LANGUAGES.find((l) => l.code === language)?.label}
                </Text>
                <Animated.View style={{
                  transform: [{ rotate: langOpen ? '180deg' : '0deg' }],
                }}>
                  <ChevronDown size={18} color="#8E8E93" />
                </Animated.View>
              </TouchableOpacity>

              {langOpen && (
                <Animated.View style={[
                  styles.langOptions,
                  {
                    opacity: langAnim,
                    transform: [{ scaleY: langAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
                  },
                ]}>
                  {LANGUAGES.map((l) => (
                    <TouchableOpacity
                      key={l.code}
                      style={styles.langOptionRow}
                      onPress={() => selectLanguage(l.code)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.langOptionText,
                        language === l.code && { color: GREEN, fontWeight: '700' },
                      ]}>
                        {l.label}
                      </Text>
                      {language === l.code && <Check size={18} color={GREEN} />}
                    </TouchableOpacity>
                  ))}
                </Animated.View>
              )}
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.8}>
              <LogOut size={20} color="#FF3B30" />
              <Text style={styles.logoutText}>Chiqish</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.editCard}>
            <Text style={styles.editCardTitle}>Profilni tahrirlash</Text>

            <FieldRow
              label="Ism"
              value={firstName}
              onChangeText={setFirstName}
              editable={editable.firstName}
              onTogglePencil={() => toggleField('firstName')}
            />
            <FieldRow
              label="Familiya"
              value={lastName}
              onChangeText={setLastName}
              editable={editable.lastName}
              onTogglePencil={() => toggleField('lastName')}
            />
            <FieldRow
              label="Foydalanuvchi nomi"
              value={username}
              onChangeText={setUsername}
              editable={editable.username}
              onTogglePencil={() => toggleField('username')}
              autoCapitalize="none"
            />
            <FieldRow
              label="Parol"
              value={password}
              onChangeText={setPassword}
              editable={editable.password}
              onTogglePencil={() => toggleField('password')}
              secureTextEntry={!showPassword}
              placeholder="O'zgartirmaslik uchun bo'sh qoldiring"
              rightIcon={
                editable.password ? (
                  <TouchableOpacity onPress={() => setShowPassword((v) => !v)} hitSlop={8}>
                    {showPassword ? (
                      <EyeOff size={18} color="#8E8E93" />
                    ) : (
                      <Eye size={18} color="#8E8E93" />
                    )}
                  </TouchableOpacity>
                ) : undefined
              }
            />

            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} activeOpacity={0.8} disabled={saving}>
                <Text style={styles.cancelBtnText}>Bekor qilish</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8} disabled={saving}>
                {saving ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.saveBtnText}>Saqlash</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function FieldRow({
  label, value, onChangeText, editable, onTogglePencil, secureTextEntry, placeholder, rightIcon, autoCapitalize,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  editable: boolean;
  onTogglePencil: () => void;
  secureTextEntry?: boolean;
  placeholder?: string;
  rightIcon?: React.ReactNode;
  autoCapitalize?: 'none' | 'sentences';
}) {
  return (
    <View style={styles.fieldRow}>
      <TouchableOpacity
        style={[styles.pencilBtn, editable && styles.pencilBtnActive]}
        onPress={onTogglePencil}
        activeOpacity={0.7}
      >
        <IconlyEditSquare size={16} color={editable ? '#FFFFFF' : GREEN} />
      </TouchableOpacity>
      <View style={styles.fieldInputWrap}>
        <Text style={styles.fieldLabel}>{label}</Text>
        <View style={styles.fieldInputRow}>
          <TextInput
            style={[styles.fieldInput, !editable && styles.fieldInputDisabled]}
            value={value}
            onChangeText={onChangeText}
            editable={editable}
            secureTextEntry={secureTextEntry}
            placeholder={placeholder}
            placeholderTextColor="#B0B4B8"
            autoCapitalize={autoCapitalize ?? 'sentences'}
          />
          {rightIcon}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: {
    backgroundColor: '#FFFFFF', padding: 16,
    borderBottomWidth: 1, borderBottomColor: '#E5E5EA',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#1C1C1E', textAlign: 'center' },
  content: { flex: 1, padding: 16 },
  avatarSection: { alignItems: 'center', paddingVertical: 32 },
  avatar: {
    width: 96, height: 96, borderRadius: 48, backgroundColor: '#E5E5EA',
    alignItems: 'center', justifyContent: 'center', marginBottom: 16,
  },
  name: { fontSize: 22, fontWeight: '700', color: '#1C1C1E', marginBottom: 4 },
  username: { fontSize: 15, color: '#8E8E93' },
  menuSection: { backgroundColor: '#FFFFFF', borderRadius: 16, overflow: 'hidden' },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', padding: 16,
    borderBottomWidth: 1, borderBottomColor: '#E5E5EA',
  },
  menuIcon: {
    width: 32, height: 32, borderRadius: 8, backgroundColor: '#F2F2F7',
    alignItems: 'center', justifyContent: 'center', marginRight: 12,
  },
  menuTitle: { fontSize: 16, color: '#1C1C1E' },
  langCurrent: { fontSize: 13.5, color: '#8E8E93', marginRight: 6 },
  langOptions: {
    paddingVertical: 4, paddingHorizontal: 4, backgroundColor: '#F8F9FA',
    borderBottomWidth: 1, borderBottomColor: '#E5E5EA',
  },
  langOptionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 12, paddingHorizontal: 16,
  },
  langOptionText: { fontSize: 15, color: '#1C1C1E' },
  logoutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 14, padding: 16, marginTop: 24, gap: 8,
  },
  logoutText: { fontSize: 16, fontWeight: '600', color: '#FF3B30' },

  editCard: {
    backgroundColor: '#FFFFFF', borderRadius: 18, padding: 18,
  },
  editCardTitle: { fontSize: 17, fontWeight: '700', color: '#1C1C1E', marginBottom: 16 },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 10 },
  pencilBtn: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: '#F2F2F7', alignItems: 'center', justifyContent: 'center',
  },
  pencilBtnActive: { backgroundColor: GREEN },
  fieldInputWrap: { flex: 1 },
  fieldLabel: { fontSize: 12.5, color: '#8E8E93', marginBottom: 4, fontWeight: '600' },
  fieldInputRow: {
    flexDirection: 'row', alignItems: 'center',
    borderBottomWidth: 1.5, borderBottomColor: '#E5E5EA', paddingBottom: 6,
  },
  fieldInput: { flex: 1, fontSize: 15.5, color: '#1C1C1E', padding: 0 },
  fieldInputDisabled: { color: '#8E8E93' },
  editActions: { flexDirection: 'row', gap: 10, marginTop: 8 },
  cancelBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 13, borderRadius: 12,
    backgroundColor: '#F2F2F7',
  },
  cancelBtnText: { fontSize: 15, fontWeight: '700', color: '#1C1C1E' },
  saveBtn: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingVertical: 13, borderRadius: 12,
    backgroundColor: GREEN,
  },
  saveBtnText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
});
