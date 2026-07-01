import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, TextInput, TouchableOpacity, Animated,
  KeyboardAvoidingView, Platform, StatusBar, Keyboard, FlatList,
  Text, Pressable, Image, Linking, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  Plus, Image as LucideImage, FileText, X, Sparkle, MapPin, Phone, AlertTriangle, User,
  ArrowLeft, Settings, Bot, MessageSquarePlus, Trash2, History, Globe,
} from 'lucide-react-native';
import { IconlySend } from '../components/icons/IconlyIcons';
import { sendChatMessage, type SanatoriumItem } from '../../lib/chat';
import { searchSanatoriumsByName, searchSanatoriumsByRegion, type SanatoriumRecord } from '../../lib/sanatoriums';
import { getSanatoriumImage } from '../../lib/images';
import { getCurrentPosition, getAddressFromCoords } from '../../lib/location';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParams } from '../navigation';

const GREEN = '#1B6B3E';
const KEYBOARD_GAP = 38;
const TEXTS = [
  'Sanatoriya nomini yozing...',
  'Qaysi viloyat qiziqtiradi?',
  "Misol: 'Bel og'rig'iga qaysi sanatoriya yaxshi?'",
];

type Scope = 'national' | 'nearby';

type ResultMessage = {
  id: string;
  text?: string;
  sanatoriums?: SanatoriumItem[];
  registryResults?: SanatoriumRecord[];
  disclaimer?: string;
  loading?: boolean;
  isBot: boolean;
  scopeQuestion?: boolean;
  resolvedScope?: Scope;
  therapyPrompt?: Scope;
  therapySubmitted?: string;
};

