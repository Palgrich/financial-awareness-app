import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParamList } from '../navigation/types';
import { useAuthStore } from '../state/authStore';
import { registerUser } from '../api/auth';
import { colors } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';

type Nav = NativeStackNavigationProp<AuthStackParamList, 'Register'>;

export function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<Nav>();
  const { colors: themeColors } = useTheme();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setError(null);
    const trimmedEmail = email.trim();
    if (!trimmedEmail || !password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await registerUser({
        email: trimmedEmail,
        password,
        name: name.trim() || undefined,
      });
      setAuth(token, { id: user.id, email: user.email, name: user.name ?? null });
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? String((err as Error).message)
          : 'Registration failed. Try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: themeColors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 60, paddingBottom: insets.bottom + 24 }]}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Text style={[styles.title, { color: themeColors.textPrimary }]}>Create account</Text>
          <Text style={[styles.subtitle, { color: themeColors.textMuted }]}>Name, email and password</Text>

          <TextInput
            style={[styles.input, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, color: themeColors.textPrimary }]}
            placeholder="Name (optional)"
            placeholderTextColor={themeColors.textMuted}
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            editable={!loading}
          />
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, color: themeColors.textPrimary }]}
            placeholder="Email"
            placeholderTextColor={themeColors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
            editable={!loading}
          />
          <TextInput
            style={[styles.input, { backgroundColor: themeColors.cardBackground, borderColor: themeColors.borderColor, color: themeColors.textPrimary }]}
            placeholder="Password"
            placeholderTextColor={themeColors.textMuted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Sign up</Text>
            )}
          </Pressable>

          <Pressable style={styles.linkWrap} onPress={() => navigation.navigate('Login')}>
            <Text style={[styles.linkHint, { color: themeColors.textMuted }]}>Already have an account? </Text>
            <Text style={styles.link}>Log in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  content: {
    maxWidth: 400,
    width: '100%',
    alignSelf: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 15,
    color: colors.text.muted,
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(15, 23, 42, 0.12)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text.primary,
    marginBottom: 12,
  },
  error: {
    fontSize: 14,
    color: '#EF4444',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#5B4FE8',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.7 },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  linkWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  linkHint: {
    fontSize: 14,
    color: colors.text.muted,
  },
  link: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent.primary,
  },
});
