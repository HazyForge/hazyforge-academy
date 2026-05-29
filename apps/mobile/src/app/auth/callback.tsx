import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

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
      <ActivityIndicator size="large" color="#3FCF8F" />
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
    backgroundColor: '#02070B',
  },
  text: {
    color: 'rgba(233, 253, 255, 0.72)',
    fontSize: 14,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