export default function HealthScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParams>>();
  const [query, setQuery] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultMessage[]>([]);
  const [therapyInputs, setTherapyInputs] = useState<Record<string, string>>({});
  const [displayText, setDisplayText] = useState('');
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const settingsAnim = useRef(new Animated.Value(0)).current;
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

  useEffect(() => {
    Animated.spring(settingsAnim, {
      toValue: showSettings ? 1 : 0,
      useNativeDriver: true,
      friction: 8,
    }).start();
  }, [showSettings, settingsAnim]);

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

  function newChat() {
    setResults([]);
    setShowSettings(false);
  }

  function clearHistory() {
    setResults([]);
    setShowSettings(false);
  }

  function recentSearches() {
    setShowSettings(false);
  }

  const showHero = results.length === 0;
  const showTyping = !query.trim() && showHero;

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
      // Avval o'zimizning reestr (Excel'dan yuklangan sanatoriums jadvali)
      // bo'yicha nom orqali qidiramiz — aniq muassasa nomi yozilgan bo'lsa,
      // shu yerdan topiladi va AI-chatga murojaat qilinmaydi.
      const registryMatches = await searchSanatoriumsByName(txt);
      if (registryMatches.length > 0) {
        setResults(prev => {
          const filtered = prev.filter(m => m.id !== 'loading');
          return [...filtered, { id: (Date.now() + 1).toString(), isBot: true, registryResults: registryMatches }];
        });
        return;
      }

      // Aniq muassasa nomi topilmadi — foydalanuvchi umumiy sanatoriya
      // tavsiyasi so'rayotgan bo'lishi mumkin. Shuning uchun qidiruv
      // doirasini so'raymiz (butun O'zbekiston yoki yaqin hudud).
      setResults(prev => {
        const filtered = prev.filter(m => m.id !== 'loading');
        return [...filtered, { id: (Date.now() + 1).toString(), isBot: true, scopeQuestion: true }];
      });
    } catch {
      setResults(prev => prev.filter(m => m.id !== 'loading'));
    } finally {
      setLoading(false);
    }
  }

  function handleScopeSelect(messageId: string, scope: Scope) {
    setResults(prev => {
      const updated = prev.map(m => (m.id === messageId ? { ...m, resolvedScope: scope } : m));
      const promptId = `${messageId}-therapy`;
      return [...updated, { id: promptId, isBot: true, therapyPrompt: scope }];
    });
  }

  async function handleTherapySubmit(messageId: string, scope: Scope) {
    const text = (therapyInputs[messageId] || '').trim();
    if (!text || loading) return;
    setLoading(true);
    setResults(prev => {
      const updated = prev.map(m => (m.id === messageId ? { ...m, therapySubmitted: text } : m));
      return [...updated, { id: `${messageId}-loading`, isBot: true, loading: true }];
    });

    try {
      if (scope === 'national') {
        const res = await sendChatMessage(text);
        const aiItems = res.type === 'sanatorium_list' ? res.sanatoriums.slice(0, 3) : [];
        const enriched: SanatoriumRecord[] = [];
        for (const item of aiItems) {
          const match = await searchSanatoriumsByName(item.name);
          enriched.push(match[0] ?? {
            id: -1,
            name: item.name,
            address: item.address ?? null,
            phone: item.phone ?? null,
            email: null,
            tin: null,
            responsible_person: item.owner ?? null,
            image_url: item.image_url ?? null,
          });
        }
        setResults(prev => {
          const filtered = prev.filter(m => m.id !== `${messageId}-loading`);
          if (enriched.length === 0) {
            return [...filtered, { id: `${messageId}-result`, isBot: true, text: "Afsuski, mos sanatoriya topilmadi. Boshqacharoq yozib ko'ring." }];
          }
          return [...filtered, { id: `${messageId}-result`, isBot: true, registryResults: enriched }];
        });
      } else {
        const coords = await getCurrentPosition();
        if (!coords) {
          setResults(prev => {
            const filtered = prev.filter(m => m.id !== `${messageId}-loading`);
            return [...filtered, { id: `${messageId}-result`, isBot: true, text: "Joylashuvga ruxsat berilmadi. Sozlamalardan ruxsat berib, qayta urinib ko'ring." }];
          });
          return;
        }
        const regionText = await getAddressFromCoords(coords.latitude, coords.longitude);
        const nearby = await searchSanatoriumsByRegion(regionText, 3);
        setResults(prev => {
          const filtered = prev.filter(m => m.id !== `${messageId}-loading`);
          if (nearby.length === 0) {
            return [...filtered, { id: `${messageId}-result`, isBot: true, text: `"${regionText}" hududida bizning ro'yxatda sanatoriya topilmadi.` }];
          }
          return [...filtered, { id: `${messageId}-result`, isBot: true, registryResults: nearby }];
        });
      }
    } catch {
      setResults(prev => prev.filter(m => m.id !== `${messageId}-loading`));
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F2F6F4' }}>
      <StatusBar barStyle="light-content" backgroundColor={GREEN} />

      <SafeAreaView edges={['top']} style={{ backgroundColor: GREEN }}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.canGoBack() && navigation.goBack()}
              style={styles.backBtn}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <ArrowLeft size={22} color="#FFFFFF" strokeWidth={2.2} />
            </TouchableOpacity>
            <View style={styles.avatarWrap}>
              <Bot size={22} color={GREEN} strokeWidth={2.2} />
            </View>
            <Text style={styles.headerTitle}>Sihhat AI</Text>
          </View>
          <TouchableOpacity onPress={() => setShowSettings(v => !v)} style={styles.settingsBtn}>
            <Settings size={22} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <FlatList
          ref={flatRef}
          style={{ flex: 1 }}
          data={results}
          keyExtractor={m => m.id}
          onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={showHero ? (
            <View style={{
              alignItems: 'center', justifyContent: 'center',
              paddingTop: 24, paddingBottom: 40, paddingHorizontal: 24,
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
          ) : null}
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

            if (item.scopeQuestion) {
              return (
                <View style={{
                  maxWidth: '88%', padding: 14, borderRadius: 16, marginBottom: 10, marginHorizontal: 16,
                  backgroundColor: '#FFFFFF', alignSelf: 'flex-start', borderBottomLeftRadius: 4,
                  shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
                }}>
                  <Text style={{ fontSize: 15, lineHeight: 21, color: '#1F2937', marginBottom: 12 }}>
                    Qidiruv doirasini tanlang:
                  </Text>
                  {item.resolvedScope ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {item.resolvedScope === 'national'
                        ? <Globe size={16} color="#1B6B3E" strokeWidth={2.2} />
                        : <MapPin size={16} color="#1B6B3E" strokeWidth={2.2} />}
                      <Text style={{ fontSize: 14, fontWeight: '700', color: '#1B6B3E' }}>
                        {item.resolvedScope === 'national' ? "Butun O'zbekiston bo'ylab" : 'Sizga yaqin hududlar'}
                      </Text>
                    </View>
                  ) : (
                    <View style={{ gap: 8 }}>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                          backgroundColor: '#1B6B3E', borderRadius: 12, paddingVertical: 12,
                        }}
                        onPress={() => handleScopeSelect(item.id, 'national')}
                      >
                        <Globe size={16} color="#FFFFFF" strokeWidth={2.2} />
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Butun O'zbekiston bo'ylab</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
                          backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 12,
                        }}
                        onPress={() => handleScopeSelect(item.id, 'nearby')}
                      >
                        <MapPin size={16} color="#1B6B3E" strokeWidth={2.2} />
                        <Text style={{ fontSize: 14, fontWeight: '700', color: '#1B6B3E' }}>Sizga yaqin hududlar</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            }

            if (item.therapyPrompt) {
              return (
                <View style={{
                  maxWidth: '88%', padding: 14, borderRadius: 16, marginBottom: 10, marginHorizontal: 16,
                  backgroundColor: '#FFFFFF', alignSelf: 'flex-start', borderBottomLeftRadius: 4,
                  shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
                }}>
                  <Text style={{ fontSize: 15, lineHeight: 21, color: '#1F2937', marginBottom: item.therapySubmitted ? 0 : 10 }}>
                    Siz qaysi terapiya / qaysi kasallik bilan dam olmoqchisiz?
                  </Text>
                  {item.therapySubmitted ? (
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#1B6B3E', marginTop: 6 }}>{item.therapySubmitted}</Text>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <TextInput
                        style={{
                          flex: 1, borderWidth: 1.5, borderColor: '#E5E7EB', borderRadius: 12,
                          paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: '#111827',
                          backgroundColor: '#FAFAFA',
                        }}
                        placeholder="Masalan: bel og'rig'i, nafas olish yo'llari..."
                        placeholderTextColor="#9CA3AF"
                        value={therapyInputs[item.id] || ''}
                        onChangeText={(t) => setTherapyInputs(prev => ({ ...prev, [item.id]: t }))}
                        onSubmitEditing={() => handleTherapySubmit(item.id, item.therapyPrompt!)}
                        returnKeyType="send"
                        editable={!loading}
                      />
                      <TouchableOpacity
                        style={{
                          width: 40, height: 40, borderRadius: 12,
                          backgroundColor: (therapyInputs[item.id] || '').trim() ? GREEN : '#E5E7EB',
                          alignItems: 'center', justifyContent: 'center',
                        }}
                        disabled={!(therapyInputs[item.id] || '').trim()}
                        onPress={() => handleTherapySubmit(item.id, item.therapyPrompt!)}
                      >
                        <IconlySend size={16} color={(therapyInputs[item.id] || '').trim() ? '#FFFFFF' : '#9CA3AF'} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            }

            if (item.registryResults) {
              return (
                <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
                  {item.registryResults.map((s: SanatoriumRecord, i: number) => (
                    <View key={`${s.id}-${i}`} style={{
                      backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 10,
                      shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
                    }}>
                      <Image source={{ uri: getSanatoriumImage(s.name, s.image_url) }} style={{
                        width: '100%', height: 180, borderRadius: 12, marginBottom: 12,
                      }} resizeMode="cover" />
                      <Text style={{ fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 4 }}>{s.name}</Text>
                      {s.responsible_person ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <User size={13} color="#6B7280" strokeWidth={2} />
                          <Text style={{ fontSize: 13, color: '#6B7280' }}>{s.responsible_person}</Text>
                        </View>
                      ) : null}
                      {s.address ? (
                        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6, marginBottom: 12 }}>
                          <MapPin size={13} color="#6B7280" strokeWidth={2} />
                          <Text style={{ fontSize: 13, color: '#6B7280', flex: 1 }}>{s.address}</Text>
                        </View>
                      ) : null}
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity style={{
                          flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                          backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 12,
                        }} onPress={() => {
                          const url = `https://www.google.com/maps/search/${encodeURIComponent(s.name + ' ' + (s.address || ''))}`;
                          Linking.openURL(url);
                        }}>
                          <MapPin size={16} color="#1B6B3E" strokeWidth={2} />
                          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1B6B3E' }}>Xaritada ko'rish</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                          flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                          backgroundColor: '#1B6B3E', borderRadius: 12, paddingVertical: 12,
                        }} onPress={() => {
                          navigation.navigate('Booking', {
                            sanatoriumName: s.name,
                            image: getSanatoriumImage(s.name, s.image_url),
                            address: s.address ?? undefined,
                          });
                        }}>
                          <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Bron qilish</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
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
                      <Image source={{ uri: getSanatoriumImage(s.name, s.image_url) }} style={{
                        width: '100%', height: 180, borderRadius: 12, marginBottom: 12,
                      }} resizeMode="cover" />
                      <Text style={{ fontSize: 17, fontWeight: '700', color: '#111827', marginBottom: 4 }}>{s.name}</Text>
                      {s.specialty ? (
                        <Text style={{ fontSize: 13, color: '#6B7280', fontStyle: 'italic', marginBottom: 12 }}>{s.specialty}</Text>
                      ) : null}
                      <View style={{ flexDirection: 'row', gap: 8, marginBottom: s.website ? 8 : 0 }}>
                        <TouchableOpacity style={{
                          flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                          backgroundColor: '#F3F4F6', borderRadius: 12, paddingVertical: 12,
                        }} onPress={() => {
                          const url = `https://www.google.com/maps/search/${encodeURIComponent(s.name + ' ' + (s.address || ''))}`;
                          Linking.openURL(url);
                        }}>
                          <MapPin size={16} color="#1B6B3E" strokeWidth={2} />
                          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1B6B3E' }}>Xaritada ko'rish</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={{
                          flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
                          backgroundColor: '#1B6B3E', borderRadius: 12, paddingVertical: 12,
                        }} onPress={() => {
                          navigation.navigate('Booking', {
                            sanatoriumName: s.name,
                            specialty: s.specialty,
                            image: getSanatoriumImage(s.name, s.image_url),
                            address: s.address,
                            price: s.price,
                          });
                        }}>
                          <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Bron qilish</Text>
                        </TouchableOpacity>
                      </View>
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
              <IconlySend size={18} color={query.trim() && !loading ? '#FFFFFF' : '#9CA3AF'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      {showSettings && (
        <Pressable style={[StyleSheet.absoluteFill, { zIndex: 1000, elevation: 24 }]} onPress={() => setShowSettings(false)}>
          <Animated.View style={[
            styles.dropdown,
            {
              opacity: settingsAnim,
              transform: [{ scale: settingsAnim.interpolate({ inputRange: [0, 1], outputRange: [0.85, 1] }) }],
            },
          ]}>
            <TouchableOpacity style={styles.dropdownItem} onPress={newChat}>
              <MessageSquarePlus size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.dropdownText}>Yangi chat</Text>
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity style={styles.dropdownItem} onPress={clearHistory}>
              <Trash2 size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.dropdownText}>Tarixni tozalash</Text>
            </TouchableOpacity>
            <View style={styles.dropdownDivider} />
            <TouchableOpacity style={styles.dropdownItem} onPress={recentSearches}>
              <History size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.dropdownText}>Oxirgi qidiruvlar</Text>
            </TouchableOpacity>
          </Animated.View>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingTop: Platform.OS === 'ios' ? 4 : 10,
    paddingBottom: 14,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  backBtn: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarWrap: {
    width: 36, height: 36, borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 19, fontWeight: '800', color: '#FFFFFF' },
  settingsBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center', justifyContent: 'center',
  },
  dropdown: {
    position: 'absolute', top: Platform.OS === 'ios' ? 100 : 84, right: 12,
    backgroundColor: GREEN,
    borderRadius: 18, paddingVertical: 6, minWidth: 210,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2, shadowRadius: 24, elevation: 12,
    zIndex: 999,
  },
  dropdownItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 12, paddingHorizontal: 16,
  },
  dropdownText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  dropdownDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.15)', marginHorizontal: 12 },
});
