import { supabase } from './supabase';
import {
  Bike,
  BikeWithImages,
  Category,
  Favorite,
  Rental,
  RentalShop,
  RentalWithDetails,
  Review,
  ReviewWithUser,
  ShopWithReviews,
  User,
} from '../types/supabase';

// User API
export const getCurrentUser = async (): Promise<User | null> => {
  const { data: session } = await supabase.auth.getSession();
  if (!session.session) return null;

  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', session.session.user.id)
    .single();

  return data;
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<User>
): Promise<{ data: User | null; error: any }> => {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
};

// Categories API
export const getCategories = async (): Promise<Category[]> => {
  const { data, error } = await supabase.from('categories').select('*');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
};

// Shops API
export const getRentalShops = async (): Promise<RentalShop[]> => {
  const { data, error } = await supabase
    .from('rental_shops')
    .select('*')
    .eq('is_approved', true);

  if (error) {
    console.error('Error fetching shops:', error);
    return [];
  }

  return data || [];
};

export const getRentalShopById = async (
  shopId: string
): Promise<ShopWithReviews | null> => {
  const { data, error } = await supabase
    .from('rental_shops')
    .select(`
      *,
      reviews:reviews(
        *,
        user:users(id, first_name, last_name, avatar_url)
      )
    `)
    .eq('id', shopId)
    .eq('is_approved', true)
    .single();

  if (error) {
    console.error('Error fetching shop:', error);
    return null;
  }

  // Calculate average rating
  if (data && data.reviews && data.reviews.length > 0) {
    const totalRating = data.reviews.reduce(
      (sum: number, review: ReviewWithUser) => sum + review.rating,
      0
    );
    data.avg_rating = parseFloat(
      (totalRating / data.reviews.length).toFixed(1)
    );
  } else {
    data.avg_rating = 0;
  }

  return data;
};

