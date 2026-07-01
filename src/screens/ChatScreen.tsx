import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, StatusBar, Pressable, Image as RNImage, Linking,
} from 'react-native';
import { Send, Sparkle, AlertTriangle, Plus, Image as LucideImage, FileText, X, Navigation, Settings } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParams } from '../navigation';
import { sendChatMessage, type SanatoriumItem } from '../../lib/chat';
import { getSanatoriumImage } from '../../lib/images';
import LinearGradient from 'react-native-linear-gradient';

type Message = {
  id: string;
  text?: string;
  isBot: boolean;
  sanatoriums?: SanatoriumItem[];
  disclaimer?: string;
  loading?: boolean;
};

const PLACEHOLDER_IMAGE = 'https://placehold.co/400x200/1B6B3E/FFFFFF?text=Sihhat-AI';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Assalomu alaykum! Men Sihhat-AI yordamchisiman. O'zbekistondagi sanatoriyalar haqida ma'lumot bera olaman. Qaysi hududdagi sanatoriyalar sizni qiziqtiradi?", isBot: true },
  ]);
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const flatRef = useRef<FlatList>(null);
  const dotAnim = useRef(new Animated.Value(0)).current;
  const settingsAnim = useRef(new Animated.Value(0)).current;
  const inputVal = useRef('');

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(dotAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dotAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    );
    if (loading) animation.start();
    else animation.reset();
    return () => animation.reset();
  }, [loading, dotAnim]);

  useEffect(() => {
    Animated.spring(settingsAnim, {
      toValue: showSettings ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [showSettings, settingsAnim]);

  const [inputText, setInputText] = useState('');
  const [showAttach, setShowAttach] = useState(false);
  const attachAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(attachAnim, {
      toValue: showAttach ? 1 : 0,
      useNativeDriver: true,
      friction: 6,
    }).start();
  }, [showAttach, attachAnim]);

  const dotScale = dotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  function newChat() {
    setMessages([{
      id: Date.now().toString(),
      text: "Assalomu alaykum! Men Sihhat-AI yordamchisiman. O'zbekistondagi sanatoriyalar haqida ma'lumot bera olaman. Qaysi hududdagi sanatoriyalar sizni qiziqtiradi?",
      isBot: true,
    }]);
    setShowSettings(false);
  }

  function clearHistory() {
    setMessages([]);
    setShowSettings(false);
  }

  function handleSend(txt: string) {
    if (!txt) return;
    inputVal.current = '';
    setInputText('');
    setMessages(prev => [...prev,
      { id: Date.now().toString(), text: txt, isBot: false },
      { id: 'loading', isBot: true, loading: true },
    ]);
    sendChatMessage(txt).then(res => {
      setMessages(prev => {
        const filtered = prev.filter(m => m.id !== 'loading');
        const newMsg: Message = { id: (Date.now() + 1).toString(), isBot: true };
        if (res.type === 'sanatorium_list') {
          newMsg.sanatoriums = res.sanatoriums;
          newMsg.disclaimer = res.disclaimer;
        } else if (res.type === 'text') {
          newMsg.text = res.message;
        } else {
          newMsg.text = res.message || 'Javob olindi';
        }
        return [...filtered, newMsg];
      });
    }).catch(() => {
      setMessages(prev => prev.filter(m => m.id !== 'loading'));
    });
  }

function SanatoriumCard({ s }: { s: SanatoriumItem }) {
  const [imgErr, setImgErr] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const imageUri = imgErr ? PLACEHOLDER_IMAGE : getSanatoriumImage(s.name, s.image_url);

  return (
    <View style={cardStyles.wrapper}>
      <RNImage
        source={{ uri: imageUri }}
        style={cardStyles.image}
        resizeMode="cover"
        onError={() => setImgErr(true)}
        defaultSource={{ uri: PLACEHOLDER_IMAGE }}
      />
      <Text style={cardStyles.name}>{s.name}</Text>
      {s.specialty ? (
        <Text style={cardStyles.specialty}>{s.specialty}</Text>
      ) : null}
      <View style={cardStyles.actions}>
        <TouchableOpacity style={cardStyles.mapBtn} onPress={() => {
          const url = `https://www.google.com/maps/search/${encodeURIComponent(s.name + ' ' + (s.address || ''))}`;
          Linking.openURL(url);
        }}>
          <Navigation size={16} color="#FFFFFF" strokeWidth={2} />
          <Text style={cardStyles.mapBtnText}>Xaritada ko'rish</Text>
        </TouchableOpacity>
        {s.website ? (
          <TouchableOpacity style={cardStyles.webBtn} onPress={() => Linking.openURL(s.website!)}>
            <Text style={cardStyles.webBtnText}>Veb-sayt</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity style={cardStyles.bookBtn} onPress={() => navigation.navigate('Booking', {
          sanatoriumName: s.name,
          specialty: s.specialty,
          image: imageUri,
          address: s.address,
          price: s.price,
        })}>
          <Text style={cardStyles.bookBtnText}>Bron qilish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const cardStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  image: { width: '100%', height: 180, borderRadius: 12, marginBottom: 12 },
  name: { fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 4 },
  specialty: { fontSize: 13, color: '#6B7280', fontStyle: 'italic', marginBottom: 12, lineHeight: 18 },
  actions: { gap: 8 },
  mapBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#1B6B3E', borderRadius: 12, paddingVertical: 12,
  },
  mapBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  webBtn: {
    backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  webBtnText: { fontSize: 14, fontWeight: '600', color: '#1B6B3E' },
  bookBtn: {
    backgroundColor: '#F5C842', borderRadius: 12, paddingVertical: 12, alignItems: 'center',
  },
  bookBtnText: { fontSize: 14, fontWeight: '700', color: '#0D4830' },
});

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#075E45" />

      <LinearGradient colors={['#075E45', '#056B4F', '#0A7A5A']} start={{ x: 0, y: 0 }} end={{ x: 1.2, y: 1.2 }} style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarWrap}>
              <LinearGradient colors={['#4CAF7C', '#1B6B3E']} style={styles.avatarGradient}>
                <Sparkle size={22} color="#FFFFFF" strokeWidth={2.2} />
              </LinearGradient>
              <View style={styles.onlineDot} />
            </View>
            <View>
              <Text style={styles.headerTitle}>Sihhat-AI</Text>
              <Text style={styles.headerSub}>Online • Sanatoriyalar bo'yicha yordamchi</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setShowSettings(v => !v)} style={styles.settingsBtn}>
            <Settings size={22} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <FlatList<Message>
        ref={flatRef}
        style={styles.list}
        data={messages}
        keyExtractor={m => m.id}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          if (item.loading) {
            return (
              <View style={[styles.bubble, styles.botBubble, styles.thinkingRow]}>
                <View style={styles.thinkingDot} />
                {[0, 1, 2].map(i => (
                  <Animated.View key={i} style={[styles.dot, { transform: [{ scale: dotScale }], opacity: dotAnim }]} />
                ))}
              </View>
            );
          }

          if (item.sanatoriums) {
            return (
              <View style={styles.botBlock}>
                {item.sanatoriums.map(s => <SanatoriumCard key={s.name} s={s} />)}
                {item.disclaimer ? (
                  <View style={styles.disclaimer}>
                    <AlertTriangle size={14} color="#F59E0B" strokeWidth={2} />
                    <Text style={styles.disclaimerText}>{item.disclaimer}</Text>
                  </View>
                ) : null}
              </View>
            );
          }

          return (
            <View style={[styles.bubble, item.isBot ? styles.botBubble : styles.userBubble]}>
              <Text style={[styles.bubbleText, item.isBot ? styles.botText : styles.userText]}>
                {item.text}
              </Text>
            </View>
          );
        }}
      />

      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}>
        <View style={styles.inputBar}>
          {showAttach && (
            <Animated.View style={[styles.attachRow, { opacity: attachAnim }]}>
              <Pressable style={styles.attachBtn}>
                <View style={[styles.attachCircle, { backgroundColor: '#8B5CF6' }]}>
                  <LucideImage size={20} color="#FFFFFF" strokeWidth={2} />
                </View>
              </Pressable>
              <Pressable style={styles.attachBtn}>
                <View style={[styles.attachCircle, { backgroundColor: '#3B82F6' }]}>
                  <FileText size={20} color="#FFFFFF" strokeWidth={2} />
                </View>
              </Pressable>
            </Animated.View>
          )}
          <View style={styles.inputRow}>
            <Pressable onPress={() => setShowAttach(v => !v)} style={[styles.plusBtn, showAttach && styles.plusBtnActive]}>
              {showAttach ? <X size={20} color="#FFFFFF" strokeWidth={2.5} /> : <Plus size={20} color="#1B6B3E" strokeWidth={2.5} />}
            </Pressable>
            <TextInput
              style={styles.input}
              placeholder="Xabar yozing..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={t => { inputVal.current = t; setInputText(t); }}
              onSubmitEditing={() => handleSend(inputVal.current.trim())}
              returnKeyType="send"
              editable={!loading}
              autoCapitalize="sentences"
            />
            <Pressable
              style={[styles.sendBtn, (!inputVal.current.trim() || loading) && styles.sendBtnDisabled]}
              onPress={() => handleSend(inputVal.current.trim())}
            >
              <Send size={18} color="#FFFFFF" strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>

      {showSettings && (
        <Pressable style={[StyleSheet.absoluteFill, { zIndex: 1000, elevation: 24 }]} onPress={() => setShowSettings(false)}>
          <Animated.View style={[styles.dropdown, { opacity: settingsAnim, transform: [{ scale: settingsAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }] }]}>
            <TouchableOpacity style={styles.dropdownItem} onPress={newChat}>
              <View style={[styles.dropdownIcon, { backgroundColor: '#E8F5E9' }]}>
                <Plus size={18} color="#1B6B3E" strokeWidth={2.5} />
              </View>
              <View>
                <Text style={styles.dropdownText}>Yangi Chat</Text>
                <Text style={styles.dropdownSub}>Suhbatni qaytadan boshlash</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity style={styles.dropdownItem} onPress={clearHistory}>
              <View style={[styles.dropdownIcon, { backgroundColor: '#FEE2E2' }]}>
                <Text style={{ fontSize: 18 }}>🗑</Text>
              </View>
              <View>
                <Text style={[styles.dropdownText, { color: '#EF4444' }]}>Tozalash</Text>
                <Text style={styles.dropdownSub}>Barcha xabarlarni o'chirish</Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F6F4' },
  header: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 0 : 12,
    paddingBottom: 14,
  },
  headerContent: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatarWrap: {
    width: 44, height: 44, borderRadius: 22, position: 'relative',
  },
  avatarGradient: {
    width: 44, height: 44, borderRadius: 22,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)',
  },
  onlineDot: {
    position: 'absolute', bottom: 0, right: 0,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: '#4ADE80',
    borderWidth: 2, borderColor: '#075E45',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: '#FFFFFF' },
  headerSub: { fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 1 },
  settingsBtn: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)',
  },
  dropdown: {
    position: 'absolute', top: Platform.OS === 'ios' ? 64 : 58, right: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 20, paddingVertical: 6, minWidth: 220,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 24, elevation: 12,
    zIndex: 999,
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 10, paddingHorizontal: 16,
  },
  dropdownIcon: {
    width: 34, height: 34, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center',
  },
  dropdownText: { fontSize: 15, fontWeight: '600', color: '#1B6B3E' },
  dropdownSub: { fontSize: 11, color: '#9CA3AF', marginTop: 1 },
  dropdownDivider: { height: 1, backgroundColor: '#F3F4F6', marginHorizontal: 12 },
  list: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  bubble: { maxWidth: '82%', padding: 14, borderRadius: 16, marginBottom: 10 },
  botBubble: {
    backgroundColor: '#FFFFFF', alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  userBubble: {
    backgroundColor: '#1B6B3E', alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  bubbleText: { fontSize: 15, lineHeight: 21 },
  botText: { color: '#1F2937' },
  userText: { color: '#FFFFFF' },
  thinkingRow: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingVertical: 16, paddingHorizontal: 20 },
  thinkingDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1B6B3E', opacity: 0.5 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#1B6B3E' },
  botBlock: { marginBottom: 10 },
  disclaimerText: { fontSize: 11, color: '#92400E', flex: 1, lineHeight: 16 },
  disclaimer: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12,
  },
  inputBar: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 12, paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  attachRow: { flexDirection: 'row', gap: 16, paddingHorizontal: 4, paddingBottom: 10 },
  attachBtn: { alignItems: 'center' },
  attachCircle: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  inputRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: '#FFFFFF', borderRadius: 18,
    paddingHorizontal: 6, paddingVertical: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 6,
  },
  plusBtn: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: '#F3F4F6', alignItems: 'center', justifyContent: 'center',
  },
  plusBtnActive: { backgroundColor: '#1B6B3E' },
  input: {
    flex: 1, height: 44, fontSize: 15, color: '#111827', paddingHorizontal: 4,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 14,
    backgroundColor: '#1B6B3E', alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#D1D5DB' },
});
