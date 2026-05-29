import { Link } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CAL_URL = 'https://cal.hazyforge.io/palehazy/30min';

const tracks = [
  {
    title: 'Computer fluency',
    detail: 'Files, accounts, browsers, safety, shortcuts, and daily confidence.',
    accent: '#50D8FA',
  },
  {
    title: 'Build the machine',
    detail: 'Parts, compatibility, PC assembly, upgrades, and troubleshooting.',
    accent: '#F3B95F',
  },
  {
    title: 'AI foundations',
    detail: 'Prompting, verification, privacy, model limits, and AI-assisted projects.',
    accent: '#3FCF8F',
  },
];

const nextSteps = [
  'Pick the student, class format, and first practical goal.',
  'Schedule a fit call from the app.',
  'Get prep notes, reminders, and class follow-up in one place.',
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

export default function HomeScreen() {
  const [notificationStatus, setNotificationStatus] = useState('Not enabled yet');

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
        data: { url: '/explore' },
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
        <View style={styles.hero}>
          <Text style={styles.kicker}>Hazy Forge Academy</Text>
          <Text style={styles.title}>Schedule learning that turns into shipped work.</Text>
          <Text style={styles.lede}>
            One-on-one and small-group technology classes for computers, coding, hardware,
            websites, terminals, and AI judgment.
          </Text>
          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={() => WebBrowser.openBrowserAsync(CAL_URL)}>
              <Text style={styles.primaryButtonText}>Book a fit call</Text>
            </Pressable>
            <Link href="/explore" asChild>
              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>View classes</Text>
              </Pressable>
            </Link>
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Learning tracks</Text>
            <Text style={styles.panelMeta}>3 active lanes</Text>
          </View>
          <View style={styles.trackList}>
            {tracks.map((track) => (
              <View key={track.title} style={styles.trackCard}>
                <View style={[styles.trackAccent, { backgroundColor: track.accent }]} />
                <View style={styles.trackCopy}>
                  <Text style={styles.trackTitle}>{track.title}</Text>
                  <Text style={styles.trackDetail}>{track.detail}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Class flow</Text>
            <Text style={styles.panelMeta}>first session</Text>
          </View>
          {nextSteps.map((step, index) => (
            <View key={step} style={styles.stepRow}>
              <Text style={styles.stepNumber}>{String(index + 1).padStart(2, '0')}</Text>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={styles.notificationPanel}>
          <View>
            <Text style={styles.panelTitle}>Practice reminders</Text>
            <Text style={styles.notificationText}>{notificationStatus}</Text>
          </View>
          <Pressable style={styles.smallButton} onPress={schedulePracticeReminder}>
            <Text style={styles.smallButtonText}>Test reminder</Text>
          </Pressable>
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
    paddingHorizontal: 20,
    gap: 16,
  },
  hero: {
    paddingTop: 28,
    paddingBottom: 12,
    gap: 16,
  },
  kicker: {
    color: '#3FCF8F',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  title: {
    color: '#E9FDFF',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 42,
    textTransform: 'uppercase',
  },
  lede: {
    color: 'rgba(233, 253, 255, 0.72)',
    fontSize: 16,
    lineHeight: 25,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
  },
  primaryButton: {
    minHeight: 48,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#3FCF8F',
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: '#02100C',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  secondaryButton: {
    minHeight: 48,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(233, 253, 255, 0.16)',
    borderRadius: 8,
    paddingHorizontal: 18,
  },
  secondaryButtonText: {
    color: '#E9FDFF',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  panel: {
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(233, 253, 255, 0.12)',
    borderRadius: 8,
    backgroundColor: 'rgba(6, 19, 22, 0.88)',
    padding: 18,
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  panelTitle: {
    color: '#E9FDFF',
    fontSize: 17,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  panelMeta: {
    color: '#50D8FA',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  trackList: {
    gap: 10,
  },
  trackCard: {
    flexDirection: 'row',
    gap: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(233, 253, 255, 0.06)',
    padding: 14,
  },
  trackAccent: {
    width: 4,
    borderRadius: 8,
  },
  trackCopy: {
    flex: 1,
    gap: 4,
  },
  trackTitle: {
    color: '#E9FDFF',
    fontSize: 15,
    fontWeight: '800',
  },
  trackDetail: {
    color: 'rgba(233, 253, 255, 0.68)',
    fontSize: 13,
    lineHeight: 20,
  },
  stepRow: {
    flexDirection: 'row',
    gap: 14,
    alignItems: 'flex-start',
    borderTopWidth: 1,
    borderTopColor: 'rgba(233, 253, 255, 0.08)',
    paddingTop: 14,
  },
  stepNumber: {
    color: '#F3B95F',
    fontSize: 13,
    fontWeight: '800',
  },
  stepText: {
    flex: 1,
    color: 'rgba(233, 253, 255, 0.78)',
    fontSize: 14,
    lineHeight: 21,
  },
  notificationPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(63, 207, 143, 0.24)',
    borderRadius: 8,
    backgroundColor: 'rgba(63, 207, 143, 0.09)',
    padding: 18,
  },
  notificationText: {
    marginTop: 6,
    color: 'rgba(233, 253, 255, 0.68)',
    fontSize: 13,
  },
  smallButton: {
    minHeight: 42,
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#E9FDFF',
    paddingHorizontal: 14,
  },
  smallButtonText: {
    color: '#02070B',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
