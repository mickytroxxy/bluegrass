import { ThemedText } from '@/components/ThemedText';
import { Button } from '@/components/ui/Button';
import { Colors } from '@/constants/Colors';
import { currencyFormatter } from '@/src/hooks/useProducts';
import React from 'react';
import { StyleSheet, View } from 'react-native';

interface FooterProps {
  cartTotal: number;
  deliveryFee: number;
  onCheckout: () => void;
}

export default function Footer({ cartTotal, deliveryFee, onCheckout }: FooterProps) {
  return (
    <View style={styles.summarySection}>
      <View style={styles.summaryRow}>
        <ThemedText style={styles.summaryLabel} fontFamily="AvenirMedium">
          Sub total
        </ThemedText>
        <ThemedText style={styles.summaryValue} fontFamily="AvenirBold">
          {currencyFormatter(cartTotal)}
        </ThemedText>
      </View>
      <View style={styles.summaryRow}>
        <ThemedText style={styles.summaryLabel} fontFamily="AvenirMedium">
          Delivery
        </ThemedText>
        <ThemedText style={styles.summaryValue} fontFamily="AvenirBold">
          {currencyFormatter(deliveryFee)}
        </ThemedText>
      </View>
      <View style={[styles.summaryRow, styles.totalRow]}>
        <ThemedText style={styles.totalLabel} fontFamily="AGaramondProBold">
          Total
        </ThemedText>
        <ThemedText style={styles.totalValue} fontFamily="AGaramondProBold">
          {currencyFormatter(cartTotal + deliveryFee)}
        </ThemedText>
      </View>
      <Button
        variant="primary"
        label="Checkout"
        onPress={onCheckout}
        styles={{marginTop:30}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  summarySection: {
    backgroundColor: '#EBEAE4',
    flex:1,
    padding: 20,
    paddingVertical:50,
    marginTop:50
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: Colors.dark.primary,
  },
  summaryValue: {
    fontSize: 16,
    color: Colors.dark.primary,
  },
  totalRow: {
    borderTopWidth: 2,
    borderTopColor: Colors.dark.primary,
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 18,
    color: Colors.dark.primary,
  },
  totalValue: {
    fontSize: 18,
    color: Colors.dark.primary,
  },
}); 