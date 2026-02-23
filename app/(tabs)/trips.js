import {
  View, Text, StyleSheet, FlatList,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

// Mock data — replace with Firestore query:
// const q = query(collection(db, 'trips'), where('passengerId', '==', userId), orderBy('createdAt', 'desc'));
const MOCK_TRIPS = [
  { id: 'T-201', driver: 'Kuya Ben', plate: 'BT-012', pickup: 'Basco Terminal', destination: 'Marlboro Hills', fare: 50, date: 'Feb 21, 2026', time: '9:30 AM', rating: 5, status: 'completed' },
  { id: 'T-198', driver: 'Kuya Juan', plate: 'BT-010', pickup: 'Naidi Hills', destination: 'Basco Terminal', fare: 45, date: 'Feb 20, 2026', time: '3:15 PM', rating: 4, status: 'completed' },
  { id: 'T-195', driver: 'Kuya Pedro', plate: 'BT-018', pickup: 'Mahatao Port', destination: 'Ivana Arch', fare: 60, date: 'Feb 19, 2026', time: '10:00 AM', rating: 5, status: 'completed' },
  { id: 'T-190', driver: 'Kuya Mario', plate: 'BT-020', pickup: 'Valugan Boulder Beach', destination: 'Basco Terminal', fare: 55, date: 'Feb 18, 2026', time: '1:45 PM', rating: 4, status: 'completed' },
  { id: 'T-185', driver: 'Kuya Ben', plate: 'BT-012', pickup: 'Basco Terminal', destination: 'Tayid Lighthouse', fare: 70, date: 'Feb 17, 2026', time: '8:00 AM', rating: 5, status: 'cancelled' },
];

function TripCard({ trip }) {
  const isCancelled = trip.status === 'cancelled';
  return (
    <View style={[styles.card, isCancelled && styles.cardCancelled]}>
      <View style={styles.cardHeader}>
        <View style={styles.tripIdRow}>
          <Text style={styles.tripId}>{trip.id}</Text>
          <View style={[styles.statusBadge, isCancelled ? styles.statusCancelled : styles.statusCompleted]}>
            <Text style={styles.statusText}>{isCancelled ? 'Cancelled' : 'Completed'}</Text>
          </View>
        </View>
        <Text style={styles.dateTime}>{trip.date} · {trip.time}</Text>
      </View>

      <View style={styles.routeRow}>
        <View style={styles.routeCol}>
          <View style={[styles.routeDot, { backgroundColor: COLORS.blue }]} />
          <Text style={styles.routeText} numberOfLines={1}>{trip.pickup}</Text>
        </View>
        <Ionicons name="arrow-forward" size={14} color={COLORS.gray} style={{ marginHorizontal: 4 }} />
        <View style={styles.routeCol}>
          <View style={[styles.routeDot, { backgroundColor: COLORS.red }]} />
          <Text style={styles.routeText} numberOfLines={1}>{trip.destination}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.driverRow}>
          <Text style={styles.driverIcon}>🛺</Text>
          <Text style={styles.driverText}>{trip.driver} · {trip.plate}</Text>
        </View>
        <View style={styles.fareRow}>
          {!isCancelled && (
            <Text style={styles.stars}>{'⭐'.repeat(trip.rating)}</Text>
          )}
          <Text style={[styles.fare, isCancelled && styles.fareCancelled]}>
            {isCancelled ? '—' : `₱${trip.fare}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function TripsScreen() {
  const totalSpent = MOCK_TRIPS.filter(t => t.status === 'completed').reduce((acc, t) => acc + t.fare, 0);
  const totalTrips = MOCK_TRIPS.filter(t => t.status === 'completed').length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Trips</Text>
        <Ionicons name="receipt-outline" size={22} color={COLORS.white} />
      </View>

      {/* Summary row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{totalTrips}</Text>
          <Text style={styles.summaryLabel}>Total Trips</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>₱{totalSpent}</Text>
          <Text style={styles.summaryLabel}>Total Spent</Text>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>4.8 ⭐</Text>
          <Text style={styles.summaryLabel}>Avg Rating</Text>
        </View>
      </View>

      <FlatList
        data={MOCK_TRIPS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <TripCard trip={item} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.listTitle}>Trip History</Text>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  header: { backgroundColor: COLORS.blue, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '900' },
  summaryRow: { flexDirection: 'row', backgroundColor: COLORS.blue, paddingHorizontal: 12, paddingBottom: 16 },
  summaryCard: { flex: 1, alignItems: 'center' },
  summaryValue: { color: COLORS.white, fontSize: 18, fontWeight: '900' },
  summaryLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 10, fontWeight: '600', marginTop: 2 },
  summaryDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 4 },
  list: { padding: 12 },
  listTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textDark, marginBottom: 10 },
  card: { backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 2, borderLeftWidth: 4, borderLeftColor: COLORS.green },
  cardCancelled: { borderLeftColor: COLORS.gray, opacity: 0.8 },
  cardHeader: { marginBottom: 10 },
  tripIdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  tripId: { fontSize: 12, fontWeight: '800', color: COLORS.blue },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 },
  statusCompleted: { backgroundColor: '#F0FDF4' },
  statusCancelled: { backgroundColor: '#F3F4F6' },
  statusText: { fontSize: 10, fontWeight: '700', color: COLORS.gray },
  dateTime: { fontSize: 11, color: COLORS.gray },
  routeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, backgroundColor: COLORS.grayLight, borderRadius: 8, padding: 8 },
  routeCol: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 5 },
  routeDot: { width: 8, height: 8, borderRadius: 4 },
  routeText: { fontSize: 11, color: COLORS.textDark, fontWeight: '600', flex: 1 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  driverRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  driverIcon: { fontSize: 16 },
  driverText: { fontSize: 11, color: COLORS.gray },
  fareRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  stars: { fontSize: 11 },
  fare: { fontSize: 16, fontWeight: '900', color: COLORS.green },
  fareCancelled: { color: COLORS.gray },
});
