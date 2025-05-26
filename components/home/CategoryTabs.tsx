import { Colors } from '@/constants/Colors';
import Metrics from '@/constants/metrics';
import React from 'react';
import { ScrollView, StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface CategoryTabsProps {
  categories: string[];
  selectedCategories: string[];
  onCategoryPress: (category: string) => void;
}

export default function CategoryTabs({ categories, selectedCategories, onCategoryPress }: CategoryTabsProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.categoriesContainer}
      contentContainerStyle={styles.categoriesContent}
    >
      {categories.map(category => {
        const isActive = selectedCategories.includes(category) || (category === 'All' && selectedCategories.length === 1 && selectedCategories[0] === 'All');
        return (
          <TouchableOpacity
            key={category}
            style={styles.categoryTab as ViewStyle}
            onPress={() => onCategoryPress(category)}
          >
            <Text style={[styles.categoryText as TextStyle, isActive && styles.activeCategoryText as TextStyle]}>
              {category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  categoriesContainer: {
    marginVertical: Metrics.inputGap * 3,
  },
  categoriesContent: {
    paddingRight: 20,
  },
  categoryTab: {
    marginRight: 30,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.dark.primary,
    fontFamily: 'AvenirMedium',
  },
  activeCategoryText: {
    fontFamily: 'AvenirBold',
  },
}); 