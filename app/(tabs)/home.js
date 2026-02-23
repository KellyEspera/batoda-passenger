import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
  Modal, FlatList, SafeAreaView, ActivityIndicator, Alert,
} from 'react-native';
import { useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, ROUTES } from '../../constants/theme';

// Mock driver data — replace with Firestore real-time listener
const MOCK_DRIVERS = [
  { id: 'BT-012', name: 'Kuya Ben', status: 'available', eta: 5, rating: 4.8 },
  { id: 'BT-018', name: 'Kuya Pedro', status: 'available', eta: 8, rating: 4.6 },
  { id: 'BT-020', name: 'Kuya Mario', status: 'available', eta: 12, rating: 4.9 },
];

// Step indicator
function StepIndicator({ step }) {
  const steps = ['Book', 'Waiting', 'On the Way', 'Done'];
  const stepIndex = { home: 0, booked: 1, in_progress: 2, completed: 3 };
  const current = stepIndex[step] ?? 0;
  return (
    <View style={styles.stepRow}>
      {steps.map((s, i) => (
        <View key={s} style={styles.stepItem}>
          <View style={[styles.stepDot, i <= current && styles.stepDotActive]}>
            {i < current
              ? <Ionicons name="checkmark" size={10} color={COLORS.white} />
              : <Text style={[styles.stepNum, i <= current && styles.stepNumActive]}>{i + 1}</Text>
            }
          </View>
          <Text style={[styles.stepLabel, i <= current && styles.stepLabelActive]}>{s}</Text>
          {i < steps.length - 1 && (
            <View style={[styles.stepLine, i < current && styles.stepLineActive]} />
          )}
        </View>
      ))}
    </View>
  );
}

// Map placeholder — swap with real MapView + react-native-maps
function MapView({ status }) {
  return (
    <View style={styles.mapContainer}>
      <View style={styles.mapBg}>
        {/* Ocean */}
        <View style={[styles.mapOcean]} />
        {/* Island */}
        <View style={styles.mapIsland} />
        {/* Basco label */}
        <Text style={styles.mapLabel}>Basco</Text>
        {/* Tricycle markers */}
        {MOCK_DRIVERS.map((d, i) => (
          <View key={d.id} style={[styles.mapMarker, { top: 60 + i * 28, left: 60 + i * 30 }]}>
            <Text style={styles.mapMarkerIcon}>🛺</Text>
          </View>
        ))}
        {/* Pickup pin */}
        <View style={[styles.mapPin, { top: 80, left: 100, backgroundColor: COLORS.blue }]}>
          <Ionicons name="location" size={14} color={COLORS.white} />
        </View>
        {/* Destination pin */}
        {status !== 'home' && (
          <View style={[styles.mapPin, { top: 110, left: 60, backgroundColor: COLORS.red }]}>
            <Ionicons name="location" size={14} color={COLORS.white} />
          </View>
        )}
        {status === 'in_progress' && (
          <View style={styles.liveBadge}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>LIVE</Text>
          </View>
        )}
      </View>
      {/* TODO: Uncomment below and remove above mock map to use real maps */}
      {/*
      import MapView, { Marker } from 'react-native-maps';
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 20.4487,
          longitude: 121.9700,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {drivers.map(d => (
          <Marker key={d.id} coordinate={{ latitude: d.lat, longitude: d.lng }} title={d.name} />
        ))}
      </MapView>
      */}
    </View>
  );
}

