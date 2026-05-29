import { Link } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CAL_URL = 'https://cal.hazyforge.io/palehazy/30min';

const classes = [
  {
    name: 'First Computer Confidence',
    format: '1:1 or family session',
    outcome: 'A student can manage files, accounts, browsers, safety, and daily machine habits.',
  },
  {
    name: 'Build Your First PC',
    format: 'workshop series',
    outcome: 'A parts list, assembly plan, build day, and troubleshooting notes.',
  },
  {
    name: 'AI Builder Lab',
    format: 'project sprint',
    outcome: 'A practical prototype built with AI assistance and verification habits.',
  },
  {
    name: 'Ship A First Website',
    format: 'portfolio track',
    outcome: 'HTML, CSS, deployment, domain basics, and a live page students can share.',
  },
];

const reminders = [
  'Class confirmations and schedule changes',
  'Prep checklist before a build or coding session',
  'Practice prompts between lessons',
  'Follow-up notes after class',
];

export default function ClassesScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Link href="/(tabs)" asChild>
            <Pressable style={styles.backButton}>
              <Text style={styles.backButtonText}>Home</Text>
            </Pressable>
          </Link>
          <Text style={styles.kicker}>Classes and reminders</Text>
          <Text style={styles.title}>Pick a track, then make the schedule real.</Text>
        </View>

        <View style={styles.classList}>
          {classes.map((item) => (
            <View key={item.name} style={styles.classCard}>
              <View style={styles.classTopline}>
                <Text style={styles.className}>{item.name}</Text>
                <Text style={styles.classFormat}>{item.format}</Text>
              </View>
              <Text style={styles.classOutcome}>{item.outcome}</Text>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Notification plan</Text>
          {reminders.map((item) => (
            <View key={item} style={styles.reminderRow}>
              <View style={styles.reminderDot} />
              <Text style={styles.reminderText}>{item}</Text>
            </View>
          ))}
        </View>

        <Pressable style={styles.primaryButton} onPress={() => WebBrowser.openBrowserAsync(CAL_URL)}>
          <Text style={styles.primaryButtonText}>Schedule on Cal</Text>
        </Pressable>
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
  header: {
    gap: 14,
    paddingTop: 28,
  },
  backButton: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(233, 253, 255, 0.16)',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  backButtonText: {
    color: '#E9FDFF',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  kicker: {
    color: '#3FCF8F',
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  title: {
    color: '#E9FDFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 0,
    lineHeight: 36,
    textTransform: 'uppercase',
  },
  classList: {
    gap: 12,
  },
  classCard: {
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(233, 253, 255, 0.12)',
    borderRadius: 8,
    backgroundColor: 'rgba(6, 19, 22, 0.88)',
    padding: 18,
  },
  classTopline: {
    gap: 6,
  },
  className: {
    color: '#E9FDFF',
    fontSize: 18,
    fontWeight: '900',
  },
  classFormat: {
    color: '#50D8FA',
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  classOutcome: {
    color: 'rgba(233, 253, 255, 0.7)',
    fontSize: 14,
    lineHeight: 22,
  },
  panel: {
    gap: 14,
    borderWidth: 1,
    borderColor: 'rgba(243, 185, 95, 0.22)',
    borderRadius: 8,
    backgroundColor: 'rgba(243, 185, 95, 0.08)',
    padding: 18,
  },
  panelTitle: {
    color: '#E9FDFF',
    fontSize: 17,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  reminderRow: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  reminderDot: {
    width: 8,
    height: 8,
    borderRadius: 8,
    backgroundColor: '#F3B95F',
  },
  reminderText: {
    flex: 1,
    color: 'rgba(233, 253, 255, 0.76)',
    fontSize: 14,
    lineHeight: 21,
  },
  primaryButton: {
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '#3FCF8F',
  },
  primaryButtonText: {
    color: '#02100C',
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
});
