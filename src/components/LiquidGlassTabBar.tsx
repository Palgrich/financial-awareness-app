import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
  LayoutChangeEvent,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { House, BookOpen } from 'lucide-react-native';
import { CommonActions } from '@react-navigation/native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

const BAR_HEIGHT = 82;
const BAR_HORIZONTAL_MARGIN = 20;
const BAR_BOTTOM_PADDING = 12;
const PILL_PADDING_H = 8;
const PILL_HEIGHT = 48;
const INNER_PADDING_H = 12;
const ICON_SIZE = 24;
const LABEL_FONT_SIZE = 12;
const ICON_LABEL_GAP = 5;
const TAB_ITEM_PADDING_VERTICAL = 12;
const BORDER_RADIUS = 28;

const ACTIVE_COLOR = '#5B8CFF';
const INACTIVE_COLOR = 'rgba(30, 41, 59, 0.9)';
const PILL_BG = 'rgba(255, 255, 255, 0.85)';
const PILL_BORDER = 'rgba(255, 255, 255, 0.9)';

const TAB_CONFIG = [
  { name: 'Dashboard' as const, label: 'Progress', icon: House },
  { name: 'Learn' as const, label: 'Learn', icon: BookOpen },
];

export function LiquidGlassTabBar({
  state,
  navigation,
  descriptors,
  insets,
}: BottomTabBarProps) {
  const [layoutWidth, setLayoutWidth] = useState(0);
  const pillAnim = useRef(new Animated.Value(state.index)).current;

  const tabWidth =
    layoutWidth > 0
      ? (layoutWidth - 2 * INNER_PADDING_H) / TAB_CONFIG.length
      : 0;
  const pillWidth = tabWidth > 0 ? tabWidth - 2 * PILL_PADDING_H : 0;
  const pillTop = (BAR_HEIGHT - PILL_HEIGHT) / 2;

  useEffect(() => {
    Animated.spring(pillAnim, {
      toValue: state.index,
      useNativeDriver: true,
      tension: 120,
      friction: 14,
    }).start();
  }, [state.index, pillAnim]);

  const onLayout = (e: LayoutChangeEvent) => {
    const w = e.nativeEvent.layout.width;
    if (w > 0) setLayoutWidth(w);
  };

  const bottomInset = insets?.bottom ?? 0;
  const totalHeight = BAR_HEIGHT + BAR_BOTTOM_PADDING + bottomInset;

  const pillTranslateX = pillAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [
      INNER_PADDING_H + PILL_PADDING_H,
      INNER_PADDING_H + tabWidth + PILL_PADDING_H,
    ],
  });

  const pillShadow = Platform.select({
    ios: {
      shadowColor: '#5B8CFF',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 12,
    },
    android: { elevation: 4 },
  });

  return (
    <View
      style={[
        styles.outer,
        {
          left: BAR_HORIZONTAL_MARGIN,
          right: BAR_HORIZONTAL_MARGIN,
          bottom: 0,
          height: totalHeight,
          paddingBottom: bottomInset,
        },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.container,
          {
            height: BAR_HEIGHT + BAR_BOTTOM_PADDING,
            borderRadius: BORDER_RADIUS,
            ...(Platform.OS === 'ios'
              ? {
                  shadowColor: '#0F172A',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.06,
                  shadowRadius: 12,
                }
              : { elevation: 8 }),
          },
        ]}
        onLayout={onLayout}
      >
        <View style={[StyleSheet.absoluteFill, styles.blurWrap]}>
          <BlurView
            tint="light"
            intensity={60}
            style={[StyleSheet.absoluteFill, { borderRadius: BORDER_RADIUS }]}
          />
        </View>
        <View
          style={[
            styles.glassOverlay,
            {
              borderRadius: BORDER_RADIUS,
              borderWidth: 1,
              borderColor: 'rgba(255, 255, 255, 0.6)',
            },
          ]}
          pointerEvents="none"
        />
        <View style={[styles.content, { height: BAR_HEIGHT }]}>
          {layoutWidth > 0 && pillWidth > 0 ? (
            <Animated.View
              style={[
                styles.pill,
                {
                  width: pillWidth,
                  height: PILL_HEIGHT,
                  borderRadius: 999,
                  backgroundColor: PILL_BG,
                  borderWidth: 1,
                  borderColor: PILL_BORDER,
                  top: pillTop,
                  transform: [{ translateX: pillTranslateX }],
                },
                pillShadow,
              ]}
              pointerEvents="none"
            />
          ) : null}
          {state.routes.slice(0, 2).map((route, index) => {
            const config = TAB_CONFIG[index];
            if (!config) return null;
            const focused = state.index === index;
            const { options } = descriptors[route.key];
            const Icon = config.icon;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
              if (!focused && !event.defaultPrevented) {
                navigation.dispatch({
                  ...CommonActions.navigate({ name: route.name, merge: true }),
                  target: state.key,
                });
              }
            };

            return (
              <Pressable
                key={route.key}
                style={styles.tabItem}
                onPress={onPress}
                accessibilityRole="tab"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={options.tabBarAccessibilityLabel ?? config.label}
              >
                <Icon
                  size={ICON_SIZE}
                  color={focused ? ACTIVE_COLOR : INACTIVE_COLOR}
                />
                <Text
                  style={[
                    styles.label,
                    {
                      color: focused ? ACTIVE_COLOR : INACTIVE_COLOR,
                      fontWeight: focused ? '600' : '500',
                    },
                  ]}
                  numberOfLines={1}
                >
                  {config.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: 'absolute',
    paddingHorizontal: 0,
  },
  container: {
    flex: 1,
    overflow: 'visible',
  },
  blurWrap: {
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: INNER_PADDING_H,
  },
  pill: {
    position: 'absolute',
    left: 0,
  },
  tabItem: {
    flex: 1,
    height: BAR_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: TAB_ITEM_PADDING_VERTICAL,
    gap: ICON_LABEL_GAP,
  },
  label: {
    fontSize: LABEL_FONT_SIZE,
  },
});
