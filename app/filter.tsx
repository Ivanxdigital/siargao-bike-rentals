import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronDown, ChevronUp } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getCategories } from '../lib/api';
import { Category } from '../types/supabase';

export default function FilterScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [sortBy, setSortBy] = useState<'price_low' | 'price_high' | 'rating'>('rating');
  const [expandedSections, setExpandedSections] = useState({
    price: true,
    categories: true,
    availability: true,
    sort: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const categoriesData = await getCategories();
    setCategories(categoriesData);
  };

  const toggleCategory = (categoryId: string) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(selectedCategories.filter(id => id !== categoryId));
    } else {
      setSelectedCategories([...selectedCategories, categoryId]);
    }
  };

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };

  const handleMinPriceChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setPriceRange([numValue, priceRange[1]]);
  };

  const handleMaxPriceChange = (value: string) => {
    const numValue = parseInt(value) || 0;
    setPriceRange([priceRange[0], numValue]);
  };

  const applyFilters = () => {
    // In a real app, you would pass these filters back to the search screen
    // or store them in a global state management solution
    router.back();
  };

  const resetFilters = () => {
    setPriceRange([0, 5000]);
    setSelectedCategories([]);
    setShowAvailableOnly(true);
    setSortBy('rating');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Filters</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <X size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Price Range Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('price')}
          >
            <Text style={styles.sectionTitle}>Price Range</Text>
            {expandedSections.price ? (
              <ChevronUp size={20} color="#000" />
            ) : (
              <ChevronDown size={20} color="#000" />
            )}
          </TouchableOpacity>

          {expandedSections.price && (
            <View style={styles.priceInputs}>
              <View style={styles.priceInputContainer}>
                <Text style={styles.priceLabel}>Min (₱)</Text>
                <TextInput
                  style={styles.priceInput}
                  value={priceRange[0].toString()}
                  onChangeText={handleMinPriceChange}
                  keyboardType="numeric"
                />
              </View>
              <View style={styles.priceInputContainer}>
                <Text style={styles.priceLabel}>Max (₱)</Text>
                <TextInput
                  style={styles.priceInput}
                  value={priceRange[1].toString()}
                  onChangeText={handleMaxPriceChange}
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('categories')}
          >
            <Text style={styles.sectionTitle}>Categories</Text>
            {expandedSections.categories ? (
              <ChevronUp size={20} color="#000" />
            ) : (
              <ChevronDown size={20} color="#000" />
            )}
          </TouchableOpacity>

          {expandedSections.categories && (
            <View style={styles.categoriesList}>
              {categories.map(category => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryItem,
                    selectedCategories.includes(category.id) && styles.selectedCategory,
                  ]}
                  onPress={() => toggleCategory(category.id)}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategories.includes(category.id) && styles.selectedCategoryText,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Availability Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('availability')}
          >
            <Text style={styles.sectionTitle}>Availability</Text>
            {expandedSections.availability ? (
              <ChevronUp size={20} color="#000" />
            ) : (
              <ChevronDown size={20} color="#000" />
            )}
          </TouchableOpacity>

          {expandedSections.availability && (
            <View style={styles.switchContainer}>
              <Text style={styles.switchLabel}>Show available only</Text>
              <Switch
                value={showAvailableOnly}
                onValueChange={setShowAvailableOnly}
                trackColor={{ false: '#E0E0E0', true: '#C8E6C9' }}
                thumbColor={showAvailableOnly ? '#4CAF50' : '#FFF'}
              />
            </View>
          )}
        </View>

        {/* Sort By Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('sort')}
          >
            <Text style={styles.sectionTitle}>Sort By</Text>
            {expandedSections.sort ? (
              <ChevronUp size={20} color="#000" />
            ) : (
              <ChevronDown size={20} color="#000" />
            )}
          </TouchableOpacity>

          {expandedSections.sort && (
            <View style={styles.sortOptions}>
              <TouchableOpacity
                style={[styles.sortOption, sortBy === 'price_low' && styles.selectedSort]}
                onPress={() => setSortBy('price_low')}
              >
                <Text style={styles.sortText}>Price (Low to High)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortOption, sortBy === 'price_high' && styles.selectedSort]}
                onPress={() => setSortBy('price_high')}
              >
                <Text style={styles.sortText}>Price (High to Low)</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.sortOption, sortBy === 'rating' && styles.selectedSort]}
                onPress={() => setSortBy('rating')}
              >
                <Text style={styles.sortText}>Rating</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
          <Text style={styles.resetButtonText}>Reset All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  priceInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  priceInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  priceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  priceInput: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#000',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFF',
  },
  categoriesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  categoryItem: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F0F0F0',
  },
  selectedCategory: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#FFF',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  switchLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  sortOptions: {
    marginTop: 12,
  },
  sortOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  selectedSort: {
    backgroundColor: '#F0F8FF',
  },
  sortText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#333',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFF',
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 12,
  },
  resetButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#007AFF',
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 12,
  },
  applyButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#FFF',
  },
}); 