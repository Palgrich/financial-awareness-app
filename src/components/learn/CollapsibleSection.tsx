import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';
import { colors } from '../../theme/tokens';
import { GlassCardContainer } from '../GlassCardContainer';
import { IllustrationBackgroundLayer } from '../IllustrationBackgroundLayer';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ILLUSTRATION_OPACITY = 0.14;

export interface CollapsibleSectionProps {
  title: string;
  /** Shown in collapsed state: current item title (e.g. path or lesson name) */
  currentItemTitle: string | null;
  /** Shown in collapsed state: e.g. "4 lessons" or "3 min · In progress" */
  currentItemSubtitle: string | null;
  /** Called when user taps "Continue →" in collapsed state */
  onContinue: () => void;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  /** Gradient key for glass card (e.g. 'awareness', 'credit') */
  gradientKey: 'awareness' | 'credit' | 'cash';
  /** Emoji for background illustration */
  emoji: string;
  glowColor: string;
}

export function CollapsibleSection({
  title,
  currentItemTitle,
  currentItemSubtitle,
  onContinue,
  expanded,
  onToggle,
  children,
  gradientKey,
  emoji,
  glowColor,
}: CollapsibleSectionProps) {
  useEffect(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [expanded]);

  const content = (
    <>
      <IllustrationBackgroundLayer
        emoji={emoji}
        variant="card"
        glowColor={glowColor}
        opacityOverride={ILLUSTRATION_OPACITY}
      />
      <View style={styles.content}>
        <Pressable
          style={({ pressed }) => [styles.headerRow, pressed && styles.pressed]}
          onPress={onToggle}
        >
          <Text style={styles.sectionTitle}>{title}</Text>
          <View style={styles.headerRight}>
            {!expanded && currentItemTitle != null ? (
              <Pressable
                style={({ pressed: p }) => [styles.cta, p && styles.pressed]}
                onPress={(e) => {
                  e.stopPropagation();
                  onContinue();
                }}
              >
                <Text style={styles.ctaText}>Continue →</Text>
              </Pressable>
            ) : null}
            {expanded ? (
              <ChevronDown size={20} color={colors.text.muted} />
            ) : (
              <ChevronRight size={20} color={colors.text.muted} />
            )}
          </View>
        </Pressable>

        {!expanded && currentItemTitle != null ? (
          <Pressable
            style={({ pressed }) => [styles.previewRow, pressed && styles.pressed]}
            onPress={onContinue}
          >
            <View style={styles.previewLeft}>
              <Text style={styles.previewTitle}>{currentItemTitle}</Text>
              {currentItemSubtitle ? (
                <Text style={styles.previewSub}>{currentItemSubtitle}</Text>
              ) : null}
            </View>
          </Pressable>
        ) : null}

        {expanded ? <View style={styles.expandedContent}>{children}</View> : null}
      </View>
    </>
  );

  return (
    <View style={styles.wrapper}>
      <GlassCardContainer gradientKey={gradientKey}>
        {content}
      </GlassCardContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 28,
    overflow: 'hidden' as const,
  },
  content: {
    position: 'relative' as const,
    zIndex: 10,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  pressed: { opacity: 0.7 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text.primary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cta: { paddingVertical: 4, paddingHorizontal: 4 },
  ctaText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.accent.primary,
  },
  previewRow: {
    paddingTop: 8,
    paddingBottom: 4,
  },
  previewLeft: {},
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  previewSub: {
    fontSize: 13,
    color: colors.text.secondary,
    marginTop: 2,
  },
  expandedContent: {
    paddingTop: 8,
  },
});
