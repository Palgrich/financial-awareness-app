import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

const W = 200;
const H = 44;
const PAD = 4;

export interface WeeklySparklineProps {
  data: number[];
  color: string;
  /** X-axis labels e.g. ['W1','W2','W3','W4'] */
  labels?: string[];
}

export function WeeklySparkline({
  data,
  color,
  labels = ['W1', 'W2', 'W3', 'W4'],
}: WeeklySparklineProps) {
  if (data.length === 0) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const stepX = (W - PAD * 2) / (data.length - 1 || 1);
  const points = data
    .map((y, i) => {
      const x = PAD + i * stepX;
      const ny = H - PAD - ((y - min) / range) * (H - PAD * 2);
      return `${x},${ny}`;
    })
    .join(' ');

  return (
    <View style={styles.wrap}>
      <Svg width={W} height={H} style={styles.svg}>
        <Polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
      <View style={[styles.labels, { width: W }]}>
        {(labels.slice(0, data.length) as string[]).map((l, i) => (
          <Text key={i} style={styles.label}>
            {l}
          </Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 8 },
  svg: {},
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
    marginTop: 4,
  },
  label: {
    fontSize: 10,
    color: '#94A3B8',
  },
});
