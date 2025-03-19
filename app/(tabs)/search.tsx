import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, Sliders, MapPin, Bike, Store } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BikeWithImages, ShopWithReviews } from '../../types/supabase';
import { searchBikes, searchRentalShops } from '../../lib/api';
import BikeCard from '../../components/BikeCard';
import ShopCard from '../../components/ShopCard';

const MAX_RECENT_SEARCHES = 5;

const POPULAR_LOCATIONS = [
  'General Luna',
  'Cloud 9',
  'Pacifico',
  'Dapa',
];

export default function SearchScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    bikes: BikeWithImages[];
    shops: ShopWithReviews[];
  }>({ bikes: [], shops: [] });
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    loadRecentSearches();
  }, []);

  const loadRecentSearches = async () => {
    try {
      const searches = await AsyncStorage.getItem('recentSearches');
      if (searches) {
        setRecentSearches(JSON.parse(searches));
      }
    } catch (error) {
      console.error('Failed to load recent searches', error);
    }
  };

  const saveSearch = async (query: string) => {
    try {
      let searches = [...recentSearches];
      // Remove if already exists (to move to top)
      searches = searches.filter(s => s !== query);
      // Add to beginning of array
      searches.unshift(query);
      // Limit to max items
      searches = searches.slice(0, MAX_RECENT_SEARCHES);
      
      setRecentSearches(searches);
      await AsyncStorage.setItem('recentSearches', JSON.stringify(searches));
    } catch (error) {
      console.error('Failed to save recent search', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setShowResults(true);
    Keyboard.dismiss();

    try {
      const [bikes, shops] = await Promise.all([
        searchBikes(searchQuery),
        searchRentalShops(searchQuery),
      ]);
      
      setSearchResults({ bikes, shops });
      saveSearch(searchQuery);
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchItemPress = (query: string) => {
    setSearchQuery(query);
    setTimeout(() => handleSearch(), 100);
  };

  const handleLocationPress = (location: string) => {
    setSearchQuery(location);
    setTimeout(() => handleSearch(), 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            placeholder="Search bikes, shops, locations..."
            style={styles.searchInput}
            placeholderTextColor="#666"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={() => router.push('/filter' as any)}>
          <Sliders size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {isSearching ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Searching...</Text>
          </View>
        ) : showResults ? (
          <View style={styles.resultsContainer}>
            {searchResults.bikes.length === 0 && searchResults.shops.length === 0 ? (
              <View style={styles.noResultsContainer}>
                <Text style={styles.noResultsText}>No results found for "{searchQuery}"</Text>
                <Text style={styles.noResultsSubText}>Try a different search term or browse categories</Text>
              </View>
            ) : (
              <>
                {searchResults.bikes.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Bike size={18} color="#007AFF" />
                      <Text style={styles.sectionTitle}>Bikes ({searchResults.bikes.length})</Text>
                    </View>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.bikesContainer}>
                      {searchResults.bikes.map((bike) => (
                        <BikeCard key={bike.id} bike={bike} />
                      ))}
                    </ScrollView>
                  </View>
                )}

                {searchResults.shops.length > 0 && (
                  <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                      <Store size={18} color="#007AFF" />
                      <Text style={styles.sectionTitle}>Shops ({searchResults.shops.length})</Text>
                    </View>
                    {searchResults.shops.map((shop) => (
                      <ShopCard key={shop.id} shop={shop} />
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              {recentSearches.length > 0 ? (
                recentSearches.map((search, index) => (
                  <TouchableOpacity 
                    key={index} 
                    style={styles.searchItem}
                    onPress={() => handleSearchItemPress(search)}
                  >
                    <SearchIcon size={16} color="#666" />
                    <Text style={styles.searchItemText}>{search}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.emptyStateText}>No recent searches</Text>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Locations</Text>
              {POPULAR_LOCATIONS.map((location, index) => (
                <TouchableOpacity 
                  key={index} 
                  style={styles.searchItem}
                  onPress={() => handleLocationPress(location)}
                >
                  <MapPin size={16} color="#666" />
                  <Text style={styles.searchItemText}>{location}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#000',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  section: {
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 12,
    marginLeft: 6,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  searchItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#000',
    marginLeft: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: '#666',
    marginTop: 12,
  },
  resultsContainer: {
    paddingBottom: 20,
  },
  bikesContainer: {
    paddingVertical: 10,
    gap: 15,
  },
  noResultsContainer: {
    alignItems: 'center',
    padding: 40,
  },
  noResultsText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    padding: 12,
  },
}); 