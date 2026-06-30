import React from 'react';
import { View } from 'react-native';

export function StatusSignal({ light }: { light?: boolean }) {
  const c = light ? '#FFFFFF' : '#1C1C1E';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 2, height: 13 }}>
      {[4, 7, 10, 13].map((h, i) => (
        <View key={i} style={{ width: 3, height: h, backgroundColor: c, borderRadius: 1 }} />
      ))}
    </View>
  );
}

export function StatusWifi({ light }: { light?: boolean }) {
  const c = light ? '#FFFFFF' : '#1C1C1E';
  return (
    <View style={{ width: 16, height: 12, alignItems: 'center', justifyContent: 'flex-end' }}>
      <View style={{
        width: 14, height: 7, borderWidth: 2, borderColor: c,
        borderTopLeftRadius: 9, borderTopRightRadius: 9, borderBottomWidth: 0,
      }} />
    </View>
  );
}

export function StatusBattery({ light }: { light?: boolean }) {
  const c = light ? '#FFFFFF' : '#1C1C1E';
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ width: 22, height: 11, borderWidth: 1.5, borderColor: c, borderRadius: 3, padding: 2 }}>
        <View style={{ flex: 1, backgroundColor: c, borderRadius: 1.5 }} />
      </View>
      <View style={{ width: 2, height: 5, backgroundColor: c, borderRadius: 1, marginLeft: 1 }} />
    </View>
  );
}
