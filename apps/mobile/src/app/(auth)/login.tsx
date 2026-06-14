import { Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';

import { academyTheme as theme } from '@/constants/academy-theme';
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
          <Text style={styles.title}>Welcome back to class.</Text>
          <Text style={styles.copy}>
            Sign in to book sessions, check class access, and keep the next project moving.
          </Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Private Academy account</Text>
          <Text style={styles.panelCopy}>
            Your account keeps scheduling, class notes, reminders, and paid-track access in one
            place.
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
    backgroundColor: theme.colors.background,
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
    color: theme.colors.sky,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.ink,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 42,
  },
  copy: {
    color: theme.colors.inkMuted,
    fontSize: 16,
    lineHeight: 24,
  },
  panel: {
    ...theme.shadow,
    gap: 12,
    borderWidth: 1,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    backgroundColor: theme.colors.white,
    padding: 18,
  },
  panelTitle: {
    color: theme.colors.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  panelCopy: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    lineHeight: 22,
  },
  redirect: {
    color: theme.colors.sky,
    fontSize: 12,
    fontWeight: '700',
  },
  warning: {
    borderWidth: 1,
    borderColor: '#E5C783',
    borderRadius: theme.radius.panel,
    backgroundColor: theme.colors.amberSoft,
    padding: 14,
  },
  warningText: {
    color: theme.colors.amber,
    fontSize: 13,
    lineHeight: 20,
  },
  button: {
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.panel,
    backgroundColor: theme.colors.sky,
  },
  buttonDisabled: {
    opacity: 0.46,
  },
  buttonText: {
    color: theme.colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
});
