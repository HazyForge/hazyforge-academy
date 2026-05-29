import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/contexts/auth-context';
import { AUTH_IS_CONFIGURED, REDIRECT_URI } from '@/services/auth';

export default function LoginScreen() {
  const { isLoading, login } = useAuth();
  const disabled = isLoading || !AUTH_IS_CONFIGURED;

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Hazy Forge Academy</Text>
          <Text style={styles.title}>Sign in with Hazy Forge</Text>
          <Text style={styles.copy}>
            Use your Hazy Forge account to manage Academy scheduling, classes, and reminders.
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Native OIDC</Text>
          <Text style={styles.panelCopy}>
            This app uses authorization code flow with PKCE and stores tokens in secure device
            storage on iOS and Android.
          </Text>
          <Text style={styles.redirect}>{REDIRECT_URI}</Text>
        </View>

        {!AUTH_IS_CONFIGURED && (
          <View style={styles.warning}>
            <Text style={styles.warningText}>
              Configure EXPO_PUBLIC_ZITADEL_CLIENT_ID for the Academy native OIDC client before
              production login.
            </Text>
          </View>
        )}

        <Pressable
          disabled={disabled}
          style={[styles.button, disabled && styles.buttonDisabled]}
          onPress={login}>
          <Text style={styles.buttonText}>{isLoading ? 'Loading' : 'Sign in'}</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#02070B',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    gap: 18,
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 30,
  },
  header: {
    gap: 14,
  },
  kicker: {
    color: '#3FCF8F',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#E9FDFF',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 42,
    textTransform: 'uppercase',
  },
  copy: {
    color: 'rgba(233, 253, 255, 0.72)',
    fontSize: 16,
    lineHeight: 24,
  },
  panel: {
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(233, 253, 255, 0.12)',
    borderRadius: 8,
    backgroundColor: 'rgba(6, 19, 22, 0.88)',
    padding: 18,
  },
  panelTitle: {
    color: '#E9FDFF',
    fontSize: 17,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  panelCopy: {
    color: 'rgba(233, 253, 255, 0.72)',
    fontSize: 14,
    lineHeight: 22,
  },
  redirect: {
    color: '#50D8FA',
    fontSize: 12,
    fontWeight: '700',
  },
  warning: {
    borderWidth: 1,
    borderColor: 'rgba(243, 185, 95, 0.28)',
    borderRadius: 8,
    backgroundColor: 'rgba(243, 185, 95, 0.1)',
    padding: 14,
  },
  warningText: {
    color: '#F3B95F',
    fontSize: 13,
    lineHeight: 20,
  },
  button: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#3FCF8F',
  },
  buttonDisabled: {
    opacity: 0.46,
  },
  buttonText: {
    color: '#02100C',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
