import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator,
  KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../constants/firebase';

const { width, height } = Dimensions.get('window');

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);

  const handleLogin = async () => {
    if (!phone.trim()) return Alert.alert('Error', 'Please enter your phone number.');
    if (!password.trim()) return Alert.alert('Error', 'Please enter your password.');
    setLoading(true);
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, phone + '@batoda.ph', password);
      } else {
        await signInWithEmailAndPassword(auth, phone + '@batoda.ph', password);
      }
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Login Failed', 'Wrong number or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* Sky gradient background */}
      <View style={styles.background}>
        {/* Soft cloud blobs */}
        <View style={[styles.blob, { top: -60, left: -80, width: 300, height: 300, backgroundColor: 'rgba(255,255,255,0.25)' }]} />
        <View style={[styles.blob, { top: 100, right: -100, width: 260, height: 260, backgroundColor: 'rgba(255,255,255,0.15)' }]} />
        <View style={[styles.blob, { bottom: 80, left: -60, width: 200, height: 200, backgroundColor: 'rgba(255,255,255,0.2)' }]} />
        <View style={[styles.blob, { bottom: -40, right: -40, width: 220, height: 220, backgroundColor: 'rgba(255,255,255,0.12)' }]} />
      </View>

      <View style={styles.centerWrapper}>
        {/* Logo */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🛺</Text>
          </View>
          <Text style={styles.logoTitle}>BATODA</Text>
          <Text style={styles.logoSub}>Basco, Batanes</Text>
        </View>

        {/* Glass card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {isRegister ? 'Create Account' : 'Sign in'}
          </Text>
          <Text style={styles.cardSubtitle}>
            {isRegister
              ? 'Join BATODA and book tricycles easily.'
              : 'Book tricycles around Basco, Batanes.'}
          </Text>

          {isRegister && (
            <View style={[styles.inputBox, focusedInput === 'name' && styles.inputBoxFocused]}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="rgba(100,120,150,0.6)"
                value={name}
                onChangeText={setName}
                onFocus={() => setFocusedInput('name')}
                onBlur={() => setFocusedInput(null)}
              />
            </View>
          )}

          <View style={[styles.inputBox, focusedInput === 'phone' && styles.inputBoxFocused]}>
            <Text style={styles.inputIcon}>📱</Text>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="rgba(100,120,150,0.6)"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              onFocus={() => setFocusedInput('phone')}
              onBlur={() => setFocusedInput(null)}
            />
          </View>

          <View style={[styles.inputBox, focusedInput === 'pass' && styles.inputBoxFocused]}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password"
              placeholderTextColor="rgba(100,120,150,0.6)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              onFocus={() => setFocusedInput('pass')}
              onBlur={() => setFocusedInput(null)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>

          {!isRegister && (
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.88}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.loginBtnText}>
                  {isRegister ? 'Create Account' : 'Get Started'}
                </Text>
            }
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or sign in with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social buttons (UI only) */}
          <View style={styles.socialRow}>
            {['G', 'f', ''].map((s, i) => (
              <TouchableOpacity key={i} style={styles.socialBtn} activeOpacity={0.8}>
                <Text style={styles.socialIcon}>{['🌐', '📘', '🍎'][i]}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity onPress={() => setIsRegister(!isRegister)} style={styles.switchBtn}>
            <Text style={styles.switchText}>
              {isRegister ? 'Already have an account? ' : "Don't have an account? "}
              <Text style={styles.switchTextBold}>
                {isRegister ? 'Sign In' : 'Register'}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#c8dcf0',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#c8dcf0',
    // Sky blue gradient simulation with layered views
    background: 'linear-gradient(180deg, #a8c8e8 0%, #d4e8f8 50%, #e8f4ff 100%)',
  },
  blob: {
    position: 'absolute',
    borderRadius: 999,
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#4a90d9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 32,
  },
  logoTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#1a3a5c',
    letterSpacing: 4,
  },
  logoSub: {
    fontSize: 12,
    color: 'rgba(30,60,100,0.6)',
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 1,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'rgba(255,255,255,0.72)',
    borderRadius: 24,
    padding: 28,
    shadowColor: '#4a90d9',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.15,
    shadowRadius: 40,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.9)',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1a3a5c',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: 'rgba(30,60,100,0.55)',
    marginBottom: 24,
    lineHeight: 18,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(240,247,255,0.8)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 2,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: 'rgba(200,220,240,0.8)',
  },
  inputBoxFocused: {
    borderColor: '#4a90d9',
    backgroundColor: 'rgba(255,255,255,0.95)',
    shadowColor: '#4a90d9',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 10,
    opacity: 0.7,
  },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: '#1a3a5c',
    fontWeight: '500',
  },
  eyeBtn: {
    padding: 4,
  },
  eyeIcon: {
    fontSize: 16,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 12,
    color: '#4a90d9',
    fontWeight: '600',
  },
  loginBtn: {
    backgroundColor: '#1a3a5c',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#1a3a5c',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  loginBtnDisabled: {
    opacity: 0.7,
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(100,140,180,0.2)',
  },
  dividerText: {
    fontSize: 11,
    color: 'rgba(30,60,100,0.4)',
    fontWeight: '600',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  socialBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(240,247,255,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(200,220,240,0.8)',
  },
  socialIcon: {
    fontSize: 20,
  },
  switchBtn: {
    alignItems: 'center',
  },
  switchText: {
    fontSize: 13,
    color: 'rgba(30,60,100,0.55)',
  },
  switchTextBold: {
    color: '#4a90d9',
    fontWeight: '800',
  },
});
