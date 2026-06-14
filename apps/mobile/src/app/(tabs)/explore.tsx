import { Link } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { academyClasses, classPassState } from '@/constants/academy-product';

const passRows = [
  ['billing', 'Stripe or app-store entitlement later'],
  ['source', 'Academy backend should return class_pass.active'],
  ['fallback', 'locked tracks stay visible but blocked'],
] as const;

export default function ClassesScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Paid access</Text>
          <Text style={styles.title}>Classes stay visible, but paid tracks require a class pass.</Text>
        </View>

        <View style={styles.passPanel}>
          <View>
            <Text style={styles.passLabel}>Current pass</Text>
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
              <View key={item.id} style={styles.classPanel}>
                <View style={[styles.classRail, { backgroundColor: item.accent }]} />
                <View style={styles.classContent}>
                  <View style={styles.classHeader}>
                    <View style={styles.classTitleGroup}>
                      <Text style={styles.className}>{item.name}</Text>
                      <Text style={styles.classFormat}>{item.format}</Text>
                    </View>
                    <View style={[styles.accessBadge, locked && styles.lockedBadge]}>
                      <Text style={[styles.accessBadgeText, locked && styles.lockedBadgeText]}>
                        {locked ? 'locked' : 'open'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.classOutcome}>{item.outcome}</Text>
                  <View style={styles.classFooter}>
                    <Text style={styles.classSchedule}>{item.schedule}</Text>
                    <Text style={styles.classAction}>
                      {locked ? 'upgrade required' : 'available after scheduling'}
                    </Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        <View style={styles.contractPanel}>
          <Text style={styles.panelTitle}>Entitlement contract</Text>
          {passRows.map(([key, value]) => (
            <View key={key} style={styles.contractRow}>
              <Text style={styles.contractKey}>{key}</Text>
              <Text style={styles.contractValue}>{value}</Text>
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
  header: {
    gap: 10,
    paddingTop: 28,
  },
  kicker: {
    color: '#F3B95F',
    fontSize: 12,
    fontWeight: '900',
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
  passPanel: {
    alignItems: 'center',
    backgroundColor: 'rgba(243, 185, 95, 0.09)',
    borderColor: 'rgba(243, 185, 95, 0.28)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 16,
  },
  passLabel: {
    color: '#F3B95F',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  passValue: {
    color: '#E9FDFF',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 3,
    textTransform: 'uppercase',
  },
  passButton: {
    backgroundColor: '#E9FDFF',
    borderRadius: 8,
    justifyContent: 'center',
    minHeight: 42,
    paddingHorizontal: 13,
  },
  passButtonText: {
    color: '#02070B',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  classList: {
    gap: 10,
  },
  classPanel: {
    backgroundColor: 'rgba(6, 19, 22, 0.94)',
    borderColor: 'rgba(233, 253, 255, 0.13)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 138,
    padding: 14,
  },
  classRail: {
    borderRadius: 8,
    width: 4,
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
    color: '#E9FDFF',
    fontSize: 18,
    fontWeight: '900',
    lineHeight: 22,
    textTransform: 'uppercase',
  },
  classFormat: {
    color: '#50D8FA',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  accessBadge: {
    borderColor: 'rgba(63, 207, 143, 0.7)',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  lockedBadge: {
    borderColor: 'rgba(243, 185, 95, 0.76)',
  },
  accessBadgeText: {
    color: '#3FCF8F',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  lockedBadgeText: {
    color: '#F3B95F',
  },
  classOutcome: {
    color: 'rgba(233, 253, 255, 0.72)',
    fontSize: 14,
    lineHeight: 21,
  },
  classFooter: {
    borderTopColor: 'rgba(233, 253, 255, 0.08)',
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    paddingTop: 10,
  },
  classSchedule: {
    color: '#E9FDFF',
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  classAction: {
    color: 'rgba(233, 253, 255, 0.58)',
    flex: 1,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'right',
    textTransform: 'uppercase',
  },
  contractPanel: {
    backgroundColor: 'rgba(80, 216, 250, 0.07)',
    borderColor: 'rgba(80, 216, 250, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  panelTitle: {
    color: '#E9FDFF',
    fontSize: 15,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  contractRow: {
    borderTopColor: 'rgba(233, 253, 255, 0.08)',
    borderTopWidth: 1,
    gap: 5,
    paddingTop: 12,
  },
  contractKey: {
    color: '#50D8FA',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  contractValue: {
    color: 'rgba(233, 253, 255, 0.72)',
    fontSize: 13,
    lineHeight: 19,
  },
});
