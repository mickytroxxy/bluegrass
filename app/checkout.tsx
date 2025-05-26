import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AddressButton, Button } from '@/components/ui/Button';
import { Divider } from '@/components/ui/Divider';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import Metrics from '@/constants/metrics';
import { currencyFormatter, useProducts } from '@/src/hooks/useProducts';
import { clearCart } from '@/src/store/slices/products';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

export default function CheckoutScreen() {
  const router = useRouter();
  const { cart, cartTotal, } = useProducts();

  const [selectedAddress, setSelectedAddress] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(0);

  const deliveryFee = 28.00;
  const totalAmount = cartTotal + deliveryFee;

  // Sample addresses
  const addresses = [
    "123 Main Street, Johannesburg, 2001",
    "456 Oak Avenue, Cape Town, 8001",
    "789 Pine Road, Durban, 4001"
  ];

  // Payment methods
  const paymentMethods = [
    { id: 0, name: "Credit Card", icon: "credit-card", type: "MaterialIcons" },
    { id: 1, name: "Cash on Delivery", icon: "money", type: "FontAwesome" },
    { id: 2, name: "Mobile Payment", icon: "smartphone", type: "MaterialIcons" }
  ];

  const handlePlaceOrder = () => {
    Alert.alert(
      "Order Placed Successfully!",
      `Your order of ${currencyFormatter(totalAmount)} has been placed and will be delivered to:\n\n${addresses[selectedAddress]}`,
      [
        {
          text: "OK",
          onPress: () => {
            clearCart();
            router.push('/(tabs)');
          }
        }
      ]
    );
  };

  const renderPaymentMethod = (method: any) => {
    const isSelected = selectedPayment === method.id;

    return (
      <TouchableOpacity
        key={method.id}
        style={[
          styles.paymentMethod,
          isSelected && styles.selectedPaymentMethod
        ]}
        onPress={() => setSelectedPayment(method.id)}
      >
        <View style={styles.paymentMethodContent}>
          <Icon
            type={method.type}
            name={method.icon}
            size={24}
            color={isSelected ? Colors.dark.primary : Colors.dark.gray}
          />
          <ThemedText
            style={[
              styles.paymentMethodText,
              isSelected && styles.selectedPaymentMethodText
            ]}
            fontFamily="AvenirMedium"
          >
            {method.name}
          </ThemedText>
        </View>
        {isSelected && (
          <Icon
            type="MaterialIcons"
            name="check-circle"
            size={24}
            color={Colors.dark.primary}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'Checkout' }} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText style={styles.title} fontFamily="AGaramondProBold">
            Checkout
          </ThemedText>
        </View>
        <Divider/>
        {/* Delivery Address Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle} fontFamily="AvenirBold">
            Delivery Address
          </ThemedText>

          {addresses.map((address, index) => (
            <AddressButton
              key={index}
              address={address}
              isSelected={selectedAddress === index}
              onPress={() => setSelectedAddress(index)}
            />
          ))}

          <TouchableOpacity style={styles.addAddressButton}>
            <Icon type="MaterialIcons" name="add" size={20} color={Colors.dark.primary} />
            <ThemedText style={styles.addAddressText} fontFamily="AvenirMedium">
              Add New Address
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle} fontFamily="AvenirBold">
            Payment Method
          </ThemedText>

          {paymentMethods.map(renderPaymentMethod)}
        </View>

        {/* Order Summary */}
        <View style={styles.summarySection}>
          <ThemedText style={styles.sectionTitle} fontFamily="AvenirBold">
            Order Summary
          </ThemedText>

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel} fontFamily="AvenirMedium">
              Items ({cart.length})
            </ThemedText>
            <ThemedText style={styles.summaryValue} fontFamily="AvenirBold">
              {currencyFormatter(cartTotal)}
            </ThemedText>
          </View>

          <View style={styles.summaryRow}>
            <ThemedText style={styles.summaryLabel} fontFamily="AvenirMedium">
              Delivery Fee
            </ThemedText>
            <ThemedText style={styles.summaryValue} fontFamily="AvenirBold">
              {currencyFormatter(deliveryFee)}
            </ThemedText>
          </View>

          <View style={[styles.summaryRow, styles.totalRow]}>
            <ThemedText style={styles.totalLabel} fontFamily="AvenirBold">
              Total Amount
            </ThemedText>
            <ThemedText style={styles.totalValue} fontFamily="AvenirBold">
              {currencyFormatter(totalAmount)}
            </ThemedText>
          </View>
        </View>

        {/* Place Order Button */}
        <View style={styles.orderSection}>
          <Button
            variant="primary"
            label={`Place Order - ${currencyFormatter(totalAmount)}`}
            onPress={handlePlaceOrder}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal: Metrics.screenPaddingH,
    paddingVertical: Metrics.screenPaddingV
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 40,
    color: Colors.dark.primary,
    lineHeight:40
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    color: Colors.dark.primary,
    marginBottom: 16,
  },
  addAddressButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    borderColor: Colors.dark.primary,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 8,
  },
  addAddressText: {
    color: Colors.dark.primary,
    fontSize: 16,
    marginLeft: 8,
  },
  paymentMethod: {
    backgroundColor: Colors.light.background,
    borderColor: '#E0E0E0',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectedPaymentMethod: {
    borderColor: Colors.dark.primary,
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 16,
    color: Colors.dark.gray,
    marginLeft: 12,
  },
  selectedPaymentMethodText: {
    color: Colors.dark.primary,
  },
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    // Cross-platform elevation/shadow
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
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
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
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
  orderSection: {
    marginBottom: 20,
  },
});
