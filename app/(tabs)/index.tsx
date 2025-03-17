import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Star } from 'lucide-react-native';

const FEATURED_BIKES = [
  {
    id: '1',
    name: 'Honda XR 150L',
    location: 'General Luna',
    rating: 4.8,
    reviews: 124,
    price: 500,
    image: 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    name: 'Yamaha XTZ 125',
    location: 'Cloud 9',
    rating: 4.7,
    reviews: 98,
    price: 450,
    image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=800&q=80',
  },
];

const CATEGORIES = [
  { id: '1', name: 'Dirt Bikes', count: 24 },
  { id: '2', name: 'Scooters', count: 18 },
  { id: '3', name: 'Adventure', count: 12 },
  { id: '4', name: 'Sport', count: 8 },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Good morning</Text>
          <Text style={styles.title}>Find your perfect ride</Text>
        </View>

        <Text style={styles.sectionTitle}>Featured Bikes</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredContainer}>
          {FEATURED_BIKES.map((bike) => (
            <TouchableOpacity key={bike.id} style={styles.bikeCard}>
              <Image source={{ uri: bike.image }} style={styles.bikeImage} />
              <View style={styles.bikeInfo}>
                <Text style={styles.bikeName}>{bike.name}</Text>
                <View style={styles.locationContainer}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.locationText}>{bike.location}</Text>
                </View>
                <View style={styles.ratingContainer}>
                  <Star size={14} color="#FFB800" fill="#FFB800" />
                  <Text style={styles.ratingText}>
                    {bike.rating} ({bike.reviews} reviews)
                  </Text>
                </View>
                <Text style={styles.priceText}>₱{bike.price}/day</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity key={category.id} style={styles.categoryCard}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count} bikes</Text>
            </TouchableOpacity>
          ))}
        </View>
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
    paddingHorizontal: 20,
  },
  bikeCard: {
    width: 280,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bikeImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  bikeInfo: {
    padding: 16,
  },
  bikeName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  ratingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  priceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#007AFF',
    marginTop: 8,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  categoryName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000',
  },
  categoryCount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});