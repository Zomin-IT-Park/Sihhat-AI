import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, TextInput, TouchableOpacity, Animated,
  KeyboardAvoidingView, Platform, StatusBar, Keyboard, FlatList,
  Text, Pressable, Image, Linking,
} from 'react-native';
import { Plus, Image as LucideImage, FileText, X, Send, Sparkle, MapPin, Phone, AlertTriangle } from 'lucide-react-native';
import { sendChatMessage, type SanatoriumItem } from '../../lib/chat';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParams } from '../navigation';

const GREEN = '#1B6B3E';
const KEYBOARD_GAP = 38;
const PLACEHOLDER_IMG = 'https://placehold.co/400x200/1B6B3E/FFFFFF?text=Sihhat-AI';
const TEXTS = [
  'Sanatoriya nomini yozing...',
  'Qaysi viloyat qiziqtiradi?',
  "Misol: 'Bel og'rig'iga qaysi sanatoriya yaxshi?'",
];

type ResultMessage = {
  id: string;
  text?: string;
  sanatoriums?: SanatoriumItem[];
  disclaimer?: string;
  loading?: boolean;
  isBot: boolean;
};

export default function HealthScreen() {
  const [query, setQuery] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultMessage[]>([]);
  const [displayText, setDisplayText] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  const textIdx = useRef(0);
  const charIdx = useRef(0);
  const isDeleting = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flatRef = useRef<FlatList>(null);
  const dotAnim = useRef(new Animated.Value(0)).current;

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

  const dotScale = dotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  const stopAnimation = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startAnimation = useCallback(() => {
    stopAnimation();
    const currentText = TEXTS[textIdx.current];
    if (!isDeleting.current) {
      charIdx.current++;
      setDisplayText(currentText.slice(0, charIdx.current));
      if (charIdx.current >= currentText.length) {
        isDeleting.current = true;
        timerRef.current = setTimeout(startAnimation, 2000);
      } else {
        timerRef.current = setTimeout(startAnimation, 70);
      }
    } else {
      charIdx.current--;
      setDisplayText(currentText.slice(0, charIdx.current));
      if (charIdx.current <= 0) {
        isDeleting.current = false;
        textIdx.current = (textIdx.current + 1) % TEXTS.length;
        timerRef.current = setTimeout(startAnimation, 500);
      } else {
        timerRef.current = setTimeout(startAnimation, 40);
      }
    }
  }, [stopAnimation]);

  useEffect(() => {
    const delay = setTimeout(startAnimation, 500);
    return () => { clearTimeout(delay); stopAnimation(); };
  }, [startAnimation, stopAnimation]);

  useEffect(() => {
    const show = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow', (e) => {
      setKeyboardOffset(e.endCoordinates.height + KEYBOARD_GAP);
    });
    const hide = Keyboard.addListener(Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide', () => {
      setKeyboardOffset(0);
    });
    return () => { show.remove(); hide.remove(); };
  }, []);

  function toggleActions() {
    const to = !showActions;
    Animated.spring(scaleAnim, {
      toValue: to ? 1 : 0,
      useNativeDriver: true,
      friction: 6,
    }).start();
    setShowActions(to);
  }

  const showTyping = !query.trim() && results.length === 0;

  async function handleSend() {
    const txt = query.trim();
    if (!txt || loading) return;
    setQuery('');
    setLoading(true);
    setResults(prev => [...prev,
      { id: Date.now().toString(), text: txt, isBot: false },
      { id: 'loading', isBot: true, loading: true },
    ]);
    try {
      const res = await sendChatMessage(txt);
      setResults(prev => {
        const filtered = prev.filter(m => m.id !== 'loading');
        const newMsg: ResultMessage = { id: (Date.now() + 1).toString(), isBot: true };
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
    } catch {
      setResults(prev => prev.filter(m => m.id !== 'loading'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#F2F6F4' }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F2F6F4" />

      <FlatList
        ref={flatRef}
        style={{ flex: 1 }}
        data={results}
        keyExtractor={m => m.id}
        onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={{
            flex: 1, alignItems: 'center', justifyContent: 'center',
            paddingTop: 80, paddingHorizontal: 24,
          }}>
            <Sparkle size={48} color="#1B6B3E" strokeWidth={1.5} />
            <Text style={{
              fontSize: 22, fontWeight: '800', color: '#111827',
              marginTop: 16, textAlign: 'center',
            }}>AI Sihatgohlarni qidirish</Text>
            <Text style={{
              fontSize: 14, color: '#6B7280', marginTop: 8,
              textAlign: 'center', lineHeight: 20,
            }}>
              O'zbekistondagi sanatoriyalar, sog'lomlashtirish markazlari va kurortlar haqida ma'lumot oling
            </Text>
            <View style={{
              flexDirection: 'row', gap: 24, marginTop: 32,
            }}>
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 56, height: 56, borderRadius: 28,
                  backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center',
                }}>
                  <MapPin size={26} color="#1B6B3E" strokeWidth={2} />
                </View>
                <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 6, fontWeight: '500' }}>Joylashuv</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 56, height: 56, borderRadius: 28,
                  backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Phone size={26} color="#1B6B3E" strokeWidth={2} />
                </View>
                <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 6, fontWeight: '500' }}>Aloqa</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  width: 56, height: 56, borderRadius: 28,
                  backgroundColor: '#E8F5E9', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkle size={26} color="#1B6B3E" strokeWidth={2} />
                </View>
                <Text style={{ fontSize: 11, color: '#6B7280', marginTop: 6, fontWeight: '500' }}>AI</Text>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => {
          if (item.loading) {
            return (
              <View style={{
                flexDirection: 'row', alignItems: 'center', gap: 4,
                backgroundColor: '#FFFFFF', alignSelf: 'flex-start',
                padding: 16, borderRadius: 16, marginBottom: 10, marginHorizontal: 16,
                borderBottomLeftRadius: 4,
              }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#1B6B3E', opacity: 0.5 }} />
                {[0, 1, 2].map(i => (
                  <Animated.View key={i} style={{
                    width: 8, height: 8, borderRadius: 4, backgroundColor: '#1B6B3E',
                    transform: [{ scale: dotScale }], opacity: dotAnim,
                  }} />
                ))}
              </View>
            );
          }

          if (item.sanatoriums) {
            return (
              <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                {item.sanatoriums.map((s: SanatoriumItem, i: number) => (
                  <View key={i} style={{
                    backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10,
                    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
                  }}>
                    <Image source={{ uri: s.image_url || PLACEHOLDER_IMG }} style={{
                      width: '100%', height: 180, borderRadius: 12, marginBottom: 12,
                    }} resizeMode="cover" />
                    <Text style={{ fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 4 }}>{s.name}</Text>
                    {s.specialty ? (
                      <Text style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic', marginBottom: 12 }}>{s.specialty}</Text>
                    ) : null}
                    <TouchableOpacity style={{
                      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                      backgroundColor: '#1B6B3E', borderRadius: 12, paddingVertical: 12, marginBottom: 8,
                    }} onPress={() => {
                      const url = `https://www.google.com/maps/search/${encodeURIComponent(s.name + ' ' + (s.address || ''))}`;
                      Linking.openURL(url);
                    }}>
                      <MapPin size={16} color="#FFFFFF" strokeWidth={2} />
                      <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFFFFF' }}>Xaritada ko'rish</Text>
                    </TouchableOpacity>
                    {s.website ? (
                      <TouchableOpacity style={{
                        backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 12, alignItems: 'center',
                      }} onPress={() => Linking.openURL(s.website!)}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1B6B3E' }}>Veb-sayt</Text>
                      </TouchableOpacity>
                    ) : null}
                  </View>
                ))}
                {item.disclaimer && (
                  <View style={{
                    flexDirection: 'row', alignItems: 'flex-start', gap: 6,
                    backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12,
                  }}>
                    <AlertTriangle size={14} color="#F59E0B" strokeWidth={2} />
                    <Text style={{ fontSize: 11, color: '#92400E', flex: 1, lineHeight: 16 }}>{item.disclaimer}</Text>
                  </View>
                )}
              </View>
            );
          }

          return (
            <View style={{
              maxWidth: '82%', padding: 14, borderRadius: 16, marginBottom: 10, marginHorizontal: 16,
              backgroundColor: item.isBot ? '#FFFFFF' : '#1B6B3E',
              alignSelf: item.isBot ? 'flex-start' : 'flex-end',
              borderBottomLeftRadius: item.isBot ? 4 : 16,
              borderBottomRightRadius: item.isBot ? 16 : 4,
              shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
            }}>
              <Text style={{
                fontSize: 15, lineHeight: 21,
                color: item.isBot ? '#1F2937' : '#FFFFFF',
              }}>{item.text}</Text>
            </View>
          );
        }}
        contentContainerStyle={{ paddingBottom: 100 }}
      />

      <View style={{
        paddingHorizontal: 12,
        paddingBottom: keyboardOffset || 100,
        paddingTop: 8,
      }}>
        {showActions && (
          <Animated.View style={{
            flexDirection: 'row', gap: 16, paddingHorizontal: 4, paddingBottom: 10,
            transform: [{ scale: scaleAnim }], opacity: scaleAnim,
          }}>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <View style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center',
              }}>
                <LucideImage size={22} color="#FFFFFF" strokeWidth={2} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <View style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: '#3B82F6', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={22} color="#FFFFFF" strokeWidth={2} />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}

        <View style={{
          flexDirection: 'row', alignItems: 'center', gap: 10,
          backgroundColor: '#FFFFFF',
          borderRadius: 18,
          paddingHorizontal: 6, paddingVertical: 6,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 16,
          elevation: 6,
        }}>
          <TouchableOpacity
            onPress={toggleActions}
            style={{
              width: 40, height: 40, borderRadius: 14,
              backgroundColor: showActions ? GREEN : '#F3F4F6',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            {showActions ? (
              <X size={20} color="#FFFFFF" strokeWidth={2.5} />
            ) : (
              <Plus size={20} color={GREEN} strokeWidth={2.5} />
            )}
          </TouchableOpacity>

          <TextInput
            ref={inputRef}
            style={{ flex: 1, height: 44, fontSize: 16, color: '#111827', paddingHorizontal: 4 }}
            placeholder={showTyping ? displayText : ''}
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            editable={!loading}
          />

          <TouchableOpacity
            onPress={handleSend}
            style={{
              width: 40, height: 40, borderRadius: 14,
              backgroundColor: query.trim() && !loading ? GREEN : '#E5E7EB',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Send size={18} color={query.trim() && !loading ? '#FFFFFF' : '#9CA3AF'} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
