import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import Metrics from '@/constants/metrics';
import { currencyFormatter } from '@/src/hooks/useProducts';
import { Product } from '@/src/store/slices/products';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ProductCardProps {
  product: Product;
  inCart: boolean;
  onAddToCart: (product: Product) => void;
  width: number;
}

export default function ProductCard({ product, inCart, onAddToCart, width }: ProductCardProps) {
  return (
    <View style={[styles.productCard, { width }]}> 
      <Image
        source={{ uri: product.strMealThumb }}
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={{paddingTop: 12}}>
        <ThemedText style={styles.productName} numberOfLines={2}>
          {product.strMeal}
        </ThemedText>
        <ThemedView style={{flexDirection:'row'}}>
          <ThemedView style={{flex:1,justifyContent:'center'}}>
            <Text style={{fontSize:14,color:Colors.dark.primary,fontFamily:'AvenirBold'}}>
              {currencyFormatter(product.price)}
            </Text>
          </ThemedView>
          <TouchableOpacity
            style={[
              {borderRadius:Metrics.borderRadius * 10,borderWidth:1,borderColor:Colors.dark.primary,padding:5},
              inCart && {borderColor:'green'}
            ]}
            onPress={() => onAddToCart(product)}
          >
            <Icon type='MaterialCommunityIcons' name='cart-outline' size={15} color={inCart ? 'green' : Colors.dark.primary} />
          </TouchableOpacity>
        </ThemedView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
  },
  productImage: {
    width: '100%',
    aspectRatio:1,
    borderRadius:4,
  },
  productName: {
    fontSize: 14,
    color: Colors.dark.primary,
    marginBottom: 8,
    lineHeight: 18,
  },
}); 