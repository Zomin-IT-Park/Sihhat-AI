import React, { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  message: string;
  type?: 'error' | 'success';
  visible: boolean;
  onHide: () => void;
}

export function Toast({ message, type = 'error', visible, onHide }: Props) {
  const slideY = useRef(new Animated.Value(-160)).current;
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (!visible) {
      slideY.setValue(-160);
      return;
    }

    slideY.setValue(-160);

    // Tepadan tushish animatsiyasi
    Animated.spring(slideY, {
      toValue: 0,
      useNativeDriver: true,
      tension: 68,
      friction: 11,
    }).start();

    // 3 sekunddan so'ng yuqoriga qaytadi
    const timer = setTimeout(() => {
      Animated.timing(slideY, {
        toValue: -160,
        duration: 320,
        useNativeDriver: true,
      }).start(() => onHide());
    }, 3000);

    return () => clearTimeout(timer);
  }, [visible, message]);

  if (!visible) return null;

  const bg = type === 'error' ? '#DC2626' : '#16A34A';

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { paddingTop: insets.top + 12, backgroundColor: bg },
        { transform: [{ translateY: slideY }] },
      ]}
    >
      <View style={styles.row}>
        <Text style={styles.icon}>{type === 'error' ? '⚠' : '✓'}</Text>
        <Text style={styles.text}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    zIndex: 9999,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 18,
    borderBottomRightRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 12,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  icon: { fontSize: 20, color: '#FFFFFF' },
  text: {
    flex: 1, fontSize: 14, color: '#FFFFFF',
    fontWeight: '600', lineHeight: 20,
  },
});
