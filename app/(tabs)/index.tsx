import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import { useProducts } from '@/src/hooks/useProducts';
import { Product } from '@/src/store/slices/products';
import { Stack } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 2; // 2 columns with padding

export default function HomeScreen() {
  const {
    products,
    loading,
    hasMore,
    selectedCategory,
    cartItemsCount,
    loadMore,
    changeCategory,
    addProductToCart,
    isInCart,
    getCartItem
  } = useProducts();

  const [loadingMore, setLoadingMore] = useState(false);

  // Categories for meat products (matching the design)
  const meatCategories = ['Beef', 'Fish', 'Pork', 'Chicken'];

  const handleLoadMore = () => {
    if (hasMore && !loading && !loadingMore) {
      setLoadingMore(true);
      loadMore();
      setTimeout(() => setLoadingMore(false), 1000);
    }
  };

  const renderCategoryTab = (category: string) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryTab,
        selectedCategory === category && styles.activeCategoryTab
      ]}
      onPress={() => changeCategory(category)}
    >
      <Text style={[
        styles.categoryText,
        selectedCategory === category && styles.activeCategoryText
      ]}>
        {category}
      </Text>
    </TouchableOpacity>
  );

  const renderProductCard = ({ item }: { item: Product }) => {
    const cartItem = getCartItem(item.idMeal);
    const inCart = isInCart(item.idMeal);

    return (
      <View style={styles.productCard}>
        <Image
          source={{ uri: item.strMealThumb }}
          style={styles.productImage}
          resizeMode="cover"
        />
        <View style={{paddingTop: 12}}>
          <ThemedText style={styles.productName} numberOfLines={2}>
            {item.strMeal}
          </ThemedText>
          <Text style={styles.productPrice}>
            ${item.price?.toFixed(2)}
          </Text>
          <TouchableOpacity
            style={[
              styles.addToCartButton,
              inCart && styles.inCartButton
            ]}
            onPress={() => addProductToCart(item)}
          >
            <Text style={[
              styles.addToCartText,
              inCart && styles.inCartText
            ]}>
              {inCart ? `In Cart (${cartItem?.quantity})` : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={Colors.dark.primary} />
        <Text style={styles.loadingText}>Loading more products...</Text>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'back' }} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.mainTitle}>Meat</Text>
          <View style={styles.cartBadge}>
            <Text style={styles.cartCount}>{cartItemsCount}</Text>
          </View>
        </View>

        {/* Category Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        >
          {meatCategories.map(renderCategoryTab)}
        </ScrollView>

        {/* Our Products Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our products</Text>
        </View>

        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.dark.primary} />
            <Text style={styles.loadingText}>Loading products...</Text>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={renderProductCard}
            keyExtractor={(item) => item.idMeal}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.productsGrid}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderFooter}
            scrollEnabled={false}
          />
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  mainTitle: {
    fontSize: 32,
    fontFamily: 'AvenirBold',
    color: '#2C3E50',
    fontWeight: '700',
  },
  cartBadge: {
    backgroundColor: Colors.dark.primary,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCount: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'AvenirMedium',
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    marginRight: 15,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  activeCategoryTab: {
    backgroundColor: Colors.dark.primary,
    borderColor: Colors.dark.primary,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'AvenirMedium',
    color: '#6C757D',
    fontWeight: '500',
  },
  activeCategoryText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'AvenirBold',
    color: '#2C3E50',
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    fontFamily: 'AvenirMedium',
    color: '#6C757D',
  },
  productsGrid: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: ITEM_WIDTH,
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
    color: '#2C3E50',
    fontWeight: '600',
    marginBottom: 8,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 16,
    fontFamily: 'AvenirBold',
    color: Colors.dark.primary,
    fontWeight: '700',
    marginBottom: 10,
  },
  addToCartButton: {
    backgroundColor: Colors.dark.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  inCartButton: {
    backgroundColor: '#28A745',
  },
  addToCartText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'AvenirMedium',
    fontWeight: '600',
  },
  inCartText: {
    color: '#fff',
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
});