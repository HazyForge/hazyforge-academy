import * as Notifications from 'expo-notifications';
import { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { academyBooking, academyClasses, classPassState } from '@/constants/academy-product';
import { academyTheme as theme } from '@/constants/academy-theme';
import { useAuth } from '@/contexts/auth-context';
import {
  SchedulingSlot,
  createSchedulingBooking,
  getSchedulingSlots,
} from '@/services/scheduling';

const nextSteps = [
  'Choose the learner, pace, and first thing they want to build.',
  'Book a fit call without leaving the app.',
  'Turn the call into a class plan, reminders, and paid-track access.',
];

function getDeviceTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || academyBooking.timeZone;
  } catch {
    return academyBooking.timeZone;
  }
}

function getScheduleDays() {
  return Array.from({ length: 7 }, (_, index) => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() + index);

    const end = new Date(start);
    end.setDate(start.getDate() + 1);

    return {
      key: start.toISOString().slice(0, 10),
      label: start.toLocaleDateString(undefined, { weekday: 'short' }),
      date: start.toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
      start: start.toISOString(),
      end: end.toISOString(),
    };
  });
}

function getDisplayTime(value: string) {
  return new Date(value).toLocaleTimeString([], {
    hour: 'numeric',
    minute: '2-digit',
  });
}

async function configureNotificationChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('academy', {
      name: 'Academy reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: theme.colors.sky,
    });
  }
}

