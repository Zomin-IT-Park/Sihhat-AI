import React, { useCallback, useState } from 'react';
import {
  StatusBar, StyleSheet, Text, View, FlatList, Image, RefreshControl, ActivityIndicator,
} from 'react-native';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MapPin, Clock, CheckCircle2, PackageOpen, User } from 'lucide-react-native';
import { getBookingsBySanatoryId, approveBooking, type Booking } from '../lib/bookings';
import { getSession } from '../lib/auth';

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
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [sanatoriumName, setSanatoriumName] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    isRefresh ? setRefreshing(true) : setLoading(true);
    const session = await getSession();
    if (session) {
      setSanatoriumName(session.sanatorium_name);
      const { data } = await getBookingsBySanatoryId(session.sanatory_id, session.sanatorium_name);
      setBookings(data);
    }
    isRefresh ? setRefreshing(false) : setLoading(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  async function handleApprove(id: string) {
    setApprovingId(id);
    const { error } = await approveBooking(id);
    if (!error) {
      setBookings(prev => prev.map(b => (b.id === id ? { ...b, status: 'Qabul qilindi' } : b)));
    }
    setApprovingId(null);
  }

  const pendingCount = bookings.filter((b) => b.status === 'Kutilmoqda').length;
  const approvedCount = bookings.filter((b) => b.status === 'Qabul qilindi').length;

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#075E45" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Buyurtmalarim</Text>
        {sanatoriumName ? <Text style={styles.headerSub}>{sanatoriumName}</Text> : null}

        {!loading && bookings.length > 0 ? (
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Kutilmoqda</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{approvedCount}</Text>
              <Text style={styles.statLabel}>Qabul qilindi</Text>
            </View>
          </View>
        ) : null}
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
            </View>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTopRow}>
                <Image
                  source={{ uri: item.sanatorium_image || 'https://placehold.co/200x200/1B6B3E/FFFFFF?text=+' }}
                  style={styles.cardImage}
                  resizeMode="cover"
                />
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardName} numberOfLines={1}>{item.sanatorium_name}</Text>
                  {item.region ? (
                    <View style={styles.rowGap}>
                      <MapPin size={12} color="#6B7280" strokeWidth={2} />
                      <Text style={styles.subText} numberOfLines={1}>{item.region}</Text>
                    </View>
                  ) : null}
                  <View style={styles.rowGap}>
                    <User size={12} color="#6B7280" strokeWidth={2} />
                    <Text style={styles.subText} numberOfLines={1}>
                      {item.first_name} {item.last_name}, {item.age} yosh
                    </Text>
                  </View>
                </View>
                <StatusBadge status={item.status} />
              </View>

              {item.complaint ? (
                <Text style={styles.complaintText} numberOfLines={2}>Shikoyat: {item.complaint}</Text>
              ) : null}

              <View style={styles.bottomRow}>
                {item.price ? <Text style={styles.priceText}>To'lov: {item.price}</Text> : <View />}
                {item.status === 'Kutilmoqda' ? (
                  <TouchableOpacity
                    style={styles.approveBtn}
                    disabled={approvingId === item.id}
                    onPress={() => handleApprove(item.id)}
                  >
                    {approvingId === item.id
                      ? <ActivityIndicator color="#FFFFFF" size="small" />
                      : <Text style={styles.approveBtnText}>Tasdiqlash</Text>}
                  </TouchableOpacity>
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
  header: { backgroundColor: '#075E45', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 18 },
  headerTitle: { fontSize: 19, fontWeight: '800', color: '#FFFFFF' },
  headerSub: { fontSize: 12.5, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  statsRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: 14,
    marginTop: 14, paddingVertical: 10,
  },
  statCard: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#FFFFFF' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2, fontWeight: '600' },
  statDivider: { width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.2)' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 80, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: '#374151', marginTop: 14 },
  card: {
    backgroundColor: '#FFFFFF', borderRadius: 16, marginBottom: 12, padding: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  cardTopRow: { flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginBottom: 8 },
  cardImage: { width: 56, height: 56, borderRadius: 10 },
  cardName: { fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 3 },
  rowGap: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  subText: { fontSize: 12, color: '#6B7280', flexShrink: 1 },
  complaintText: { fontSize: 12.5, color: '#374151', marginBottom: 8, lineHeight: 17 },
  bottomRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  priceText: { fontSize: 13.5, fontWeight: '700', color: '#1B6B3E' },
  approveBtn: {
    backgroundColor: GREEN, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8,
    minWidth: 96, alignItems: 'center',
  },
  approveBtnText: { fontSize: 13, fontWeight: '700', color: '#FFFFFF' },
  badge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  badgePending: { backgroundColor: '#FEF3C7' },
  badgeApproved: { backgroundColor: '#DCFCE7' },
  badgeText: { fontSize: 10.5, fontWeight: '700' },
  badgeTextPending: { color: '#92400E' },
  badgeTextApproved: { color: '#166534' },
});
