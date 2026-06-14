import * as Linking from 'expo-linking';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { contactOptions } from '@/constants/academy-product';
import { academyTheme as theme } from '@/constants/academy-theme';

function openMessagePlaceholder(label: string) {
  Alert.alert(label, 'This button is ready for the chat or voice provider once it is connected.');
}

export default function ContactScreen() {
  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.kicker}>Contact</Text>
          <Text style={styles.title}>Ask a question when you get stuck.</Text>
          <Text style={styles.lede}>
            Class questions, parent planning, and setup help should be easy to reach.
          </Text>
        </View>

        <View style={styles.statusPanel}>
          <View>
            <Text style={styles.statusLabel}>Instructor</Text>
            <Text style={styles.statusValue}>Haze</Text>
          </View>
          <View style={styles.liveBadge}>
            <Text style={styles.liveBadgeText}>chat setup coming</Text>
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
                <View style={[styles.optionIcon, { backgroundColor: option.accent }]}>
                  <Text style={styles.optionIconText}>{option.label.slice(0, 1)}</Text>
                </View>
                <View style={styles.optionCopy}>
                  <View style={styles.optionHeader}>
                    <Text style={styles.optionLabel}>{option.label}</Text>
                    <Text style={styles.optionSignal}>{option.signal}</Text>
                  </View>
                  <Text style={styles.optionDetail}>{option.detail}</Text>
                </View>
                <Text style={styles.optionArrow}>Open</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.notePanel}>
          <Text style={styles.panelTitle}>Best way to reach out</Text>
          <View style={styles.noteRow}>
            <Text style={styles.noteKey}>Class questions</Text>
            <Text style={styles.noteValue}>Use chat once it is connected, especially for prep notes.</Text>
          </View>
          <View style={styles.noteRow}>
            <Text style={styles.noteKey}>Quick call</Text>
            <Text style={styles.noteValue}>Voice will be for moments where a short talk saves time.</Text>
          </View>
          <View style={styles.noteRow}>
            <Text style={styles.noteKey}>Reliable fallback</Text>
            <Text style={styles.noteValue}>Email is available now for setup, billing, and scheduling help.</Text>
          </View>
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
    color: theme.colors.sky,
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
    ...theme.shadow,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
  },
  statusLabel: {
    color: theme.colors.inkFaint,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusValue: {
    color: theme.colors.ink,
    fontSize: 20,
    fontWeight: '900',
    marginTop: 3,
  },
  liveBadge: {
    backgroundColor: theme.colors.amberSoft,
    borderColor: '#E5C783',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  liveBadgeText: {
    color: theme.colors.amber,
    fontSize: 12,
    fontWeight: '900',
  },
  optionGrid: {
    gap: 10,
  },
  optionPanel: {
    ...theme.shadow,
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderColor: theme.colors.line,
    borderRadius: theme.radius.panel,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 90,
    padding: 14,
  },
  optionIcon: {
    alignItems: 'center',
    borderRadius: theme.radius.panel,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  optionIconText: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: '900',
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
    color: theme.colors.ink,
    flex: 1,
    fontSize: 18,
    fontWeight: '900',
  },
  optionSignal: {
    color: theme.colors.inkFaint,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  optionDetail: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
  optionArrow: {
    color: theme.colors.green,
    fontSize: 12,
    fontWeight: '900',
  },
  notePanel: {
    backgroundColor: theme.colors.greenSoft,
    borderColor: '#C9E6C2',
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
    borderTopColor: '#BCD8B7',
    borderTopWidth: 1,
    gap: 5,
    paddingTop: 12,
  },
  noteKey: {
    color: theme.colors.greenDeep,
    fontSize: 12,
    fontWeight: '900',
  },
  noteValue: {
    color: theme.colors.inkMuted,
    fontSize: 14,
    lineHeight: 20,
  },
});
