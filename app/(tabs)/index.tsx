import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { BikeWithImages, Category, RentalShop } from '../../types/supabase';
import { getCategories, getBikesByShop, getRentalShops, getNearbyShops } from '../../lib/api';
import BikeCard from '../../components/BikeCard';
import ShopCard from '../../components/ShopCard';

export default function HomeScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredBikes, setFeaturedBikes] = useState<BikeWithImages[]>([]);
  const [nearbyShops, setNearbyShops] = useState<RentalShop[]>([]);
  const [locationPermission, setLocationPermission] = useState(false);
  const [locationError, setLocationError] = useState(false);

  // Fetch initial data
  useEffect(() => {
    loadData();
    checkLocationPermission();
  }, []);

  // Check location permissions
  const checkLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        setLocationPermission(true);
        fetchNearbyShops();
      } else {
        console.log('Location permission denied');
        setLocationError(true);
        // Load all shops instead of nearby
        loadAllShops();
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      setLocationError(true);
      // Load all shops instead of nearby
      loadAllShops();
    }
  };

  // Fetch all shops as fallback when location is unavailable
  const loadAllShops = async () => {
    try {
      const shops = await getRentalShops();
      setNearbyShops(shops.slice(0, 3)); // Just show first 3 shops
    } catch (error) {
      console.error('Error getting all shops:', error);
    }
  };

  // Fetch nearby shops if location permission is granted
  const fetchNearbyShops = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced, // Lower accuracy for faster results
        timeInterval: 5000, // 5 second timeout
      }).catch(error => {
        console.error('Location error:', error);
        throw error;
      });
      
      const shops = await getNearbyShops(
        location.coords.latitude,
        location.coords.longitude,
        10 // 10km radius
      );
      setNearbyShops(shops);
    } catch (error) {
      console.error('Error getting nearby shops:', error);
      setLocationError(true);
      // Fallback to all shops
      loadAllShops();
    }
  };

  // Load all required data
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Get all categories
      const categoriesData = await getCategories();
      setCategories(categoriesData);
      
      // Get all approved shops
      const shops = await getRentalShops();
      
      // Get featured bikes from the first shop (in a real app, you might have a different logic for featured bikes)
      if (shops.length > 0) {
        const bikes = await getBikesByShop(shops[0].id);
        setFeaturedBikes(bikes.slice(0, 5)); // Take the first 5 bikes
      }
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    if (locationPermission) {
      await fetchNearbyShops();
    }
    setRefreshing(false);
  };

  // Navigate to category page
  const handleCategoryPress = (category: Category) => {
    router.push({
      pathname: '/search' as any,
      params: { category: category.id }
    });
  };

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Find your perfect ride</Text>
        </View>

        <Text style={styles.sectionTitle}>Featured Bikes</Text>
        {featuredBikes.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredContainer}
          >
            {featuredBikes.map((bike) => (
              <View key={bike.id} style={styles.featuredBikeWrapper}>
                <BikeCard bike={bike} />
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No featured bikes available</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDescription} numberOfLines={2}>
                {category.description}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {nearbyShops.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>
              {locationPermission && !locationError ? 'Nearby Rental Shops' : 'Popular Rental Shops'}
            </Text>
            <View style={styles.shopsContainer}>
              {nearbyShops.map((shop) => (
                <ShopCard key={shop.id} shop={shop as any} />
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8F9FA',
  },
  header: {
    padding: 20,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: '#000',
    marginTop: 4,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#000',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 12,
  },
  featuredContainer: {
    paddingHorizontal: 12,
  },
  featuredBikeWrapper: {
    margin: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
  },
  categoryCard: {
    width: '46%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    margin: 8,
  },
  categoryName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000',
  },
  categoryDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
  },
  shopsContainer: {
    paddingHorizontal: 12,
  },
});