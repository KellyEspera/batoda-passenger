# BATODA Passenger App 🛺

Expo React Native app for passengers to book tricycles in Basco, Batanes.

## Quick Start in VS Code

```bash
# 1. Install dependencies
npm install

# 2. Start the app
npx expo start
```

Then press:
- `a` → Android emulator
- `i` → iOS simulator  
- Scan QR code → Expo Go on your phone

## Project Structure

```
batoda-passenger/
├── app/
│   ├── _layout.js          ← Root layout (navigation setup)
│   ├── index.js            ← Login screen
│   └── (tabs)/
│       ├── _layout.js      ← Tab bar setup
│       ├── home.js         ← 🏠 Main booking screen + map
│       ├── trips.js        ← 📋 Trip history
│       └── alerts.js       ← 🔔 Notifications
├── constants/
│   ├── theme.js            ← Colors, font sizes, route list
│   └── firebase.js         ← Firebase config (fill in your keys)
└── package.json
```

## Screens

| Screen | File | Description |
|--------|------|-------------|
| Login | `app/index.js` | Phone + password login |
| Home | `app/(tabs)/home.js` | Map, pickup/destination, Book Now |
| My Trips | `app/(tabs)/trips.js` | Trip history with fares |
| Alerts | `app/(tabs)/alerts.js` | Notifications from BATODA |

## Booking Flow

```
Login → Home → Select pickup & destination
     → Choose available tricycle
     → Book Now → Waiting for driver
     → Driver arrived → Trip in progress (live ETA)
     → Trip completed → Rate driver → Done
```

## Firebase Setup

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Create project `batoda-app`
3. Enable **Authentication** → Email/Password
4. Create **Firestore Database**
5. Add your config to `constants/firebase.js`

### Firestore Collections

```
users/
  {userId}/
    name: string
    phone: string
    role: "passenger"

trips/
  {tripId}/
    passengerId: string
    driverId: string
    pickup: string
    destination: string
    fare: number
    status: "pending" | "in_progress" | "completed" | "cancelled"
    createdAt: timestamp

drivers/
  {driverId}/
    name: string
    plate: string
    status: "available" | "in_transit" | "offline"
    shift: "on_shift" | "off_shift"
    location: GeoPoint

announcements/
  {announcementId}/
    text: string
    createdAt: timestamp
```

## Real Maps Setup

In `app/(tabs)/home.js`, look for the `MapView` component.
Replace the mock map with real `react-native-maps`:

```bash
npx expo install react-native-maps
```

Then uncomment the real MapView code in home.js.

## Dependencies

- `expo` ~51.0.0
- `expo-router` ~3.5.0 (file-based routing)
- `react-native-maps` (for live GPS map)
- `expo-location` (get passenger location)
- `expo-notifications` (push alerts)
- `firebase` ^10 (auth + database)
- `@expo/vector-icons` (Ionicons)
