import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { formatCurrency } from '../utils/format';

const DEFAULT_SIZE = 200;
const OUTER_RADIUS = 84;
const INNER_RADIUS = 50;

/** Strong primary for largest segment (institutional blue); muted for rest; last for "Other" */
const PRIMARY_COLOR = '#1d4ed8';
const PRIMARY_COLOR_DARK = '#3b82f6';
const PALETTE = [
  '#475569',
  '#64748b',
  '#94a3b8',
  '#64748b',
  '#475569',
  '#cbd5e1',
];

function polarToCartesian(
  cx: number,
  cy: number,
  r: number,
  angleInDegrees: number
): { x: number; y: number } {
  const a = ((angleInDegrees - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(a),
    y: cy + r * Math.sin(a),
  };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M',
    start.x,
    start.y,
    'A',
    r,
    r,
    0,
    largeArc,
    1,
    end.x,
    end.y,
  ].join(' ');
}

/** Donut segment path: outer arc → line to inner → inner arc (reverse) → close */
function describeDonutSegment(
  cx: number,
  cy: number,
  outerR: number,
  innerR: number,
  startAngle: number,
  endAngle: number
): string {
  const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
  const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
  const innerEnd = polarToCartesian(cx, cy, innerR, endAngle);
  const innerStart = polarToCartesian(cx, cy, innerR, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return [
    'M', outerStart.x, outerStart.y,
    'A', outerR, outerR, 0, largeArc, 1, outerEnd.x, outerEnd.y,
    'L', innerEnd.x, innerEnd.y,
    'A', innerR, innerR, 0, largeArc, 0, innerStart.x, innerStart.y,
    'Z',
  ].join(' ');
}

export interface DonutChartSegment {
  label: string;
  value: number;
  category: string;
}

interface DonutChartProps {
  data: DonutChartSegment[];
  total: number;
  onPressSlice?: (category: string) => void;
  dark?: boolean;
  size?: number;
  /** Show legend below donut; default true */
  showLegend?: boolean;
  /** Max legend rows; default 6 */
  legendMaxItems?: number;
}

const HIT_SLOP = { top: 12, bottom: 12, left: 12, right: 12 };

export function DonutChart({
  data,
  total,
  onPressSlice,
  dark = false,
  size = DEFAULT_SIZE,
  showLegend = true,
  legendMaxItems = 6,
}: DonutChartProps) {
  const cx = size / 2;
  const cy = size / 2;
  const scale = Math.min(size / (OUTER_RADIUS * 2), 1);
  const outerR = OUTER_RADIUS * scale;
  const innerR = INNER_RADIUS * scale;

  const totalAmount = data.reduce((s, d) => s + d.value, 0);
  const hasData = data.length > 0 && totalAmount > 0;
  const topNonOther = data.filter((d) => d.category !== 'Other').slice(0, 4);
  const otherSeg = data.find((d) => d.category === 'Other');
  const legendItems = hasData ? (otherSeg ? [...topNonOther, otherSeg] : topNonOther) : [];

  const textColor = dark ? '#f1f5f9' : '#0f172a';
  const mutedColor = dark ? '#94a3b8' : '#64748b';

  let currentAngle = 0;

  return (
    <View style={[styles.wrapper, { width: size }]}>
      <View style={{ width: size, height: size }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <G>
            {hasData &&
              data.map((seg, i) => {
                const pct = (seg.value / totalAmount) * 100;
                const sweepAngle = Math.max(0.5, (pct / 100) * 360);
                const endAngle = currentAngle + sweepAngle;
                const path = describeDonutSegment(
                  cx,
                  cy,
                  outerR,
                  innerR,
                  currentAngle,
                  endAngle
                );
                currentAngle = endAngle;
                const isOther = seg.category === 'Other';
                const color = isOther ? PALETTE[5] : i === 0 ? (dark ? PRIMARY_COLOR_DARK : PRIMARY_COLOR) : PALETTE[i % 5];

                return (
                  <G
                    key={`${seg.category}-${i}`}
                    onPress={
                      !isOther && onPressSlice
                        ? () => onPressSlice(seg.category)
                        : undefined
                    }
                  >
                    <Path
                      d={path}
                      fill={color}
                      stroke="transparent"
                      strokeWidth={0}
                    />
                  </G>
                );
              })}
          </G>
        </Svg>
        <View
          style={[
            styles.center,
            StyleSheet.absoluteFillObject,
            { width: size, height: size },
          ]}
          pointerEvents="none"
        >
          <Text style={[styles.centerLabelMuted, { color: mutedColor }]}>
            {hasData ? 'Total spend' : 'No spending'}
          </Text>
          <Text style={[styles.centerValueSmall, { color: textColor }]}>
            {hasData ? formatCurrency(total) : '—'}
          </Text>
        </View>
      </View>

      {showLegend && (
        <View style={[styles.legend, { width: size }]}>
          {hasData ? (
            legendItems.map((seg, i) => {
              const pct = Math.round((seg.value / totalAmount) * 100);
              const isOther = seg.category === 'Other';
              const color = isOther ? PALETTE[5] : i === 0 ? (dark ? PRIMARY_COLOR_DARK : PRIMARY_COLOR) : PALETTE[i % 5];

              return (
                <Pressable
                  key={`${seg.category}-${i}`}
                  style={({ pressed }) => [
                    styles.legendRow,
                    !isOther && onPressSlice && pressed && styles.legendRowPressed,
                  ]}
                  onPress={
                    !isOther && onPressSlice
                      ? () => onPressSlice(seg.category)
                      : undefined
                  }
                  disabled={isOther || !onPressSlice}
                  hitSlop={HIT_SLOP}
                >
                  <View style={[styles.legendDot, { backgroundColor: color }]} />
                  <Text
                    style={[
                      styles.legendName,
                      { color: textColor },
                      isOther && styles.legendNameMuted,
                    ]}
                    numberOfLines={1}
                  >
                    {seg.label}
                  </Text>
                  <Text style={[styles.legendPct, { color: mutedColor }]}>
                    {pct}%
                  </Text>
                </Pressable>
              );
            })
          ) : (
            <Text style={[styles.emptyLegend, { color: mutedColor }]}>
              No spending in this period
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabelMuted: {
    fontSize: 12,
    marginBottom: 2,
  },
  centerValue: {
    fontSize: 20,
    fontWeight: '700',
  },
  centerValueSmall: {
    fontSize: 17,
    fontWeight: '700',
  },
  legend: {
    marginTop: 10,
    paddingHorizontal: 4,
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    gap: 6,
    borderRadius: 4,
  },
  legendRowPressed: {
    opacity: 0.7,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendName: {
    flex: 1,
    fontSize: 13,
  },
  legendNameMuted: {
    fontStyle: 'italic',
  },
  legendPct: {
    fontSize: 12,
  },
  emptyLegend: {
    fontSize: 14,
    textAlign: 'center',
    paddingVertical: 8,
  },
});
