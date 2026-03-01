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

function PulseRing({ percent }: { percent: number }) {
  const strokeDashoffset = RING_CIRCUMFERENCE - (percent / 100) * RING_CIRCUMFERENCE;
  return (
    <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}>
      <Circle
        cx={RING_SIZE / 2}
        cy={RING_SIZE / 2}
        r={RING_R}
        fill="transparent"
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
      <View style={styles.content}>
        <View style={styles.ringWrap}>
          <PulseRing percent={healthPercent} />
          <View style={styles.ringCenter}>
            <Text style={styles.statusWord}>{status}</Text>
          </View>
        </View>
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
        {topAction ? (
          <>
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
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
  },
  content: {
    alignItems: 'center',
  },
  ringWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ringCenter: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusWord: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  description: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginBottom: 12,
  },
  actionRow: {
    alignSelf: 'stretch',
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
    alignSelf: 'stretch',
    paddingVertical: 8,
  },
  seeAllText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
  },
});

export default FinancialPulseCard;
