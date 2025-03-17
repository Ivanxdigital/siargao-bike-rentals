import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Star, Heart } from 'lucide-react-native';

const FAVORITE_BIKES = [
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
  {
    id: '3',
    name: 'Kawasaki KLX 150',
    location: 'Pacifico',
    rating: 4.9,
    reviews: 156,
    price: 550,
    image: 'https://images.unsplash.com/photo-1609630875289-22852fa678ce?auto=format&fit=crop&w=800&q=80',
  },
];

export default function FavoritesScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Favorites</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {FAVORITE_BIKES.map((bike) => (
          <TouchableOpacity key={bike.id} style={styles.bikeCard}>
            <Image source={{ uri: bike.image }} style={styles.bikeImage} />
            <View style={styles.bikeInfo}>
              <View style={styles.bikeHeader}>
                <Text style={styles.bikeName}>{bike.name}</Text>
                <TouchableOpacity style={styles.heartButton}>
                  <Heart size={20} color="#FF4B55" fill="#FF4B55" />
                </TouchableOpacity>
              </View>
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

        {FAVORITE_BIKES.length === 0 && (
          <View style={styles.emptyState}>
            <Heart size={48} color="#666" />
            <Text style={styles.emptyStateTitle}>No favorites yet</Text>
            <Text style={styles.emptyStateText}>
              Start exploring and save your favorite bikes here
            </Text>
          </View>
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
  bikeCard: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    overflow: 'hidden',
  },
  bikeImage: {
    width: '100%',
    height: 200,
  },
  bikeInfo: {
    padding: 16,
  },
  bikeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  bikeName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
    flex: 1,
  },
  heartButton: {
    padding: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
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
    marginBottom: 8,
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
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    marginTop: 80,
  },
  emptyStateTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});