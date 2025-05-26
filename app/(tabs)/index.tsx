import CategoryTabs from '@/components/home/CategoryTabs';
import Header from '@/components/home/Header';
import HomeFooter from '@/components/home/HomeFooter';
import ProductCard from '@/components/home/ProductCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Divider } from '@/components/ui/Divider';
import { Colors } from '@/constants/Colors';
import Metrics from '@/constants/metrics';
import { useProducts } from '@/src/hooks/useProducts';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  View
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = (width - 60) / 2; // 2 columns with padding

export default function HomeScreen() {
  const {
    products,
    loading,
    hasMore,
    cartItemsCount,
    loadMore,
    changeCategory,
    addProductToCart,
    isInCart
  } = useProducts();
  const router = useRouter();
  // Add 'ALL' to categories
  const meatCategories = ['All', 'Beef', 'Fish', 'Pork', 'Chicken'];

  // Multi-select state
  const [selectedCategories, setSelectedCategories] = useState<string[]>(['All']);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Helper to fetch products for selected categories
  const fetchProductsForCategories = useCallback((categories: string[]) => {
    const cats = categories.includes('All') ? meatCategories.filter(c => c !== 'All') : categories;
    for (const cat of cats) {
      changeCategory(cat);
    }
  }, [changeCategory]);

  // Handle category tab press
  const handleCategoryPress = (category: string) => {
    if (category === 'All') {
      setSelectedCategories(['All']);
      changeCategory('Beef'); // Default to Beef for now
    } else {
      let newSelected: string[];
      if (selectedCategories.includes('All')) {
        newSelected = [category];
      } else if (selectedCategories.includes(category)) {
        newSelected = selectedCategories.filter(c => c !== category);
        if (newSelected.length === 0) newSelected = ['All'];
      } else {
        newSelected = [...selectedCategories, category];
      }
      setSelectedCategories(newSelected);
      changeCategory(newSelected[newSelected.length - 1]); // Fetch for last selected
    }
  };

  // Pull-to-refresh handler
  const onRefresh = () => {
    setRefreshing(true);
    fetchProductsForCategories(selectedCategories);
    setRefreshing(false);
  };

  const handleLoadMore = () => {
    if (hasMore && !loading && !loadingMore) {
      setLoadingMore(true);
      loadMore();
      setTimeout(() => setLoadingMore(false), 1000);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ headerTitle: 'back' }} />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Header cartItemsCount={cartItemsCount} onCartPress={() => router.push('/cart')} />
        <ThemedView><Divider /></ThemedView>
        {/* Category Tabs */}
        <CategoryTabs
          categories={meatCategories}
          selectedCategories={selectedCategories}
          onCategoryPress={handleCategoryPress}
        />
        {/* Our Products Section */}
        <View style={styles.sectionHeader}>
          <ThemedText style={{color:Colors.dark.primary,fontSize:12}}>Based on your selection</ThemedText>
          <ThemedText style={styles.sectionTitle}>Our products</ThemedText>
        </View>
        {/* Products Grid */}
        {loading && products.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.dark.primary} />
            <ThemedText style={styles.loadingText}>Loading products...</ThemedText>
          </View>
        ) : (
          <FlatList
            data={products}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                inCart={isInCart(item.idMeal)}
                onAddToCart={addProductToCart}
                width={ITEM_WIDTH}
              />
            )}
            keyExtractor={(item) => item.idMeal}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.productsGrid}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.1}
            ListFooterComponent={<HomeFooter loadingMore={loadingMore} />}
            scrollEnabled={false}
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingHorizontal:Metrics.screenPaddingH,
    paddingVertical:Metrics.screenPaddingV
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 30,
    fontFamily: 'AGaramondProBold',
    color: Colors.dark.primary,
    lineHeight: 40,
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
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
  },
});