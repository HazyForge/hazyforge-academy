import { DefaultTheme, router, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import type { Href } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { academyTheme as theme } from '@/constants/academy-theme';
import { AuthProvider, useAuth } from '@/contexts/auth-context';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function useNotificationRouting() {
  useEffect(() => {
    function redirect(notification: Notifications.Notification) {
      const url = notification.request.content.data?.url;
      if (typeof url === 'string') {
        router.push(url as Href);
      }
    }

    const response = Notifications.getLastNotificationResponse();
    if (response?.notification) {
      redirect(response.notification);
    }

    const subscription = Notifications.addNotificationResponseReceivedListener((event) => {
      redirect(event.notification);
    });

    return () => subscription.remove();
  }, []);
}

function RouteGuard() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const routeRouter = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const routeSegments = [...segments] as string[];
    const inAuthGroup = routeSegments[0] === '(auth)';
    const inOAuthRedirectRoute =
      routeSegments[0] === 'auth' &&
      (routeSegments[1] === 'callback' || routeSegments[1] === 'logout');

    if (inOAuthRedirectRoute) return;

    if (!isAuthenticated && !inAuthGroup) {
      routeRouter.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      routeRouter.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, routeRouter, segments]);

  if (!isLoading) return null;

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
      }}>
      <ActivityIndicator size="large" color={theme.colors.green} />
    </View>
  );
}

function RootNavigator() {
  useNotificationRouting();

  return (
    <ThemeProvider value={DefaultTheme}>
      <RouteGuard />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="auth/callback" />
        <Stack.Screen name="auth/logout" />
      </Stack>
      <StatusBar style="dark" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootNavigator />
    </AuthProvider>
  );
}
