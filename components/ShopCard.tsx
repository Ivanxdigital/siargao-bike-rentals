import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin, Star } from 'lucide-react-native';
import { ShopWithReviews } from '../types/supabase';

interface ShopCardProps {
  shop: ShopWithReviews;
}

const { width } = Dimensions.get('window');
const cardWidth = width - 32; // Full width with margins

export default function ShopCard({ shop }: ShopCardProps) {
  const router = useRouter();

  const logoUrl = shop.logo_url || 'https://via.placeholder.com/80';
  const reviewCount = shop.reviews?.length || 0;
  const avgRating = shop.avg_rating || 0;

  const handlePress = () => {
    router.push(`/shops/${shop.id}` as any);
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.container}>
        <Image source={{ uri: logoUrl }} style={styles.logo} />
        <View style={styles.infoContainer}>
          <Text style={styles.shopName} numberOfLines={1}>
            {shop.name}
          </Text>
          <View style={styles.locationContainer}>
            <MapPin size={14} color="#666" />
            <Text style={styles.locationText} numberOfLines={1}>
              {shop.address}, {shop.city}
            </Text>
          </View>
          <View style={styles.ratingContainer}>
            <Star
              size={14}
              color={reviewCount > 0 ? '#FFB800' : '#CCC'}
              fill={reviewCount > 0 ? '#FFB800' : '#CCC'}
            />
            <Text style={styles.ratingText}>
              {reviewCount > 0
                ? `${avgRating.toFixed(1)} (${reviewCount} reviews)`
                : 'No reviews yet'}
            </Text>
          </View>
        </View>
      </View>
      {shop.description ? (
        <Text style={styles.description} numberOfLines={2}>
          {shop.description}
        </Text>
      ) : null}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    padding: 16,
    margin: 8,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 70,
    height: 70,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
    marginLeft: 12,
  },
  shopName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: '#000',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  locationText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#666',
    marginTop: 12,
    lineHeight: 20,
  },
}); 