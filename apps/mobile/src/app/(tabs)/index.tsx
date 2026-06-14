import * as Notifications from 'expo-notifications';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CalBookingEmbed from '@/components/cal-booking-embed';
import { academyBooking, academyClasses, classPassState } from '@/constants/academy-product';
import { academyTheme as theme } from '@/constants/academy-theme';
import { useAuth } from '@/contexts/auth-context';

const nextSteps = [
  'Choose the learner, pace, and first thing they want to build.',
  'Book a fit call without leaving the app.',
  'Turn the call into a class plan, reminders, and paid-track access.',
];

async function configureNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('academy', {
      name: 'Academy reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: theme.colors.green,
    });
  }
}

export default function ScheduleScreen() {
  const [notificationStatus, setNotificationStatus] = useState('Reminders are off for now');
  const { logout, user } = useAuth();
  const unlockedClasses = academyClasses.filter(
    (item) => !item.requiresPass || classPassState.hasActivePass,
  ).length;

  async function schedulePracticeReminder() {
    await configureNotificationChannel();
    const existing = await Notifications.getPermissionsAsync();
    const permission =
      existing.status === 'granted' ? existing : await Notifications.requestPermissionsAsync();

    if (permission.status !== 'granted') {
      setNotificationStatus('Reminders were not enabled');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hazy Forge Academy',
        body: 'Bring one thing you want to build or understand before your next session.',
        data: { url: '/(tabs)/explore' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 5,
      },
    });
    setNotificationStatus('Practice reminder scheduled');
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topbar}>
          <View>
            <Text style={styles.brand}>Hazy Forge Academy</Text>
            <Text style={styles.subbrand}>Creative technology lessons</Text>
          </View>
          <Pressable style={styles.signOutButton} onPress={logout}>
            <Text style={styles.signOutButtonText}>Sign out</Text>
          </Pressable>
        </View>

        <View style={styles.heroPanel}>
          <View style={styles.heroCopy}>
            <Text style={styles.kicker}>Schedule</Text>
            <Text style={styles.title}>Plan the next thing to build.</Text>
            <Text style={styles.lede}>
              Book time, keep class access nearby, and give each learner a clear next step.
            </Text>
          </View>
          <View style={styles.heroAccent}>
            <Text style={styles.heroAccentText}>Build</Text>
          </View>
        </View>

        <View style={styles.statusPanel}>
          <View style={styles.statusBlock}>
            <Text style={styles.statusLabel}>Signed in</Text>
            <Text style={styles.statusValue}>{user?.email || user?.name || 'Hazy Forge account'}</Text>
          </View>
          <View style={styles.statusBlock}>
            <Text style={styles.statusLabel}>Class access</Text>
            <Text style={styles.statusValue}>{classPassState.label}</Text>
          </View>
          <View style={styles.statusBlock}>
            <Text style={styles.statusLabel}>Tracks open</Text>
            <Text style={styles.statusValue}>
              {unlockedClasses} of {academyClasses.length}
            </Text>
          </View>
        </View>

        <View style={styles.actionCard}>
          <View style={styles.actionCopy}>
            <Text style={styles.cardTitle}>Book a 1:1 fit call</Text>
            <Text style={styles.cardText}>
              Cal handles the booking details. The Academy app keeps the plan, reminders, and class
              context together.
            </Text>
          </View>
          <View style={styles.actions}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => WebBrowser.openBrowserAsync(academyBooking.baseUrl)}>
              <Text style={styles.primaryButtonText}>Open full calendar</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={schedulePracticeReminder}>
              <Text style={styles.secondaryButtonText}>Try reminder</Text>
            </Pressable>
          </View>
          <Text style={styles.notificationText}>{notificationStatus}</Text>
        </View>

        <View style={styles.embedShell}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelEyebrow}>Booking</Text>
              <Text style={styles.panelTitle}>Pick a time that works</Text>
            </View>
            <Text style={styles.panelMeta}>{academyBooking.duration}</Text>
          </View>
          <View style={styles.embedFrame}>
            <CalBookingEmbed
              title="Hazy Forge Academy booking"
              url={academyBooking.embedUrl}
              dom={{
                scrollEnabled: true,
                allowsInlineMediaPlayback: true,
              }}
            />
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelEyebrow}>First session</Text>
              <Text style={styles.panelTitle}>A simple start path</Text>
            </View>
            <Text style={styles.panelMeta}>intake</Text>
          </View>
          {nextSteps.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{index + 1}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: 120,
  },
  safeArea: {
    gap: 16,
    paddingHorizontal: 18,
  },
  topbar: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 14,
    justifyContent: 'space-between',
    paddingTop: 24,
  },
  brand: {
    color: theme.colors.ink,
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
  },
  subbrand: {
    color: theme.colors.green,
    fontSize: 13,
    fontWeight: '800',
    marginTop: 2,
  },
  signOutButton: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 12,
  },
  signOutButtonText: {
    color: theme.colors.ink,
    fontSize: 12,
    fontWeight: '900',
  },
  heroPanel: {
    ...theme.shadow,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 16,
    overflow: 'hidden',
    padding: 18,
  },
  heroCopy: {
    flex: 1,
    gap: 10,
  },
  heroAccent: {
    alignItems: 'center',
    alignSelf: 'stretch',
    backgroundColor: theme.colors.greenSoft,
    borderColor: '#C9E6C2',
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 74,
  },
  heroAccentText: {
    color: theme.colors.greenDeep,
    fontSize: 14,
    fontWeight: '900',
  },
  kicker: {
    color: theme.colors.amber,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  title: {
    color: theme.colors.ink,
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 38,
  },
  lede: {
    color: theme.colors.inkMuted,
    fontSize: 15,
    lineHeight: 23,
  },
  statusPanel: {
    flexDirection: 'row',
    gap: 10,
  },
  statusBlock: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    flex: 1,
    gap: 6,
    minHeight: 82,
    padding: 12,
  },
  statusLabel: {
    color: theme.colors.inkFaint,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusValue: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 17,
  },
  actionCard: {
    backgroundColor: theme.colors.greenSoft,
    borderColor: '#C9E6C2',
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  actionCopy: {
    gap: 6,
  },
  cardTitle: {
    color: theme.colors.ink,
    fontSize: 19,
    fontWeight: '900',
  },
  cardText: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: theme.colors.green,
    borderRadius: theme.radius.panel,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontSize: 13,
    fontWeight: '900',
  },
  secondaryButton: {
    backgroundColor: theme.colors.white,
    borderColor: '#BCD8B7',
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: theme.colors.greenDeep,
    fontSize: 13,
    fontWeight: '900',
  },
  notificationText: {
    color: theme.colors.inkMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  embedShell: {
    ...theme.shadow,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    gap: 14,
    overflow: 'hidden',
    padding: 14,
  },
  panel: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    gap: 14,
    padding: 16,
  },
  panelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  panelEyebrow: {
    color: theme.colors.sky,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
  },
  panelMeta: {
    color: theme.colors.amber,
    fontSize: 12,
    fontWeight: '900',
  },
  embedFrame: {
    backgroundColor: theme.colors.backgroundSoft,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    height: 580,
    overflow: 'hidden',
  },
  stepRow: {
    alignItems: 'flex-start',
    borderTopColor: theme.colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 14,
    paddingTop: 14,
  },
  stepNumber: {
    backgroundColor: theme.colors.amberSoft,
    borderRadius: theme.radius.pill,
    color: theme.colors.amber,
    fontSize: 13,
    fontWeight: '900',
    minWidth: 28,
    paddingVertical: 5,
    textAlign: 'center',
  },
  stepText: {
    color: theme.colors.inkMuted,
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
});
