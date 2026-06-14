import * as Linking from 'expo-linking';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { contactOptions } from '@/constants/academy-product';

function openMessagePlaceholder(label: string) {
  Alert.alert(label, 'This control is wired as UI only until the direct chat or voice provider is set.');
}

export default function ContactScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Direct line</Text>
          <Text style={styles.title}>Reach the instructor without leaving the Academy app.</Text>
        </View>

        <View style={styles.statusPanel}>
          <View>
            <Text style={styles.statusLabel}>Instructor</Text>
            <Text style={styles.statusValue}>Haze</Text>
          </View>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>setup pending</Text>
          </View>
        </View>

        <View style={styles.optionGrid}>
          {contactOptions.map((option) => {
            const onPress =
              option.id === 'email'
                ? () =>
                    Linking.openURL(
                      'mailto:contact@hazyforge.io?subject=Hazy%20Forge%20Academy',
                    )
                : () => openMessagePlaceholder(option.label);

            return (
              <Pressable key={option.id} style={styles.optionPanel} onPress={onPress}>
                <View style={[styles.optionRail, { backgroundColor: option.accent }]} />
                <View style={styles.optionCopy}>
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionSignal}>{option.signal}</Text>
                  </View>
                  <Text style={styles.optionDetail}>{option.detail}</Text>
                </View>
                <Text style={styles.optionArrow}>/</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.protocolPanel}>
          <Text style={styles.panelTitle}>Contact protocol</Text>
          <View style={styles.protocolRow}>
            <Text style={styles.protocolKey}>urgent</Text>
            <Text style={styles.protocolValue}>voice line once provider is connected</Text>
          </View>
          <View style={styles.protocolRow}>
            <Text style={styles.protocolKey}>normal</Text>
            <Text style={styles.protocolValue}>direct chat for class questions and prep notes</Text>
          </View>
          <View style={styles.protocolRow}>
            <Text style={styles.protocolKey}>fallback</Text>
            <Text style={styles.protocolValue}>email stays available for setup and billing</Text>
          </View>
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
    color: '#50D8FA',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0,
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
  statusPanel: {
    alignItems: 'center',
    backgroundColor: 'rgba(80, 216, 250, 0.08)',
    borderColor: 'rgba(80, 216, 250, 0.24)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statusLabel: {
    color: '#50D8FA',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusValue: {
    color: '#E9FDFF',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 3,
    textTransform: 'uppercase',
  },
  liveBadge: {
    borderColor: 'rgba(243, 185, 95, 0.6)',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  liveBadgeText: {
    color: '#F3B95F',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  optionGrid: {
    gap: 10,
  },
  optionPanel: {
    alignItems: 'center',
    backgroundColor: 'rgba(6, 19, 22, 0.92)',
    borderColor: 'rgba(233, 253, 255, 0.13)',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 88,
    padding: 14,
  },
  optionRail: {
    alignSelf: 'stretch',
    borderRadius: 8,
    width: 4,
  },
  optionCopy: {
    flex: 1,
    gap: 7,
  },
  optionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  optionLabel: {
    color: '#E9FDFF',
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  optionSignal: {
    color: 'rgba(233, 253, 255, 0.56)',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  optionDetail: {
    color: 'rgba(233, 253, 255, 0.68)',
    fontSize: 13,
    lineHeight: 19,
  },
  optionArrow: {
    color: 'rgba(233, 253, 255, 0.55)',
    fontSize: 32,
    fontWeight: '300',
  },
  protocolPanel: {
    backgroundColor: 'rgba(63, 207, 143, 0.08)',
    borderColor: 'rgba(63, 207, 143, 0.22)',
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
  protocolRow: {
    borderTopColor: 'rgba(233, 253, 255, 0.08)',
    borderTopWidth: 1,
    gap: 5,
    paddingTop: 12,
  },
  protocolKey: {
    color: '#3FCF8F',
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  protocolValue: {
    color: 'rgba(233, 253, 255, 0.72)',
    fontSize: 13,
    lineHeight: 19,
  },
});
