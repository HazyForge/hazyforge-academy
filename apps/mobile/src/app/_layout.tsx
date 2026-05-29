import { DarkTheme, router, ThemeProvider, type Href } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';

import AppTabs from '@/components/app-tabs';

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

export default function TabLayout() {
  useNotificationRouting();

  return (
    <ThemeProvider value={DarkTheme}>
      <AppTabs />
    </ThemeProvider>
  );
}
