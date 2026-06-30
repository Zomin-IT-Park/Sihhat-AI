import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Activity, Droplets, Moon } from 'lucide-react-native';

const HEALTH_DATA = [
  { id: '1', title: 'Yurak urishi', value: '72', unit: 'bpm', icon: Heart, color: '#FF3B30' },
  { id: '2', title: 'Faollik', value: '8,432', unit: 'qadam', icon: Activity, color: '#34C759' },
  { id: '3', title: 'Suv', value: '6', unit: 'stakan', icon: Droplets, color: '#007AFF' },
  { id: '4', title: 'Uyqu', value: '7.5', unit: 'soat', icon: Moon, color: '#5856D6' },
];

export default function HealthScreen() {
  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Salomatlik</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <Text style={styles.greeting}>Xayrli kun! 👋</Text>
        <Text style={styles.subtitle}>Bugungi salomatlik ko'rsatkichlaringiz</Text>
        
        {HEALTH_DATA.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={[styles.iconContainer, { backgroundColor: item.color + '20' }]}>
              <item.icon size={24} color={item.color} />
            </View>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <View style={styles.valueRow}>
                <Text style={styles.cardValue}>{item.value}</Text>
                <Text style={styles.cardUnit}>{item.unit}</Text>
              </View>
            </View>
          </View>
        ))}
        
        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>💡 Maslahat</Text>
          <Text style={styles.tipText}>
            Har kuni kamida 8 stakan suv ichishni unutmang. Suv tanqisligi ko'pchilik muammolarning sababidir.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C1C1E',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 24,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  cardValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
  },
  cardUnit: {
    fontSize: 14,
    color: '#8E8E93',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#3A3A3C',
    lineHeight: 20,
  },
});
