import {
  View, Text, StyleSheet, FlatList,
  SafeAreaView, TouchableOpacity,
} from 'react-native';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/theme';

const MOCK_ALERTS = [
  { id: '1', type: 'trip', icon: '🛺', title: 'Tricycle Arrived!', message: 'Your tricycle BT-012 (Kuya Ben) has arrived at Basco Terminal.', time: '2 mins ago', read: false },
  { id: '2', type: 'announce', icon: '📢', title: 'BATODA Announcement', message: 'New route to Tayid Lighthouse now available. Fare: ₱70.', time: '1 hour ago', read: false },
  { id: '3', type: 'success', icon: '✅', title: 'Trip Completed', message: 'Your trip to Marlboro Hills is complete. Rate your driver Kuya Ben!', time: 'Yesterday', read: true },
  { id: '4', type: 'promo', icon: '🎉', title: 'Special Offer', message: 'Free ride on your 10th trip! You have 7 trips so far.', time: '2 days ago', read: true },
  { id: '5', type: 'announce', icon: '📢', title: 'BATODA Announcement', message: 'Fare increase notice: ₱5 added to all routes starting March 1, 2026.', time: '3 days ago', read: true },
];

const ICON_COLORS = {
  trip: COLORS.blue,
  announce: COLORS.orange,
  success: COLORS.green,
  promo: '#7C3AED',
};

function AlertItem({ alert, onRead }) {
  return (
    <TouchableOpacity
      style={[styles.alertCard, !alert.read && styles.alertCardUnread]}
      onPress={() => onRead(alert.id)}
      activeOpacity={0.85}
    >
      <View style={[styles.alertIcon, { backgroundColor: ICON_COLORS[alert.type] + '20' }]}>
        <Text style={styles.alertIconText}>{alert.icon}</Text>
      </View>
      <View style={styles.alertContent}>
        <View style={styles.alertTitleRow}>
          <Text style={styles.alertTitle}>{alert.title}</Text>
          {!alert.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.alertMessage} numberOfLines={2}>{alert.message}</Text>
        <Text style={styles.alertTime}>{alert.time}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default function AlertsScreen() {
  const [alerts, setAlerts] = useState(MOCK_ALERTS);

  const markRead = (id) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Alerts</Text>
        <View style={styles.headerRight}>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead} style={styles.markAllBtn}>
              <Text style={styles.markAllText}>Mark all read</Text>
            </TouchableOpacity>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
        </View>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <AlertItem alert={item} onRead={markRead} />}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text style={styles.listHeader}>
            {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All caught up! 🎉'}
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔔</Text>
            <Text style={styles.emptyText}>No alerts yet</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  header: { backgroundColor: COLORS.blue, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '900' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  markAllBtn: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  markAllText: { color: COLORS.white, fontSize: 11, fontWeight: '700' },
  badge: { backgroundColor: COLORS.orange, borderRadius: 10, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: COLORS.white, fontSize: 11, fontWeight: '800' },
  list: { padding: 12 },
  listHeader: { fontSize: 12, color: COLORS.gray, fontWeight: '600', marginBottom: 10 },
  alertCard: { flexDirection: 'row', gap: 12, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1, borderWidth: 1, borderColor: COLORS.border },
  alertCardUnread: { backgroundColor: '#F8FAFF', borderColor: '#BFDBFE' },
  alertIcon: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  alertIconText: { fontSize: 22 },
  alertContent: { flex: 1 },
  alertTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  alertTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textDark, flex: 1 },
  unreadDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.blue },
  alertMessage: { fontSize: 12, color: COLORS.gray, lineHeight: 17, marginBottom: 6 },
  alertTime: { fontSize: 10, color: COLORS.gray, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 10 },
  emptyText: { fontSize: 16, color: COLORS.gray, fontWeight: '600' },
});
