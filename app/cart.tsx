import CartItem from '@/components/cart/CartItem';
import Footer from '@/components/cart/Footer';
import PromoCode from '@/components/cart/PromoCode';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Divider } from '@/components/ui/Divider';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import Metrics from '@/constants/metrics';
import { useProducts } from '@/src/hooks/useProducts';
import { Stack, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, ScrollView, TextStyle, View, ViewStyle } from 'react-native';

export default function CartScreen() {
  const router = useRouter();
  const {
    cart,
    cartTotal,
    updateProductQuantity,
    removeProductFromCart
  } = useProducts();

  const [promoCode, setPromoCode] = useState('');
  const deliveryFee = 28.00;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeProductFromCart(productId);
    } else {
      updateProductQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId: string) => {
    removeProductFromCart(productId);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  const handleApplyPromo = () => {
    // Implement promo code logic here
  };

  if (cart.length === 0) {
    return (
      <ThemedView style={styles.container as ViewStyle}>
        <View style={styles.emptyCart as ViewStyle}>
          <Icon type="MaterialCommunityIcons" name="cart-outline" size={80} color={Colors.dark.gray} />
          <ThemedText style={styles.emptyCartText as TextStyle} fontFamily="AvenirMedium">
            Your cart is empty
          </ThemedText>
          {/* You can add a button here if needed */}
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={{flex:1}}>
      <Stack.Screen options={{ headerTitle: '', headerRight: () => <View /> }} />
      <ScrollView style={styles.scrollView as ViewStyle} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.container as ViewStyle}>
          {/* Header */}
          <View style={styles.header as ViewStyle}>
            <ThemedText style={styles.title as TextStyle} fontFamily="AGaramondProBold">Cart</ThemedText>
          </View>
          <Divider/>
          {/* Cart Items */}
          <ThemedView style={{marginTop:20}}>
            <FlatList
              data={cart}
              renderItem={({ item }) => (
                <CartItem
                  item={item}
                  onQuantityChange={handleQuantityChange}
                  onRemove={handleRemoveItem}
                />
              )}
              keyExtractor={(item) => item.product.idMeal}
              scrollEnabled={false}
              style={styles.cartList as ViewStyle}
            />
          </ThemedView>
          {/* Promo Code Section */}
          <PromoCode value={promoCode} onChange={setPromoCode} onApply={handleApplyPromo} />
        </ThemedView>
        {/* Order Summary */}
        <Footer cartTotal={cartTotal} deliveryFee={deliveryFee} onCheckout={handleCheckout} />
      </ScrollView>
    </ThemedView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: Colors.light.background, // off-white background
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
    lineHeight: 40,
  },
  cartList: {
    marginBottom: 20,
  },
  emptyCart: {
    flex: 1,
    justifyContent: 'center' as ViewStyle['justifyContent'],
    alignItems: 'center' as ViewStyle['alignItems'],
    paddingHorizontal: 40,
  },
  emptyCartText: {
    fontSize: 18,
    color: Colors.dark.gray,
    marginVertical: 20,
    textAlign: 'center' as TextStyle['textAlign'],
  },
};