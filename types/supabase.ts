export type UserRole = 'regular' | 'rental_shop' | 'admin';

export type RentalStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  avatar_url?: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface RentalShop {
  id: string;
  owner_id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  latitude?: number;
  longitude?: number;
  phone_number?: string;
  website?: string;
  opening_hours?: {
    [key: string]: {
      open: string;
      close: string;
    };
  };
  logo_url?: string;
  banner_url?: string;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface BikeSpecifications {
  frame_size?: string;
  gears?: number;
  suspension?: string;
  frame_material?: string;
  basket?: boolean;
  color?: string;
  weight?: string;
  training_wheels?: boolean;
  age_range?: string;
  battery?: string;
  range?: string;
  motor?: string;
  surfboard_rack?: boolean;
  engine?: string;
  fuel_capacity?: string;
  helmet_included?: boolean;
  max_speed?: string;
  [key: string]: any;
}

export interface Bike {
  id: string;
  shop_id: string;
  name: string;
  description?: string;
  category: string;
  price_per_day: number;
  price_per_hour?: number;
  price_per_week?: number;
  is_available: boolean;
  specifications?: BikeSpecifications;
  created_at: string;
  updated_at: string;
}

export interface BikeImage {
  id: string;
  bike_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

export interface Rental {
  id: string;
  bike_id: string;
  user_id: string;
  shop_id: string;
  start_date: string;
  end_date: string;
  total_price: number;
  status: RentalStatus;
  payment_status: PaymentStatus;
  created_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  shop_id: string;
  bike_id?: string;
  user_id: string;
  rental_id: string;
  rating: number;
  comment?: string;
  reply?: string;
  reply_date?: string;
  created_at: string;
  updated_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  bike_id: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  created_at: string;
  updated_at: string;
}

// Extended types with joined data

export interface BikeWithImages extends Bike {
  images: BikeImage[];
  shop: RentalShop;
}

export interface RentalWithDetails extends Rental {
  bike: Bike;
  shop: RentalShop;
  review?: Review;
}

export interface ReviewWithUser extends Review {
  user: {
    id: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  };
}

export interface ShopWithReviews extends RentalShop {
  reviews: ReviewWithUser[];
  avg_rating?: number;
} 