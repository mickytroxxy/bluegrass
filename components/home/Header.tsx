import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  cartItemsCount: number;
  onCartPress: () => void;
}

export default function Header({ cartItemsCount, onCartPress }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.mainTitle}>Meat</Text>
      <TouchableOpacity onPress={onCartPress} style={styles.cartBadgeContainer}>
        <Icon type='MaterialCommunityIcons' name='cart-outline' size={20} color={Colors.dark.primary} />
        {cartItemsCount > 0 && (
          <View style={styles.cartBadge}>
            <Text style={styles.cartCount}>{cartItemsCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 40,
    fontFamily: 'AGaramondProBold',
    color: Colors.dark.primary,
  },
  cartBadgeContainer: {
    position: 'relative',
    padding: 5,
    right: 5,
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: Colors.dark.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  cartCount: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'AvenirBold',
    fontWeight: '600',
  },
}); 