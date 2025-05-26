import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import { currencyFormatter } from '@/src/hooks/useProducts';
import { CartItem as CartItemType } from '@/src/store/slices/products';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface CartItemProps {
  item: CartItemType;
  onQuantityChange: (productId: string, newQuantity: number) => void;
  onRemove: (productId: string) => void;
}

export default function CartItem({ item, onQuantityChange, onRemove }: CartItemProps) {
  return (
    <View style={styles.cartItem}>
      <Image
        source={{ uri: item.product.strMealThumb }}
        style={styles.itemImage}
        resizeMode="cover"
      />
      <View style={styles.itemDetails}>
        <View style={styles.itemHeader}>
          <ThemedText
            style={styles.itemName}
            numberOfLines={2}
            fontFamily="AGaramondProItalicLight"
          >
            {item.product.strMeal}
          </ThemedText>
        </View>
        <ThemedText style={styles.itemPrice} fontFamily="AvenirBold">{currencyFormatter(item.product.price)}</ThemedText>
        <ThemedView style={styles.quantityControls}>
          <ThemedView>
            <Button
              variant="secondary"
              label="Remove"
              onPress={() => onRemove(item.product.idMeal)}
              styles={{marginRight:10,paddingTop:0,paddingBottom:0,borderWidth:2,height:28}}
            />
          </ThemedView>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onQuantityChange(item.product.idMeal, item.quantity - 1)}
          >
            <Icon type="MaterialIcons" name="remove" size={18} color={Colors.dark.primary} />
          </TouchableOpacity>
          <ThemedText style={styles.quantityText} fontFamily="AvenirMedium">
            {item.quantity}
          </ThemedText>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => onQuantityChange(item.product.idMeal, item.quantity + 1)}
          >
            <Icon type="MaterialIcons" name="add" size={18} color={Colors.dark.primary} />
          </TouchableOpacity>
        </ThemedView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
  },
  itemImage: {
    width: 130,
    aspectRatio: 1,
    borderRadius: 2,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
    justifyContent:'center'
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    color: Colors.dark.primary,
    flex: 1,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 16,
    color: Colors.dark.primary,
    marginBottom: 12,
    fontFamily: 'AGaramondProItalic',
    lineHeight:18
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.dark.primary,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  quantityText: {
    fontSize: 16,
    color: Colors.dark.primary,
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
}); 