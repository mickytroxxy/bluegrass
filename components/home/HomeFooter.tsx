import { Colors } from '@/constants/Colors';
import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

interface HomeFooterProps {
  loadingMore: boolean;
}

export default function HomeFooter({ loadingMore }: HomeFooterProps) {
  if (!loadingMore) return null;
  return (
    <View style={styles.footerLoader}>
      <ActivityIndicator size="small" color={Colors.dark.primary} />
      <Text style={styles.loadingText}>Loading more products...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'AvenirMedium',
    color: '#6C757D',
  },
}); 