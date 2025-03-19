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
import { Heart, MapPin, Star } from 'lucide-react-native';
import { BikeWithImages } from '../types/supabase';
import { toggleFavorite, isBikeFavorited } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

interface BikeCardProps {
  bike: BikeWithImages;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width / 2 - 24; // Two cards per row with spacing

export default function BikeCard({
  bike,
  isFavorite = false,
  onToggleFavorite,
}: BikeCardProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [favorite, setFavorite] = React.useState(isFavorite);
  const [loading, setLoading] = React.useState(false);

  // Find primary image or use first image
  const primaryImage = bike.images.find((img) => img.is_primary) || bike.images[0];
  const imageUrl = primaryImage?.image_url || 'https://via.placeholder.com/150';

  const handlePress = () => {
    router.push(`/bikes/${bike.id}` as any);
  };

  const handleFavoritePress = async () => {
    if (!user) {
      router.push('/auth/login' as any);
      return;
    }

    if (loading) return;

    setLoading(true);
    try {
      const success = await toggleFavorite(user.id, bike.id);
      if (success) {
        setFavorite(!favorite);
        if (onToggleFavorite) {
          onToggleFavorite();
        }
      }
    } catch (error) {
      console.error('Error toggling favorite', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />
        <TouchableOpacity
          style={styles.heartButton}
          onPress={handleFavoritePress}
        >
          <Heart
            size={20}
            color={favorite ? '#FF4B55' : '#FFF'}
            fill={favorite ? '#FF4B55' : 'none'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.bikeName} numberOfLines={1}>
          {bike.name}
        </Text>
        <View style={styles.locationContainer}>
          <MapPin size={14} color="#666" />
          <Text style={styles.locationText} numberOfLines={1}>
            {bike.shop.city}
          </Text>
        </View>
        <View style={styles.ratingContainer}>
          <Star size={14} color="#FFB800" fill="#FFB800" />
          <Text style={styles.ratingText}>
            {/* This would come from the shop's average rating */}
            4.5 (24 reviews)
          </Text>
        </View>
        <Text style={styles.priceText}>₱{bike.price_per_day}/day</Text>
      </View>
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
    margin: 8,
  },
  imageContainer: {
    position: 'relative',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  heartButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 20,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoContainer: {
    padding: 12,
  },
  bikeName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
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
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ratingText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  priceText: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: '#007AFF',
  },
}); 