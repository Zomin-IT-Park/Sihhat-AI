import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  message: string;
  type?: 'error' | 'success';
  visible: boolean;
  onHide: () => void;
}

export default function Toast({ message, type = 'error', visible, onHide }: Props) {
  const translateY = useRef(new Animated.Value(-160)).current;
  const insets = useSafeAreaInsets();
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (visible && message) {
      if (timer.current) clearTimeout(timer.current);
      Animated.spring(translateY, {
        toValue: 0, useNativeDriver: true,
        tension: 80, friction: 10,
      }).start();
      timer.current = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -160, duration: 280, useNativeDriver: true,
        }).start(() => onHide());
      }, 3000);
    }
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [visible, message]);

  const bg = type === 'error' ? '#DC2626' : '#16A34A';

  return (
    <Animated.View
      style={[
        styles.container,
        { top: insets.top + 12, backgroundColor: bg },
        { transform: [{ translateY }] },
      ]}
      pointerEvents="none"
    >
      <View style={styles.inner}>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute', left: 16, right: 16,
    zIndex: 9999, borderRadius: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18, shadowRadius: 10, elevation: 10,
  },
  inner: { padding: 14, borderRadius: 14 },
  text: { fontSize: 14.5, fontWeight: '600', color: '#FFFFFF', textAlign: 'center', lineHeight: 20 },
});
