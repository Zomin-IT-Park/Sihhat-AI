import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, TextInput, TouchableOpacity, Animated,
  KeyboardAvoidingView, Platform, StatusBar, Keyboard,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Plus, Image, FileText, X, Send } from 'lucide-react-native';
import type { MainTabParams } from '../navigation'; // from src/screens/ to src/navigation/

const GREEN = '#1B6B3E';
const KEYBOARD_GAP = 38;
const TYPING_SPEED = 70;
const DELETE_SPEED = 40;
const PAUSE_AFTER_TYPING = 2000;
const PAUSE_AFTER_DELETE = 500;

const TEXTS = [
  'Sanatoriya nomini yozing...',
  'Qaysi viloyat qiziqtiradi?',
  "Misol: 'Bel og'rig'iga qaysi sanatoriya yaxshi?'",
];

export default function HealthScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<MainTabParams>>();
  const [query, setQuery] = useState('');
  const [showActions, setShowActions] = useState(false);
  const [displayText, setDisplayText] = useState('');
  const [keyboardOffset, setKeyboardOffset] = useState(0);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const inputRef = useRef<TextInput>(null);
  const textIdx = useRef(0);
  const charIdx = useRef(0);
  const isDeleting = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
        timerRef.current = setTimeout(startAnimation, PAUSE_AFTER_TYPING);
      } else {
        timerRef.current = setTimeout(startAnimation, TYPING_SPEED);
      }
    } else {
      charIdx.current--;
      setDisplayText(currentText.slice(0, charIdx.current));
      if (charIdx.current <= 0) {
        isDeleting.current = false;
        textIdx.current = (textIdx.current + 1) % TEXTS.length;
        timerRef.current = setTimeout(startAnimation, PAUSE_AFTER_DELETE);
      } else {
        timerRef.current = setTimeout(startAnimation, DELETE_SPEED);
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

  const actionScale = scaleAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const showTyping = !query.trim();

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
            placeholder={showTyping ? displayText : ''}
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />

          <TouchableOpacity
            onPress={() => {
              if (!query.trim()) return;
              navigation.navigate('Chat');
            }}
            style={{
              width: 40, height: 40, borderRadius: 14,
              backgroundColor: query.trim() ? GREEN : '#E5E7EB',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Send size={18} color={query.trim() ? '#FFFFFF' : '#9CA3AF'} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
