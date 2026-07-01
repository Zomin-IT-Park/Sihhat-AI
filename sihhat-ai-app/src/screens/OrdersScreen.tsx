import React, { useCallback, useState } from 'react';
import {
  StatusBar, StyleSheet, Text, View, FlatList, Image, RefreshControl, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MapPin, Clock, CheckCircle2, PackageOpen } from 'lucide-react-native';
import { getSession } from '../../lib/auth';
import { getUserBookings, type Booking } from '../../lib/bookings';
import { getSanatoriumImage } from '../../lib/images';

const GREEN = '#1B6B3E';

function StatusBadge({ status }: { status: Booking['status'] }) {
  const isApproved = status === 'Qabul qilindi';
  return (
    <View style={[styles.badge, isApproved ? styles.badgeApproved : styles.badgePending]}>
      {isApproved
        ? <CheckCircle2 size={13} color="#166534" strokeWidth={2.4} />
        : <Clock size={13} color="#92400E" strokeWidth={2.4} />}
      <Text style={[styles.badgeText, isApproved ? styles.badgeTextApproved : styles.badgeTextPending]}>
        {status}
      </Text>
    </View>
  );
}

export default function OrdersScreen() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    const session = await getSession();
    if (session) {
      const { data } = await getUserBookings(session.username);
      setBookings(data);
    }
    isRefresh ? setRefreshing(false) : setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#075E45" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buyurtmalarim</Text>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={GREEN} size="large" />
        </View>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={item => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 110, flexGrow: 1 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => load(true)} tintColor={GREEN} />}
          ListEmptyComponent={
            <View style={styles.center}>
              <PackageOpen size={44} color="#9CA3AF" strokeWidth={1.5} />
              <Text style={styles.emptyTitle}>Hozircha buyurtma yo'q</Text>
              <Text style={styles.emptySub}>Sanatoriya bron qilsangiz, u shu yerda ko'rinadi</Text>
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Image
                source={{ uri: item.sanatorium_image || getSanatoriumImage(item.sanatorium_name) }}
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardName} numberOfLines={1}>{item.sanatorium_name}</Text>
                  <StatusBadge status={item.status} />
                </View>
                {item.region ? (
                  <View style={styles.regionRow}>
                    <MapPin size={13} color="#6B7280" strokeWidth={2} />
                    <Text style={styles.regionText} numberOfLines={1}>{item.region}</Text>
                  </View>
                ) : null}
                {item.price ? (
                  <Text style={styles.priceText}>To'lov: {item.price}</Text>
                ) : null}
              </View>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F6F4' },
  header: { backgroundColor: '#075E45', paddingHorizontal: 20, paddingVertical: 16 },
  headerTitle: { fontSize: 19, fontWeight: '800', color: '#FFFFFF' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginTop: 14 },
  emptySub: { fontSize: 13, color: '#9CA3AF', marginTop: 6, textAlign: 'center', lineHeight: 18 },
  card: {
    flexDirection: 'row', backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 12,
    padding: 10, gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardImage: { width: 84, height: 84, borderRadius: 12 },
  cardBody: { flex: 1, justifyContent: 'center' },
  cardTopRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 6 },
  cardName: { fontSize: 15.5, fontWeight: '700', color: '#111827', flexShrink: 1 },
  regionRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  regionText: { fontSize: 12.5, color: '#6B7280', flexShrink: 1 },
  priceText: { fontSize: 13.5, fontWeight: '700', color: '#1B6B3E' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  badgePending: { backgroundColor: '#FEF3C7' },
  badgeApproved: { backgroundColor: '#DCFCE7' },
  badgeText: { fontSize: 11, fontWeight: '700' },
  badgeTextPending: { color: '#92400E' },
  badgeTextApproved: { color: '#166534' },
});
