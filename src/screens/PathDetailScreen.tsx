import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft } from 'lucide-react-native';
import type { LearnStackParamList } from '../navigation/types';

type Route = RouteProp<LearnStackParamList, 'PathDetail'>;

export function PathDetailScreen() {
  const route = useRoute<Route>();
  const navigation = useNavigation();
  const { pathId } = route.params;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ChevronLeft size={24} color="#0F172A" />
        </TouchableOpacity>
        <Text style={styles.title}>Learning path</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.placeholder}>Path: {pathId}</Text>
        <Text style={styles.sub}>Detail screen coming soon.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: { padding: 4, marginRight: 8 },
  title: { fontSize: 18, fontWeight: '600', color: '#0F172A' },
  content: { flex: 1, padding: 24 },
  placeholder: { fontSize: 17, fontWeight: '600', color: '#0F172A' },
  sub: { fontSize: 14, color: '#64748B', marginTop: 8 },
});
