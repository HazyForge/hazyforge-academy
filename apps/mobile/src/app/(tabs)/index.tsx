import * as Notifications from 'expo-notifications';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import CalBookingEmbed from '@/components/cal-booking-embed';
import { academyBooking, academyClasses, classPassState } from '@/constants/academy-product';
import { useAuth } from '@/contexts/auth-context';

const nextSteps = [
  'Pick the student, class format, and first practical goal.',
  'Book the fit call inside the app.',
  'Use class pass access for paid tracks and follow-up notes.',
];

async function configureNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('academy', {
      name: 'Academy reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3FCF8F',
    });
  }
}

export default function ScheduleScreen() {
  const [notificationStatus, setNotificationStatus] = useState('Not enabled yet');
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
      setNotificationStatus('Notifications denied');
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
            <Text style={styles.subbrand}>student console</Text>
          </View>
          <Pressable style={styles.signOutButton} onPress={logout}>
            <Text style={styles.signOutButtonText}>Sign out</Text>
          </Pressable>
        </View>

        <View style={styles.statusPanel}>
          <View style={styles.statusBlock}>
            <Text style={styles.statusLabel}>Signed in</Text>
            <Text style={styles.statusValue}>{user?.email || user?.name || 'Hazy Forge account'}</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusBlock}>
            <Text style={styles.statusLabel}>Class access</Text>
            <Text style={styles.statusValue}>{classPassState.label}</Text>
          </View>
          <View style={styles.statusDivider} />
          <View style={styles.statusBlock}>
            <Text style={styles.statusLabel}>Unlocked</Text>
            <Text style={styles.statusValue}>
              {unlockedClasses}/{academyClasses.length} tracks
            </Text>
          </View>
        </View>

        <View style={styles.heroPanel}>
          <Text style={styles.kicker}>Schedule</Text>
          <Text style={styles.title}>Book the next Academy session inside the app.</Text>
          <Text style={styles.lede}>
            Cal stays the scheduling system of record. This screen keeps the booking flow in the
            subscribed app so the class plan, pass state, and reminders stay together.
          </Text>
          <View style={styles.actions}>
            <Pressable
              style={styles.primaryButton}
              onPress={() => WebBrowser.openBrowserAsync(academyBooking.baseUrl)}>
              <Text style={styles.primaryButtonText}>Open full Cal</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={schedulePracticeReminder}>
              <Text style={styles.secondaryButtonText}>Test reminder</Text>
            </Pressable>
          </View>
          <Text style={styles.notificationText}>{notificationStatus}</Text>
        </View>

        <View style={styles.embedShell}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelEyebrow}>Booker</Text>
              <Text style={styles.panelTitle}>Cal.diy embed</Text>
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
              <Text style={styles.panelEyebrow}>Class flow</Text>
              <Text style={styles.panelTitle}>First session path</Text>
            </View>
            <Text style={styles.panelMeta}>intake</Text>
          </View>
          {nextSteps.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</Text>
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
    backgroundColor: '#02070B',
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
    paddingTop: 26,
  },
  brand: {
    color: '#E9FDFF',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  subbrand: {
    color: '#3FCF8F',
    fontSize: 11,
    fontWeight: '900',
    marginTop: 2,
    textTransform: 'uppercase',
  },
  signOutButton: {
    borderColor: 'rgba(233, 253, 255, 0.18)',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 40,
    paddingHorizontal: 12,
  },
  signOutButtonText: {
    color: '#E9FDFF',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusPanel: {
    backgroundColor: 'rgba(6, 19, 22, 0.94)',
    borderColor: 'rgba(63, 207, 143, 0.26)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 14,
  },
  statusBlock: {
    flex: 1,
    gap: 5,
  },
  statusDivider: {
    backgroundColor: 'rgba(233, 253, 255, 0.1)',
    marginHorizontal: 10,
    width: 1,
  },
  statusLabel: {
    color: '#50D8FA',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusValue: {
    color: '#E9FDFF',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 16,
  },
  heroPanel: {
    backgroundColor: 'rgba(63, 207, 143, 0.08)',
    borderColor: 'rgba(63, 207, 143, 0.22)',
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    padding: 18,
  },
  kicker: {
    color: '#3FCF8F',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#E9FDFF',
    fontSize: 33,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 35,
    textTransform: 'uppercase',
  },
  lede: {
    color: 'rgba(233, 253, 255, 0.72)',
    fontSize: 15,
    lineHeight: 23,
  },
  actions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#3FCF8F',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 16,
  },
  primaryButtonText: {
    color: '#02100C',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  secondaryButton: {
    borderColor: 'rgba(233, 253, 255, 0.18)',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: '#E9FDFF',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  notificationText: {
    color: 'rgba(233, 253, 255, 0.65)',
    fontSize: 12,
    fontWeight: '700',
  },
  embedShell: {
    backgroundColor: 'rgba(6, 19, 22, 0.94)',
    borderColor: 'rgba(233, 253, 255, 0.13)',
    borderRadius: 8,
    borderWidth: 1,
    gap: 14,
    overflow: 'hidden',
    padding: 14,
  },
  panel: {
    backgroundColor: 'rgba(6, 19, 22, 0.92)',
    borderColor: 'rgba(233, 253, 255, 0.12)',
    borderRadius: 8,
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
    color: '#50D8FA',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  panelTitle: {
    color: '#E9FDFF',
    fontSize: 17,
    fontWeight: '900',
    marginTop: 3,
    textTransform: 'uppercase',
  },
  panelMeta: {
    color: '#F3B95F',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  embedFrame: {
    backgroundColor: '#02070B',
    borderColor: 'rgba(63, 207, 143, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    height: 580,
    overflow: 'hidden',
  },
  stepRow: {
    alignItems: 'flex-start',
    borderTopColor: 'rgba(233, 253, 255, 0.08)',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 14,
    paddingTop: 14,
  },
  stepNumber: {
    color: '#F3B95F',
    fontSize: 13,
    fontWeight: '900',
  },
  stepText: {
    color: 'rgba(233, 253, 255, 0.76)',
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
  },
});
