import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { academyClasses, classPassState } from '@/constants/academy-product';
import { academyTheme as theme } from '@/constants/academy-theme';

const passRows = [
  ['Free start', 'The fit call and starter path stay easy to reach.'],
  ['Paid tracks', 'Project series unlock when the class pass is active.'],
  ['Later backend', 'The app will read pass status from Academy billing and account data.'],
] as const;

export default function ClassesScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Classes</Text>
          <Text style={styles.title}>Find a path that fits the learner.</Text>
          <Text style={styles.lede}>
            Start with confidence work, then unlock deeper projects when the class pass is ready.
          </Text>
        </View>

        <View style={styles.passPanel}>
          <View style={styles.passCopy}>
            <Text style={styles.passLabel}>Current access</Text>
            <Text style={styles.passValue}>{classPassState.label}</Text>
          </View>
          <Link href="/(tabs)" asChild>
            <Pressable style={styles.passButton}>
              <Text style={styles.passButtonText}>Book fit call</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.classList}>
          {academyClasses.map((item) => {
            const locked = item.requiresPass && !classPassState.hasActivePass;

            return (
              <View key={item.id} style={[styles.classPanel, locked && styles.lockedClassPanel]}>
                <View style={[styles.classIcon, { backgroundColor: item.accent }]}>
                  <Text style={styles.classIconText}>{item.name.slice(0, 1)}</Text>
                </View>
                <View style={styles.classContent}>
                  <View style={styles.classHeader}>
                    <View style={styles.classTitleGroup}>
                      <Text style={styles.className}>{item.name}</Text>
                      <Text style={styles.classFormat}>{item.format}</Text>
                    </View>
                    <View style={[styles.accessBadge, locked && styles.lockedBadge]}>
                      <Text style={[styles.accessBadgeText, locked && styles.lockedBadgeText]}>
                        {locked ? 'Class pass' : 'Open'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.classOutcome}>{item.outcome}</Text>
                  <View style={styles.classFooter}>
                    <Text style={styles.classSchedule}>{item.schedule}</Text>
                    <Text style={styles.classAction}>
                      {locked ? 'Preview now, unlock later' : 'Ready after scheduling'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.notePanel}>
          <Text style={styles.panelTitle}>How access should feel</Text>
          {passRows.map(([key, value]) => (
            <View key={key} style={styles.noteRow}>
              <Text style={styles.noteKey}>{key}</Text>
              <Text style={styles.noteValue}>{value}</Text>
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
  header: {
    gap: 9,
    paddingTop: 28,
  },
  kicker: {
    color: theme.colors.green,
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
  passPanel: {
    ...theme.shadow,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 16,
  },
  passCopy: {
    flex: 1,
  },
  passLabel: {
    color: theme.colors.inkFaint,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  passValue: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
    marginTop: 4,
  },
  passButton: {
    backgroundColor: theme.colors.green,
    borderRadius: theme.radius.panel,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 13,
  },
  passButtonText: {
    color: theme.colors.white,
    fontSize: 12,
    fontWeight: '900',
  },
  classList: {
    gap: 10,
  },
  classPanel: {
    ...theme.shadow,
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 136,
    padding: 14,
  },
  lockedClassPanel: {
    backgroundColor: '#FFF8EA',
    borderColor: '#E8D2A7',
  },
  classIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.panel,
    height: 52,
    justifyContent: 'center',
    width: 52,
  },
  classIconText: {
    color: theme.colors.white,
    fontSize: 24,
    fontWeight: '900',
  },
  classContent: {
    flex: 1,
    gap: 12,
  },
  classHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  classTitleGroup: {
    flex: 1,
    gap: 5,
  },
  className: {
    color: theme.colors.ink,
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
  },
  classFormat: {
    color: theme.colors.sky,
    fontSize: 12,
    fontWeight: '800',
  },
  accessBadge: {
    backgroundColor: theme.colors.greenSoft,
    borderColor: '#C9E6C2',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  lockedBadge: {
    backgroundColor: theme.colors.amberSoft,
    borderColor: '#E5C783',
  },
  accessBadgeText: {
    color: theme.colors.greenDeep,
    fontSize: 11,
    fontWeight: '900',
  },
  lockedBadgeText: {
    color: theme.colors.amber,
  },
  classOutcome: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    lineHeight: 21,
  },
  classFooter: {
    borderTopColor: theme.colors.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  classSchedule: {
    color: theme.colors.ink,
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
  },
  classAction: {
    color: theme.colors.inkFaint,
    flex: 1.2,
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'right',
  },
  notePanel: {
    backgroundColor: theme.colors.skySoft,
    borderColor: '#B8DDE8',
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  panelTitle: {
    color: theme.colors.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  noteRow: {
    borderTopColor: '#C8E4EC',
    borderTopWidth: 1,
    gap: 5,
    paddingTop: 12,
  },
  noteKey: {
    color: theme.colors.sky,
    fontSize: 12,
    fontWeight: '900',
  },
  noteValue: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