export const getNearbyShops = async (
  latitude: number,
  longitude: number,
  radius: number = 10 // km
): Promise<RentalShop[]> => {
  // Using a simple approximation for demo purposes
  // In a real app, you might want to use PostGIS or a more sophisticated approach
  const { data, error } = await supabase
    .from('rental_shops')
    .select('*')
    .eq('is_approved', true)
    .not('latitude', 'is', null)
    .not('longitude', 'is', null);

  if (error) {
    console.error('Error fetching nearby shops:', error);
    return [];
  }

  // Filter shops within the radius
  return (
    data?.filter((shop) => {
      if (!shop.latitude || !shop.longitude) return false;
      // Approximate distance calculation (haversine formula)
      const dLat = ((shop.latitude - latitude) * Math.PI) / 180;
      const dLon = ((shop.longitude - longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((latitude * Math.PI) / 180) *
          Math.cos((shop.latitude * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = 6371 * c; // Earth radius in km

      return distance <= radius;
    }) || []
  );
};

export const createRentalShop = async (
  shop: Omit<RentalShop, 'id' | 'is_approved' | 'created_at' | 'updated_at'>
): Promise<{ data: RentalShop | null; error: any }> => {
  const { data, error } = await supabase
    .from('rental_shops')
    .insert([{ ...shop, is_approved: false }])
    .select()
    .single();

  return { data, error };
};

// Bikes API
export const getBikesByShop = async (
  shopId: string
): Promise<BikeWithImages[]> => {
  const { data, error } = await supabase
    .from('bikes')
    .select(
      `
      *,
      images:bike_images(*),
      shop:rental_shops(*)
    `
    )
    .eq('shop_id', shopId)
    .eq('is_available', true);

  if (error) {
    console.error('Error fetching bikes:', error);
    return [];
  }

  return data || [];
};

export const getBikeById = async (
  bikeId: string
): Promise<BikeWithImages | null> => {
  const { data, error } = await supabase
    .from('bikes')
    .select(
      `
      *,
      images:bike_images(*),
      shop:rental_shops(*)
    `
    )
    .eq('id', bikeId)
    .single();

  if (error) {
    console.error('Error fetching bike:', error);
    return null;
  }

  return data;
};

export const searchBikes = async (
  query: string,
  categoryId?: string
): Promise<BikeWithImages[]> => {
  let bikeQuery = supabase
    .from('bikes')
    .select(
      `
      *,
      images:bike_images(*),
      shop:rental_shops!inner(*)
    `
    )
    .eq('is_available', true)
    .eq('shop.is_approved', true);

  if (categoryId) {
    bikeQuery = bikeQuery.eq('category', categoryId);
  }

  if (query) {
    bikeQuery = bikeQuery.or(
      `name.ilike.%${query}%,description.ilike.%${query}%,shop.name.ilike.%${query}%,shop.city.ilike.%${query}%`
    );
  }

  const { data, error } = await bikeQuery;

  if (error) {
    console.error('Error searching bikes:', error);
    return [];
  }

  return data || [];
};

// Rentals API
export const createRental = async (
  rental: Omit<
    Rental,
    'id' | 'status' | 'payment_status' | 'created_at' | 'updated_at'
  >
): Promise<{ data: Rental | null; error: any }> => {
  const { data, error } = await supabase
    .from('rentals')
    .insert([
      {
        ...rental,
        status: 'pending',
        payment_status: 'pending',
      },
    ])
    .select()
    .single();

  return { data, error };
};

export const searchRentalShops = async (query: string): Promise<ShopWithReviews[]> => {
  const { data, error } = await supabase
    .from('rental_shops')
    .select(`
      *,
      reviews:reviews(
        *,
        user:users(id, first_name, last_name, avatar_url)
      )
    `)
    .eq('is_approved', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,city.ilike.%${query}%,street_address.ilike.%${query}%`);

  if (error) {
    console.error('Error searching shops:', error);
    return [];
  }

  // Calculate average rating for each shop
  const shopsWithRatings = data?.map(shop => {
    if (shop.reviews && shop.reviews.length > 0) {
      const totalRating = shop.reviews.reduce(
        (sum: number, review: ReviewWithUser) => sum + review.rating,
        0
      );
      shop.avg_rating = parseFloat(
        (totalRating / shop.reviews.length).toFixed(1)
      );
    } else {
      shop.avg_rating = 0;
    }
    return shop;
  }) || [];

  return shopsWithRatings;
};

export const getUserRentals = async (
  userId: string
): Promise<RentalWithDetails[]> => {
  const { data, error } = await supabase
    .from('rentals')
    .select(
      `
      *,
      bike:bikes(*),
      shop:rental_shops(*),
      review:reviews(*)
    `
    )
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching user rentals:', error);
    return [];
  }

  return data || [];
};

export const getShopRentals = async (
  shopId: string
): Promise<RentalWithDetails[]> => {
  const { data, error } = await supabase
    .from('rentals')
    .select(
      `
      *,
      bike:bikes(*),
      shop:rental_shops(*),
      review:reviews(*)
    `
    )
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shop rentals:', error);
    return [];
  }

  return data || [];
};

export const updateRentalStatus = async (
  rentalId: string,
  status: Rental['status']
): Promise<{ data: Rental | null; error: any }> => {
  const { data, error } = await supabase
    .from('rentals')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', rentalId)
    .select()
    .single();

  return { data, error };
};

// Reviews API
export const createReview = async (
  review: Omit<Review, 'id' | 'created_at' | 'updated_at'>
): Promise<{ data: Review | null; error: any }> => {
  const { data, error } = await supabase
    .from('reviews')
    .insert([review])
    .select()
    .single();

  return { data, error };
};

export const getShopReviews = async (
  shopId: string
): Promise<ReviewWithUser[]> => {
  const { data, error } = await supabase
    .from('reviews')
    .select(
      `
      *,
      user:users(id, first_name, last_name, avatar_url)
    `
    )
    .eq('shop_id', shopId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching shop reviews:', error);
    return [];
  }

  return data || [];
};

export const replyToReview = async (
  reviewId: string,
  reply: string
): Promise<{ data: Review | null; error: any }> => {
  const { data, error } = await supabase
    .from('reviews')
    .update({
      reply,
      reply_date: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', reviewId)
    .select()
    .single();

  return { data, error };
};

// Favorites API
export const toggleFavorite = async (
  userId: string,
  bikeId: string
): Promise<boolean> => {
  // Check if favorite exists
  const { data: existingFavorite } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('bike_id', bikeId)
    .single();

  if (existingFavorite) {
    // Remove favorite
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('id', existingFavorite.id);

    return error ? false : true;
  } else {
    // Add favorite
    const { error } = await supabase.from('favorites').insert([
      {
        user_id: userId,
        bike_id: bikeId,
      },
    ]);

    return error ? false : true;
  }
};

export const getUserFavorites = async (
  userId: string
): Promise<BikeWithImages[]> => {
  const { data, error } = await supabase
    .from('favorites')
    .select(
      `
      bike_id,
      bike:bikes(
        *,
        images:bike_images(*),
        shop:rental_shops(*)
      )
    `
    )
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching favorites:', error);
    return [];
  }

  return (data?.map((fav: any) => fav.bike) || []) as BikeWithImages[];
};

export const isBikeFavorited = async (
  userId: string,
  bikeId: string
): Promise<boolean> => {
  const { data } = await supabase
    .from('favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('bike_id', bikeId)
    .single();

  return !!data;
}; 