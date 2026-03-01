import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Circle } from 'react-native-svg';

const GRADIENT_COLORS = ['#1E1B4B', '#3730A3', '#5B4FE8'] as const;
const RING_SIZE = 90;
const RING_R = 35;
const RING_CIRCUMFERENCE = 220;
const RING_STROKE = '#A5F3FC';

export type FinancialPulseStatus =
  | 'Critical'
  | 'At Risk'
  | 'Stable'
  | 'Good'
  | 'Thriving';

export interface TopActionItem {
  id: string;
  text: string;
  cta: string;
  urgency: string;
}

export interface FinancialPulseCardProps {
  healthPercent: number;
  status: FinancialPulseStatus;
  description: string;
  topAction?: TopActionItem;
  totalActions: number;
  onSeeAll?: () => void;
  onActionPress?: () => void;
}

const RING_BG_STROKE = 'rgba(255,255,255,0.15)';

function PulseRing({ percent }: { percent: number }) {
  const strokeDashoffset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;
  return (
    <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_R}
        fill="none"
        stroke={RING_BG_STROKE}
        strokeWidth={6}
      />
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_R}
        fill="none"
        stroke={RING_STROKE}
        strokeWidth={6}
        strokeDasharray={RING_CIRCUMFERENCE}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`}
      />
    </Svg>
  );
}

export function FinancialPulseCard({
  healthPercent,
  status,
  description,
  topAction,
  totalActions,
  onSeeAll,
  onActionPress,
}: FinancialPulseCardProps) {
  return (
    <LinearGradient
      colors={[...GRADIENT_COLORS]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.decorativeCircleTopRight} />
      <View style={styles.decorativeCircleBottomLeft} />
      <View style={styles.topRow}>
        <Text style={styles.pulseLabel}>FINANCIAL PULSE</Text>
        <View style={styles.statusPill}>
          <Text style={styles.statusPillText}>{status}</Text>
        </View>
      </View>

      <View style={styles.ringAndStatusRow}>
        <View style={styles.ringWrap}>
          <PulseRing percent={healthPercent} />
          <View style={styles.ringCenter}>
            <Text style={styles.ringPercent}>{healthPercent}</Text>
            <Text style={styles.ringHealthLabel}>health</Text>
          </View>
        </View>
        <View style={styles.statusBlock}>
          <Text style={styles.statusWord}>{status}</Text>
          <Text style={styles.description} numberOfLines={3}>
            {description}
          </Text>
        </View>
      </View>

      {topAction ? (
        <>
          <View style={styles.divider} />
          <TouchableOpacity
            style={styles.actionRow}
            onPress={onActionPress}
            activeOpacity={0.7}
          >
            <Text style={styles.actionText} numberOfLines={2}>
              {topAction.urgency === 'high' ? '🔴 ' : topAction.urgency === 'medium' ? '🟡 ' : ''}
              {topAction.text}
            </Text>
            <Text style={styles.actionCta}>{topAction.cta} →</Text>
          </TouchableOpacity>
          {totalActions > 1 ? (
            <TouchableOpacity
              style={styles.seeAllRow}
              onPress={onSeeAll}
              activeOpacity={0.7}
            >
              <Text style={styles.seeAllText}>See all {totalActions} actions →</Text>
            </TouchableOpacity>
          ) : null}
        </>
      ) : null}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pulseLabel: {
    fontSize: 11,
    opacity: 0.5,
    letterSpacing: 1.2,
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  statusPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusPillText: {
    fontSize: 12,
    color: '#FFFFFF',
  },
  ringAndStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
    marginBottom: 20,
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringPercent: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  ringHealthLabel: {
    fontSize: 9,
    opacity: 0.5,
    color: '#FFFFFF',
    marginTop: 2,
  },
  statusBlock: {
    flex: 1,
  },
  statusWord: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.65)',
  },
  actionRow: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionCta: {
    fontSize: 13,
    fontWeight: '600',
    color: '#A5F3FC',
  },
  seeAllRow: {
    paddingVertical: 8,
    alignItems: 'flex-start',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: 16,
  },
  decorativeCircleTopRight: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 160,
    height: 160,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 80,
  },
  decorativeCircleBottomLeft: {
    position: 'absolute',
    bottom: -60,
    left: -20,
    width: 200,
    height: 200,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 100,
  },
  seeAllText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
  },
});

export default FinancialPulseCard;
