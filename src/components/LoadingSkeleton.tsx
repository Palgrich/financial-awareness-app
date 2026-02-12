import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export function LoadingSkeleton() {
  const opacity = React.useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.6, duration: 600, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.block, styles.header, { opacity }]} />
      <Animated.View style={[styles.block, styles.card1, { opacity }]} />
      <Animated.View style={[styles.block, styles.card2, { opacity }]} />
      <Animated.View style={[styles.block, styles.card3, { opacity }]} />
      <Animated.View style={[styles.block, styles.line1, { opacity }]} />
      <Animated.View style={[styles.block, styles.line2, { opacity }]} />
      <Animated.View style={[styles.block, styles.line3, { opacity }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  block: {
    backgroundColor: '#e2e8f0',
    borderRadius: 8,
  },
  header: {
    height: 32,
    width: '60%',
    marginBottom: 24,
  },
  card1: {
    height: 100,
    marginBottom: 12,
  },
  card2: {
    height: 80,
    marginBottom: 12,
  },
  card3: {
    height: 80,
    marginBottom: 24,
  },
  line1: {
    height: 56,
    marginBottom: 8,
  },
  line2: {
    height: 56,
    marginBottom: 8,
  },
  line3: {
    height: 56,
  },
});