export default function HomeScreen() {
  const [pickup, setPickup] = useState('Basco Terminal');
  const [destination, setDestination] = useState('Marlboro Hills');
  const [step, setStep] = useState('home'); // home | booked | in_progress | completed
  const [showPickup, setShowPickup] = useState(false);
  const [showDest, setShowDest] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [eta, setEta] = useState(5);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const etaTimer = useRef(null);

  useEffect(() => {
    if (step === 'in_progress') {
      setEta(selectedDriver?.eta ?? 5);
      etaTimer.current = setInterval(() => {
        setEta(prev => {
          if (prev <= 1) {
            clearInterval(etaTimer.current);
            setStep('completed');
            return 0;
          }
          return prev - 1;
        });
      }, 3000);
    }
    return () => clearInterval(etaTimer.current);
  }, [step]);

  const handleBook = () => {
    if (!selectedDriver) {
      Alert.alert('Select Tricycle', 'Please select an available tricycle first.');
      return;
    }
    setLoading(true);
    // TODO: Create trip document in Firestore
    // await addDoc(collection(db, 'trips'), { passengerId, driverId, pickup, destination, status: 'pending' });
    setTimeout(() => { setLoading(false); setStep('booked'); }, 1200);
  };

  const handleCancel = () => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel?', [
      { text: 'No', style: 'cancel' },
      {
        text: 'Yes, Cancel', style: 'destructive',
        onPress: () => { setStep('home'); setSelectedDriver(null); }
      },
    ]);
  };

  // Route selector modal
  const RouteModal = ({ visible, onClose, onSelect, title, exclude }) => (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>{title}</Text>
          <FlatList
            data={ROUTES.filter(r => r !== exclude)}
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.routeItem} onPress={() => { onSelect(item); onClose(); }}>
                <Ionicons name="location-outline" size={18} color={COLORS.blue} />
                <Text style={styles.routeItemText}>{item}</Text>
                <Ionicons name="chevron-forward" size={16} color={COLORS.gray} />
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity style={styles.modalClose} onPress={onClose}>
            <Text style={styles.modalCloseText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerGreeting}>Good morning! 👋</Text>
          <Text style={styles.headerTitle}>Passenger</Text>
        </View>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.white} />
          <View style={styles.notifBadge} />
        </TouchableOpacity>
      </View>

      {/* Step indicator */}
      <View style={styles.stepContainer}>
        <StepIndicator step={step} />
      </View>

      {/* Route inputs */}
      <View style={styles.routeCard}>
        <TouchableOpacity style={styles.routeInput} onPress={() => setShowPickup(true)}>
          <View style={[styles.routeDot, { backgroundColor: COLORS.blue }]} />
          <View style={styles.routeInputText}>
            <Text style={styles.routeInputLabel}>Pickup</Text>
            <Text style={styles.routeInputValue}>{pickup}</Text>
          </View>
          <Ionicons name="chevron-down" size={16} color={COLORS.gray} />
        </TouchableOpacity>
        <View style={styles.routeDivider} />
        <TouchableOpacity style={styles.routeInput} onPress={() => setShowDest(true)}>
          <View style={[styles.routeDot, { backgroundColor: COLORS.red }]} />
          <View style={styles.routeInputText}>
            <Text style={styles.routeInputLabel}>Destination</Text>
            <Text style={styles.routeInputValue}>{destination}</Text>
          </View>
          <Ionicons name="chevron-down" size={16} color={COLORS.gray} />
        </TouchableOpacity>
      </View>

      {/* Map */}
      <MapView status={step} />

      {/* Content area */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>

        {/* HOME: driver list + book */}
        {step === 'home' && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>🛺 Available Tricycles Nearby</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countText}>{MOCK_DRIVERS.length}</Text>
              </View>
            </View>
            {MOCK_DRIVERS.map(driver => (
              <TouchableOpacity
                key={driver.id}
                style={[styles.driverCard, selectedDriver?.id === driver.id && styles.driverCardSelected]}
                onPress={() => setSelectedDriver(driver)}
                activeOpacity={0.85}
              >
                <Text style={styles.driverIcon}>🛺</Text>
                <View style={styles.driverInfo}>
                  <Text style={styles.driverName}>{driver.name}</Text>
                  <Text style={styles.driverMeta}>Plate: {driver.id}  ·  ETA: {driver.eta} mins</Text>
                  <Text style={styles.driverRating}>⭐ {driver.rating}</Text>
                </View>
                <View style={styles.driverSelect}>
                  {selectedDriver?.id === driver.id
                    ? <Ionicons name="checkmark-circle" size={24} color={COLORS.blue} />
                    : <View style={styles.driverSelectEmpty} />
                  }
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={[styles.bookBtn, !selectedDriver && styles.bookBtnDisabled]}
              onPress={handleBook}
              disabled={!selectedDriver || loading}
              activeOpacity={0.85}
            >
              {loading
                ? <ActivityIndicator color={COLORS.white} />
                : <Text style={styles.bookBtnText}>Book Now</Text>
              }
            </TouchableOpacity>
          </>
        )}

        {/* BOOKED: upcoming trip */}
        {step === 'booked' && (
          <>
            <View style={styles.upcomingCard}>
              <Text style={styles.upcomingTitle}>Upcoming Trip</Text>
              <View style={styles.upcomingRow}>
                <Text style={styles.upcomingIcon}>🛺</Text>
                <View style={styles.upcomingInfo}>
                  <Text style={styles.upcomingDriver}>Driver: <Text style={{ fontWeight: '800' }}>{selectedDriver?.name}</Text></Text>
                  <Text style={styles.upcomingDriver}>Plate: <Text style={{ fontWeight: '800' }}>{selectedDriver?.id}</Text></Text>
                  <Text style={styles.upcomingEta}>ETA: {selectedDriver?.eta} mins</Text>
                </View>
              </View>
              <View style={styles.routeSummary}>
                <Ionicons name="navigate" size={14} color={COLORS.blue} />
                <Text style={styles.routeSummaryText}>{pickup} → {destination}</Text>
              </View>
            </View>
            <View style={styles.waitingBadge}>
              <ActivityIndicator size="small" color={COLORS.orange} style={{ marginRight: 8 }} />
              <Text style={styles.waitingText}>Waiting for driver to arrive...</Text>
            </View>
            <TouchableOpacity style={styles.startRideBtn} onPress={() => setStep('in_progress')}>
              <Ionicons name="car-sport" size={18} color={COLORS.white} />
              <Text style={styles.startRideBtnText}>Driver Arrived — Start Ride</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
              <Text style={styles.cancelBtnText}>Cancel Booking</Text>
            </TouchableOpacity>
          </>
        )}

        {/* IN PROGRESS */}
        {step === 'in_progress' && (
          <>
            <View style={styles.progressCard}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressTitle}>🛺 Trip in Progress</Text>
                <View style={styles.livePill}>
                  <View style={styles.livePillDot} />
                  <Text style={styles.livePillText}>LIVE</Text>
                </View>
              </View>
              <Text style={styles.progressDriver}>Driver: <Text style={{ fontWeight: '800' }}>{selectedDriver?.name} ({selectedDriver?.id})</Text></Text>
              <Text style={styles.progressRoute}>{pickup} → {destination}</Text>
              <View style={styles.etaRow}>
                <Text style={styles.etaLabel}>Arriving in</Text>
                <Text style={styles.etaValue}>{eta} min</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: `${((( selectedDriver?.eta ?? 5) - eta) / (selectedDriver?.eta ?? 5)) * 100}%` }]} />
              </View>
            </View>
            <View style={styles.notifCard}>
              <Ionicons name="megaphone-outline" size={16} color={COLORS.orange} />
              <Text style={styles.notifCardText}>Driver notification: On the way to {destination}</Text>
            </View>
          </>
        )}

        {/* COMPLETED */}
        {step === 'completed' && (
          <View style={styles.completedCard}>
            <Text style={styles.completedIcon}>✅</Text>
            <Text style={styles.completedTitle}>Trip Completed!</Text>
            <Text style={styles.fareLabel}>Total Fare</Text>
            <Text style={styles.fareAmount}>₱50.00</Text>
            <Text style={styles.rateLabel}>Rate your driver</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map(s => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Text style={[styles.star, s <= rating && styles.starActive]}>⭐</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.doneBtn}
              onPress={() => { setStep('home'); setSelectedDriver(null); setRating(0); setEta(5); }}
            >
              <Text style={styles.doneBtnText}>Done — Book Another Trip</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <RouteModal visible={showPickup} onClose={() => setShowPickup(false)} onSelect={setPickup} title="Select Pickup" exclude={destination} />
      <RouteModal visible={showDest} onClose={() => setShowDest(false)} onSelect={setDestination} title="Select Destination" exclude={pickup} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.white },
  header: {
    backgroundColor: COLORS.blue,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerGreeting: { color: 'rgba(255,255,255,0.75)', fontSize: 12 },
  headerTitle: { color: COLORS.white, fontSize: 20, fontWeight: '900' },
  notifBtn: { position: 'relative', padding: 4 },
  notifBadge: { position: 'absolute', top: 4, right: 4, width: 8, height: 8, borderRadius: 4, backgroundColor: COLORS.orange },
  stepContainer: { backgroundColor: COLORS.white, paddingVertical: 10, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  stepRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  stepItem: { alignItems: 'center', position: 'relative', flex: 1 },
  stepDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: COLORS.border, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  stepDotActive: { backgroundColor: COLORS.blue },
  stepNum: { fontSize: 11, fontWeight: '700', color: COLORS.gray },
  stepNumActive: { color: COLORS.white },
  stepLabel: { fontSize: 9, color: COLORS.gray, fontWeight: '600', textAlign: 'center' },
  stepLabelActive: { color: COLORS.blue },
  stepLine: { position: 'absolute', top: 11, left: '60%', right: '-40%', height: 2, backgroundColor: COLORS.border },
  stepLineActive: { backgroundColor: COLORS.blue },
  routeCard: { margin: 12, backgroundColor: COLORS.white, borderRadius: 14, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 3 },
  routeInput: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 4 },
  routeDot: { width: 12, height: 12, borderRadius: 6 },
  routeInputText: { flex: 1 },
  routeInputLabel: { fontSize: 10, color: COLORS.gray, fontWeight: '600' },
  routeInputValue: { fontSize: 13, color: COLORS.textDark, fontWeight: '700' },
  routeDivider: { height: 1, backgroundColor: COLORS.border, marginVertical: 10, marginLeft: 22 },
  mapContainer: { height: 160, marginHorizontal: 12, borderRadius: 14, overflow: 'hidden', marginBottom: 12 },
  mapBg: { flex: 1, backgroundColor: '#93C5FD', position: 'relative' },
  mapOcean: { ...StyleSheet.absoluteFillObject, backgroundColor: '#BFDBFE' },
  mapIsland: { position: 'absolute', top: 20, left: 30, right: 30, bottom: 10, backgroundColor: '#86EFAC', borderRadius: 60, opacity: 0.8 },
  mapLabel: { position: 'absolute', top: '50%', left: '45%', fontSize: 13, fontWeight: '800', color: '#1e3a5f' },
  mapMarker: { position: 'absolute' },
  mapMarkerIcon: { fontSize: 18 },
  mapPin: { position: 'absolute', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  liveBadge: { position: 'absolute', top: 8, right: 8, flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(22,163,74,0.9)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, gap: 4 },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.white },
  liveText: { color: COLORS.white, fontSize: 10, fontWeight: '800' },
  content: { flex: 1, paddingHorizontal: 12 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textDark, flex: 1 },
  countBadge: { backgroundColor: COLORS.green, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  countText: { color: COLORS.white, fontSize: 11, fontWeight: '800' },
  driverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.grayLight, borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 2, borderColor: 'transparent' },
  driverCardSelected: { borderColor: COLORS.blue, backgroundColor: '#EFF6FF' },
  driverIcon: { fontSize: 32, marginRight: 12 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 13, fontWeight: '800', color: COLORS.textDark, marginBottom: 2 },
  driverMeta: { fontSize: 11, color: COLORS.gray, marginBottom: 2 },
  driverRating: { fontSize: 11, color: COLORS.orange },
  driverSelect: { marginLeft: 8 },
  driverSelectEmpty: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: COLORS.gray },
  bookBtn: { backgroundColor: COLORS.green, borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 4, marginBottom: 20, shadowColor: COLORS.green, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  bookBtnDisabled: { backgroundColor: COLORS.gray },
  bookBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '900' },
  upcomingCard: { backgroundColor: '#EFF6FF', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#BFDBFE' },
  upcomingTitle: { fontSize: 13, fontWeight: '800', color: COLORS.textDark, marginBottom: 10 },
  upcomingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  upcomingIcon: { fontSize: 40, marginRight: 12 },
  upcomingInfo: { flex: 1 },
  upcomingDriver: { fontSize: 13, color: COLORS.textDark, marginBottom: 2 },
  upcomingEta: { fontSize: 13, color: COLORS.green, fontWeight: '700' },
  routeSummary: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: COLORS.white, borderRadius: 8, padding: 8 },
  routeSummaryText: { fontSize: 12, color: COLORS.textDark, fontWeight: '600' },
  waitingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF7ED', borderRadius: 10, padding: 12, marginBottom: 10 },
  waitingText: { fontSize: 12, color: COLORS.orange, fontWeight: '600' },
  startRideBtn: { backgroundColor: COLORS.blue, borderRadius: 14, padding: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginBottom: 10 },
  startRideBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
  cancelBtn: { backgroundColor: COLORS.red, borderRadius: 14, padding: 14, alignItems: 'center', marginBottom: 20 },
  cancelBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
  progressCard: { backgroundColor: '#F0FDF4', borderRadius: 14, padding: 14, marginBottom: 12, borderWidth: 2, borderColor: '#4ADE80' },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  progressTitle: { fontSize: 14, fontWeight: '800', color: COLORS.green },
  livePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.green, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, gap: 4 },
  livePillDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.white },
  livePillText: { color: COLORS.white, fontSize: 10, fontWeight: '800' },
  progressDriver: { fontSize: 12, color: COLORS.textDark, marginBottom: 4 },
  progressRoute: { fontSize: 12, color: COLORS.gray, marginBottom: 10 },
  etaRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  etaLabel: { fontSize: 11, color: COLORS.gray },
  etaValue: { fontSize: 11, fontWeight: '700', color: COLORS.green },
  progressBarBg: { height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: COLORS.green, borderRadius: 4 },
  notifCard: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#FFF7ED', borderRadius: 10, padding: 12, marginBottom: 20 },
  notifCardText: { fontSize: 12, color: COLORS.orange, fontWeight: '600', flex: 1 },
  completedCard: { alignItems: 'center', padding: 20 },
  completedIcon: { fontSize: 60, marginBottom: 10 },
  completedTitle: { fontSize: 22, fontWeight: '900', color: COLORS.textDark, marginBottom: 4 },
  fareLabel: { fontSize: 13, color: COLORS.gray, marginBottom: 2 },
  fareAmount: { fontSize: 42, fontWeight: '900', color: COLORS.green, marginBottom: 10 },
  rateLabel: { fontSize: 13, color: COLORS.gray, marginBottom: 8 },
  starsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  star: { fontSize: 36, opacity: 0.3 },
  starActive: { opacity: 1 },
  doneBtn: { backgroundColor: COLORS.blue, borderRadius: 14, paddingHorizontal: 30, paddingVertical: 14, marginBottom: 20 },
  doneBtnText: { color: COLORS.white, fontSize: 14, fontWeight: '800' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalSheet: { backgroundColor: COLORS.white, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20, maxHeight: '70%' },
  modalHandle: { width: 40, height: 4, backgroundColor: COLORS.border, borderRadius: 2, alignSelf: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 16, fontWeight: '800', color: COLORS.textDark, marginBottom: 12 },
  routeItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: COLORS.border, gap: 12 },
  routeItemText: { flex: 1, fontSize: 14, color: COLORS.textDark, fontWeight: '600' },
  modalClose: { marginTop: 12, backgroundColor: COLORS.grayLight, borderRadius: 12, padding: 14, alignItems: 'center' },
  modalCloseText: { color: COLORS.textDark, fontWeight: '700', fontSize: 14 },
});
