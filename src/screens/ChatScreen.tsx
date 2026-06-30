import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet, View, Text, TextInput, FlatList, TouchableOpacity,
  KeyboardAvoidingView, Platform, Animated, StatusBar, Pressable, Image, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Send, Sparkle, MapPin, Phone, AlertTriangle } from 'lucide-react-native';
import { sendChatMessage, type ChatResponse, type SanatoriumItem } from '../../lib/chat';

type Message = {
  id: string;
  text?: string;
  isBot: boolean;
  sanatoriums?: SanatoriumItem[];
  disclaimer?: string;
  loading?: boolean;
};

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: "Assalomu alaykum! Men Sihhat-AI yordamchisiman. O'zbekistondagi sanatoriyalar haqida ma'lumot bera olaman. Qaysi hududdagi sanatoriyalar sizni qiziqtiradi?", isBot: true },
  ]);
  const [loading, setLoading] = useState(false);
  const flatRef = useRef<FlatList>(null);
  const dotAnim = useRef(new Animated.Value(0)).current;
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

  const [inputText, setInputText] = useState('');

  const dotScale = dotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View style={styles.headerIcon}>
            <Sparkle size={18} color="#1B6B3E" strokeWidth={2.2} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Sihhat-AI</Text>
            <Text style={styles.headerSub}>Sanatoriyalar bo'yicha yordamchi</Text>
          </View>
        </View>
      </View>

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
                  <Animated.View
                    key={i}
                    style={[
                      styles.dot,
                      { transform: [{ scale: dotScale }], opacity: dotAnim },
                    ]}
                  />
                ))}
              </View>
            );
          }

          if (item.sanatoriums) {
            return (
              <View style={styles.botBlock}>
                {item.sanatoriums.map((s, i) => (
                  <View key={i} style={styles.card}>
                    {s.image_url ? (
                      <Image source={{ uri: s.image_url }} style={styles.cardImage} resizeMode="cover" />
                    ) : null}
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardName}>{s.name}</Text>
                      <View style={styles.distanceBadge}>
                        <MapPin size={12} color="#1B6B3E" strokeWidth={2.5} />
                        <Text style={styles.distanceText}>{s.distance}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardAddress}>{s.address}</Text>
                    {s.phone ? (
                      <View style={styles.cardRow}>
                        <Phone size={14} color="#6B7280" strokeWidth={2} />
                        <Text style={styles.cardPhone}>{s.phone}</Text>
                      </View>
                    ) : null}
                    {s.owner ? (
                      <Text style={styles.cardOwner}>Egasining ismi: {s.owner}</Text>
                    ) : null}
                    <Text style={styles.cardSpecialty}>Yo'nalishi: {s.specialty}</Text>
                    <TouchableOpacity style={styles.mapBtn} onPress={() => {
                      const url = `https://www.google.com/maps/search/${encodeURIComponent(s.name + ' ' + (s.address || ''))}`;
                      Linking.openURL(url);
                    }}>
                      <MapPin size={16} color="#FFFFFF" strokeWidth={2} />
                      <Text style={styles.mapBtnText}>Xaritada ko'rish</Text>
                    </TouchableOpacity>
                    {s.website ? (
                      <TouchableOpacity style={styles.webBtn} onPress={() => Linking.openURL(s.website!)}>
                        <Text style={styles.webBtnText}>Veb-sayt</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ))}
                {item.disclaimer && (
                  <View style={styles.disclaimer}>
                    <AlertTriangle size={14} color="#F59E0B" strokeWidth={2} />
                    <Text style={styles.disclaimerText}>{item.disclaimer}</Text>
                  </View>
                )}
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

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <View style={styles.inputBar}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Xabar yozing..."
              placeholderTextColor="#9CA3AF"
              value={inputText}
              onChangeText={t => { inputVal.current = t; setInputText(t); }}
              onSubmitEditing={() => {
                const txt = inputVal.current.trim();
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
                    return [...filtered, {
                      id: (Date.now() + 1).toString(),
                      text: (res as any).message || 'Javob olindi',
                      isBot: true,
                    }];
                  });
                }).catch(() => {
                  setMessages(prev => prev.filter(m => m.id !== 'loading'));
                });
              }}
              returnKeyType="send"
              editable={!loading}
              autoCapitalize="sentences"
            />
            <Pressable
              style={[styles.sendBtn, (!inputVal.current.trim() || loading) && styles.sendBtnDisabled]}
              onPress={() => {
                const txt = inputVal.current.trim();
                if (!txt) return;
                inputVal.current = '';
                setInputText('');
                const msgId = Date.now().toString();
                setMessages(prev => [...prev,
                  { id: msgId, text: txt, isBot: false },
                  { id: 'loading', isBot: true, loading: true },
                ]);
                sendChatMessage(txt).then(res => {
                  setMessages(prev => {
                    const filtered = prev.filter(m => m.id !== 'loading');
                    return [...filtered, {
                      id: (Date.now() + 1).toString(),
                      text: (res as any).message || 'Javob olindi',
                      isBot: true,
                    }];
                  });
                }).catch(() => {
                  setMessages(prev => prev.filter(m => m.id !== 'loading'));
                });
              }}
            >
              <Send size={18} color="#FFFFFF" strokeWidth={2.2} />
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F6F4' },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerIcon: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, fontWeight: '700', color: '#111827' },
  headerSub: { fontSize: 11, color: '#6B7280', marginTop: 1 },
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
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardName: { fontSize: 16, fontWeight: '700', color: '#111827', flex: 1 },
  distanceBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#E8F5E9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8,
  },
  distanceText: { fontSize: 12, fontWeight: '600', color: '#1B6B3E' },
  cardImage: { width: '100%', height: 160, borderRadius: 10, marginBottom: 10 },
  cardAddress: { fontSize: 13, color: '#6B7280', marginBottom: 6 },
  cardRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  cardPhone: { fontSize: 14, color: '#374151', fontWeight: '500' },
  cardOwner: { fontSize: 12, color: '#6B7280', marginBottom: 4, fontStyle: 'italic' },
  cardSpecialty: { fontSize: 12, color: '#6B7280', marginBottom: 10 },
  mapBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: '#1B6B3E', borderRadius: 12, paddingVertical: 10,
  },
  mapBtnText: { fontSize: 14, fontWeight: '600', color: '#FFFFFF' },
  webBtn: { marginTop: 6, backgroundColor: '#F3F4F6', borderRadius: 10, paddingVertical: 8, alignItems: 'center' },
  webBtnText: { fontSize: 13, fontWeight: '600', color: '#1B6B3E' },
  disclaimer: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
    backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12,
  },
  disclaimerText: { fontSize: 11, color: '#92400E', flex: 1, lineHeight: 16 },
  inputBar: {
    backgroundColor: '#FFFFFF', borderTopWidth: 1, borderTopColor: '#E5E7EB',
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  inputRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center' },
  input: {
    flex: 1, height: 44, backgroundColor: '#F3F4F6', borderRadius: 22,
    paddingHorizontal: 18, fontSize: 15, color: '#111827',
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#1B6B3E', alignItems: 'center', justifyContent: 'center',
  },
  sendBtnDisabled: { backgroundColor: '#D1D5DB' },
});
