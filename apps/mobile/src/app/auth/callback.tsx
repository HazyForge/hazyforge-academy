import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { academyTheme as theme } from '@/constants/academy-theme';
import { useAuth } from '@/contexts/auth-context';

export default function AuthCallbackScreen() {
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const timeout = setTimeout(() => {
      router.replace(isAuthenticated ? '/(tabs)' : '/(auth)/login');
    }, isAuthenticated ? 0 : 1500);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, isLoading]);

  return (
    <View style={styles.screen}>
      <ActivityIndicator size="large" color={theme.colors.green} />
      <Text style={styles.text}>Completing sign in</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    backgroundColor: theme.colors.background,
  },
  text: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    fontWeight: '700',
  },
});