export default function ScheduleScreen() {
  const scheduleDays = useMemo(getScheduleDays, []);
  const timeZone = useMemo(getDeviceTimeZone, []);
  const [notificationStatus, setNotificationStatus] = useState('Reminders are off for now');
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);
  const [slots, setSlots] = useState<SchedulingSlot[]>([]);
  const [selectedSlotStart, setSelectedSlotStart] = useState<string | null>(null);
  const [slotsMessage, setSlotsMessage] = useState('Loading available times');
  const [isLoadingSlots, setIsLoadingSlots] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [bookingName, setBookingName] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const { logout, user } = useAuth();
  const unlockedClasses = academyClasses.filter(
    (item) => !item.requiresPass || classPassState.hasActivePass,
  ).length;
  const selectedDay = scheduleDays[selectedDayIndex];

  useEffect(() => {
    if (!bookingName && user?.name) {
      setBookingName(user.name);
    }
    if (!bookingEmail && user?.email) {
      setBookingEmail(user.email);
    }
  }, [bookingEmail, bookingName, user?.email, user?.name]);

  useEffect(() => {
    let isActive = true;

    async function loadSlots() {
      setIsLoadingSlots(true);
      setSelectedSlotStart(null);
      setSlotsMessage('Loading available times');

      try {
        const slotsByDay = await getSchedulingSlots({
          end: selectedDay.end,
          start: selectedDay.start,
          timeZone,
        });
        const daySlots = Object.values(slotsByDay)
          .flat()
          .sort((left, right) => left.start.localeCompare(right.start));

        if (!isActive) return;

        setSlots(daySlots);
        setSlotsMessage(daySlots.length ? 'Choose one open time' : 'No open times for this day');
      } catch (error) {
        if (!isActive) return;

        setSlots([]);
        setSlotsMessage(
          error instanceof Error
            ? error.message
            : 'Could not load available times from Cal.diy.',
        );
      } finally {
        if (isActive) {
          setIsLoadingSlots(false);
        }
      }
    }

    loadSlots();

    return () => {
      isActive = false;
    };
  }, [selectedDay.end, selectedDay.start, timeZone]);

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

  async function submitBooking() {
    if (!selectedSlotStart) {
      Alert.alert('Pick a time', 'Choose an available fit-call time first.');
      return;
    }

    if (!bookingName.trim() || !bookingEmail.trim()) {
      Alert.alert('Add contact details', 'Name and email are required for the calendar invite.');
      return;
    }

    setIsBooking(true);
    try {
      await createSchedulingBooking({
        email: bookingEmail.trim(),
        name: bookingName.trim(),
        notes: bookingNotes.trim(),
        start: selectedSlotStart,
        timeZone,
      });
      Alert.alert('Fit call booked', 'Cal.diy has the appointment. Watch your email for the invite.');
      setSelectedSlotStart(null);
      setBookingNotes('');
    } catch (error) {
      Alert.alert(
        'Booking did not finish',
        error instanceof Error ? error.message : 'Cal.diy could not create the booking.',
      );
    } finally {
      setIsBooking(false);
    }
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
              Pick an open Cal.diy time right here. The Academy app keeps the plan, reminders, and
              class context together.
            </Text>
          </View>
          <View style={styles.actions}>
            <Pressable style={styles.primaryButton} onPress={submitBooking} disabled={isBooking}>
              <Text style={styles.primaryButtonText}>{isBooking ? 'Booking' : 'Book selected time'}</Text>
            </Pressable>
            <Pressable style={styles.secondaryButton} onPress={schedulePracticeReminder}>
              <Text style={styles.secondaryButtonText}>Try reminder</Text>
            </Pressable>
          </View>
          <Text style={styles.notificationText}>{notificationStatus}</Text>
        </View>

        <View style={styles.schedulerShell}>
          <View style={styles.panelHeader}>
            <View>
              <Text style={styles.panelEyebrow}>Booking</Text>
              <Text style={styles.panelTitle}>Pick a time that works</Text>
            </View>
            <Text style={styles.panelMeta}>{academyBooking.duration}</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dayList}>
            {scheduleDays.map((day, index) => {
              const selected = index === selectedDayIndex;

              return (
                <Pressable
                  key={day.key}
                  style={[styles.dayChip, selected && styles.selectedDayChip]}
                  onPress={() => setSelectedDayIndex(index)}>
                  <Text style={[styles.dayLabel, selected && styles.selectedDayText]}>{day.label}</Text>
                  <Text style={[styles.dayDate, selected && styles.selectedDayText]}>{day.date}</Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={styles.slotPanel}>
            <View style={styles.slotPanelHeader}>
              <Text style={styles.slotMessage}>{slotsMessage}</Text>
              {isLoadingSlots && <ActivityIndicator color={theme.colors.sky} />}
            </View>
            <View style={styles.slotGrid}>
              {slots.map((slot) => {
                const selected = slot.start === selectedSlotStart;

                return (
                  <Pressable
                    key={slot.start}
                    style={[styles.slotChip, selected && styles.selectedSlotChip]}
                    onPress={() => setSelectedSlotStart(slot.start)}>
                    <Text style={[styles.slotChipText, selected && styles.selectedSlotText]}>
                      {getDisplayTime(slot.start)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.bookingForm}>
            <TextInput
              autoCapitalize="words"
              onChangeText={setBookingName}
              placeholder="Learner or parent name"
              placeholderTextColor={theme.colors.inkFaint}
              style={styles.input}
              value={bookingName}
            />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setBookingEmail}
              placeholder="Email for invite"
              placeholderTextColor={theme.colors.inkFaint}
              style={styles.input}
              value={bookingEmail}
            />
            <TextInput
              multiline
              onChangeText={setBookingNotes}
              placeholder="What do you want help building?"
              placeholderTextColor={theme.colors.inkFaint}
              style={[styles.input, styles.notesInput]}
              textAlignVertical="top"
              value={bookingNotes}
            />
          </View>

          <View style={styles.bookingFooter}>
            <Text style={styles.bookingFooterText}>
              Times come from Cal.diy for {academyBooking.owner}. Invite details are created by Cal.
            </Text>
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
    color: theme.colors.sky,
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
    backgroundColor: theme.colors.skySoft,
    borderColor: '#BFDDF2',
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    justifyContent: 'center',
    minWidth: 74,
  },
  heroAccentText: {
    color: theme.colors.sky,
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
    backgroundColor: theme.colors.skySoft,
    borderColor: '#BFDDF2',
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
    backgroundColor: theme.colors.sky,
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
    borderColor: '#BFDDF2',
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 16,
  },
  secondaryButtonText: {
    color: theme.colors.sky,
    fontSize: 13,
    fontWeight: '900',
  },
  notificationText: {
    color: theme.colors.inkMuted,
    fontSize: 13,
    fontWeight: '700',
  },
  schedulerShell: {
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
  dayList: {
    gap: 8,
    paddingRight: 12,
  },
  dayChip: {
    backgroundColor: theme.colors.backgroundSoft,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    gap: 4,
    minWidth: 74,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  selectedDayChip: {
    backgroundColor: theme.colors.sky,
    borderColor: theme.colors.sky,
  },
  dayLabel: {
    color: theme.colors.inkFaint,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  dayDate: {
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  selectedDayText: {
    color: theme.colors.white,
  },
  slotPanel: {
    backgroundColor: theme.colors.backgroundSoft,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    gap: 12,
    minHeight: 118,
    padding: 12,
  },
  slotPanelHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  slotMessage: {
    color: theme.colors.inkMuted,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
  },
  slotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  slotChip: {
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    minHeight: 40,
    minWidth: 82,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  selectedSlotChip: {
    backgroundColor: theme.colors.green,
    borderColor: theme.colors.green,
  },
  slotChipText: {
    color: theme.colors.ink,
    fontSize: 13,
    fontWeight: '900',
    textAlign: 'center',
  },
  selectedSlotText: {
    color: theme.colors.white,
  },
  bookingForm: {
    gap: 10,
  },
  input: {
    backgroundColor: theme.colors.backgroundSoft,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    color: theme.colors.ink,
    fontSize: 14,
    fontWeight: '700',
    minHeight: 48,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  notesInput: {
    minHeight: 90,
  },
  bookingFooter: {
    borderTopColor: theme.colors.line,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  bookingFooterText: {
    color: theme.colors.inkMuted,
    fontSize: 12,
    lineHeight: 18,
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
