import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Divider } from '@/components/ui/Divider';
import Icon from '@/components/ui/Icon';
import { Colors } from '@/constants/Colors';
import Metrics from '@/constants/metrics';
import { currencyFormatter, useProducts } from '@/src/hooks/useProducts';
import { Product } from '@/src/store/slices/products';
import { Stack } from 'expo-router';
import React, { useCallback, useState } from 'react';
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
    cartItemsCount,
    loadMore,
    changeCategory,
    addProductToCart,
    isInCart
  } = useProducts();

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

  // Render category tab with multi-select UI
  const renderCategoryTab = (category: string) => {
    const isActive = selectedCategories.includes(category) || (category === 'All' && selectedCategories.length === 1 && selectedCategories[0] === 'All');
    return (
      <TouchableOpacity
        key={category}
        style={[
          styles.categoryTab,
        ]}
        onPress={() => handleCategoryPress(category)}
      >
        <Text style={[
          styles.categoryText,
          isActive && styles.activeCategoryText
        ]}>
          {category}
        </Text>
      </TouchableOpacity>
    );
  };

  const handleLoadMore = () => {
    if (hasMore && !loading && !loadingMore) {
      setLoadingMore(true);
      loadMore();
      setTimeout(() => setLoadingMore(false), 1000);
    }
  };

  const renderProductCard = ({ item }: { item: Product }) => {
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
          <ThemedView style={{flexDirection:'row'}}>
            <ThemedView style={{flex:1,justifyContent:'center'}}>
              <Text style={{fontSize:14,color:Colors.dark.primary,fontFamily:'AvenirBold'}}>
                {currencyFormatter(item.price)}
              </Text>
            </ThemedView>
            <TouchableOpacity
              style={[
                {borderRadius:Metrics.borderRadius * 10,borderWidth:1,borderColor:Colors.dark.primary,padding:5},
                inCart && {borderColor:'green'}
              ]}
              onPress={() => addProductToCart(item)}
            >
              <Icon type='MaterialCommunityIcons' name='cart-outline' size={15} color={inCart ? 'green' : Colors.dark.primary} />
            </TouchableOpacity>
          </ThemedView>
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
          <TouchableOpacity style={styles.cartBadgeContainer}>
            <Icon type='MaterialCommunityIcons' name='cart-outline' size={20} color={Colors.dark.primary} />
            {cartItemsCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartCount}>{cartItemsCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <ThemedView><Divider /></ThemedView>
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
          <ThemedText style={{color:Colors.dark.primary,fontSize:12}}>Based on your selection</ThemedText>
          <ThemedText style={styles.sectionTitle}>Our products</ThemedText>
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
  categoriesContainer: {
    marginVertical: Metrics.inputGap * 3,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryTab: {
    marginRight: 30,
  },
  activeCategoryTab: {

  },
  categoryText: {
    fontSize: 14,
    color: Colors.dark.primary,
    fontFamily: 'AvenirMedium',
  },
  activeCategoryText: {
    fontFamily: 'AvenirBold',
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
    color: Colors.dark.primary,
    marginBottom: 8,
    lineHeight: 18,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: 'AvenirBold',
    color: Colors.dark.primary
  },
  addToCartButton: {

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