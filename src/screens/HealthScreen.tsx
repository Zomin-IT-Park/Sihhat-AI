import React, { useState, useRef, useEffect } from 'react';
import {
  View, TextInput, TouchableOpacity, Animated,
  KeyboardAvoidingView, Platform, StatusBar, Keyboard,
} from 'react-native';
import { Plus, Image, FileText, X, Send } from 'lucide-react-native';

const GREEN = '#1B6B3E';
const KEYBOARD_GAP = 38;

const placeholders = [
  "Sog'lig'ingiz haqida so'rang...",
  'Qanday yordam kerak?',
  'Belgilaringizni yozing...',
];

export default function HealthScreen() {
  const [query, setQuery] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [placeholder, setPlaceholder] = useState(placeholders[0]);
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder(prev => {
        const idx = placeholders.indexOf(prev);
        return placeholders[(idx + 1) % placeholders.length];
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

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

  const actionScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#F2F6F4' }}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#F2F6F4" />

      <View style={{ flex: 1 }} />

      <View style={{
        paddingHorizontal: 12,
        paddingBottom: keyboardOffset || 100,
        paddingTop: 8,
      }}>
        {showActions && (
          <Animated.View style={{
            flexDirection: 'row',
            gap: 16,
            paddingHorizontal: 4,
            paddingBottom: 10,
            transform: [{ scale: actionScale }],
            opacity: scaleAnim,
          }}>
            <TouchableOpacity style={{ alignItems: 'center' }}>
              <View style={{
                width: 48, height: 48, borderRadius: 24,
                backgroundColor: '#8B5CF6', alignItems: 'center', justifyContent: 'center',
              }}>
                <Image size={22} color="#FFFFFF" strokeWidth={2} />
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
            style={{
              flex: 1,
              height: 44,
              fontSize: 16,
              color: '#111827',
              paddingHorizontal: 4,
            }}
            placeholder={placeholder}
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />

          <TouchableOpacity style={{
            width: 40, height: 40, borderRadius: 14,
            backgroundColor: query.trim() ? GREEN : '#E5E7EB',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Send size={18} color={query.trim() ? '#FFFFFF' : '#9CA3AF'} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
