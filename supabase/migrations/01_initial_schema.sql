-- Create users table extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up storage for profile and bike images
INSERT INTO storage.buckets (id, name) VALUES ('profiles', 'profiles')
ON CONFLICT DO NOTHING;

INSERT INTO storage.buckets (id, name) VALUES ('bikes', 'bikes')
ON CONFLICT DO NOTHING;

-- Create users table to store user roles and profiles
CREATE TABLE IF NOT EXISTS public.users (
    id UUID REFERENCES auth.users NOT NULL PRIMARY KEY,
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone_number TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL CHECK (role IN ('regular', 'rental_shop', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create rental shops table
CREATE TABLE IF NOT EXISTS public.rental_shops (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID REFERENCES public.users NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    latitude NUMERIC,
    longitude NUMERIC,
    phone_number TEXT,
    website TEXT,
    opening_hours JSONB,  -- Store as JSON for flexibility
    logo_url TEXT,
    banner_url TEXT,
    is_approved BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create bikes table
CREATE TABLE IF NOT EXISTS public.bikes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES public.rental_shops NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL,
    price_per_day NUMERIC NOT NULL,
    price_per_hour NUMERIC,
    price_per_week NUMERIC,
    is_available BOOLEAN DEFAULT true NOT NULL,
    specifications JSONB,  -- Store specs like size, gears, etc. as JSON
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create bike_images table
CREATE TABLE IF NOT EXISTS public.bike_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bike_id UUID REFERENCES public.bikes NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create rentals table
CREATE TABLE IF NOT EXISTS public.rentals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    bike_id UUID REFERENCES public.bikes NOT NULL,
    user_id UUID REFERENCES public.users NOT NULL,
    shop_id UUID REFERENCES public.rental_shops NOT NULL,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    total_price NUMERIC NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
    payment_status TEXT NOT NULL CHECK (payment_status IN ('pending', 'paid', 'refunded')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shop_id UUID REFERENCES public.rental_shops NOT NULL,
    bike_id UUID REFERENCES public.bikes,  -- Optional, can be null if review is for shop only
    user_id UUID REFERENCES public.users NOT NULL,
    rental_id UUID REFERENCES public.rentals NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    reply TEXT,  -- For shop owner replies
    reply_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users NOT NULL,
    bike_id UUID REFERENCES public.bikes NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    UNIQUE(user_id, bike_id)
);

-- Create categories table for predefined bike categories
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    icon TEXT,  -- Icon name or URL
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Set up Row Level Security (RLS)
-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bike_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users policies
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Admin can view all users" 
ON public.users FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Rental shops policies
CREATE POLICY "Anyone can view approved rental shops" 
ON public.rental_shops FOR SELECT 
USING (is_approved = true OR (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND (role = 'admin' OR id = owner_id)
  )
));

CREATE POLICY "Shop owners can update their own shops" 
ON public.rental_shops FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND id = owner_id
  )
);

CREATE POLICY "Shop owners can insert their own shops" 
ON public.rental_shops FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'rental_shop'
  )
);

CREATE POLICY "Admin can update any shop" 
ON public.rental_shops FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- Bikes policies
CREATE POLICY "Anyone can view available bikes from approved shops" 
ON public.bikes FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.rental_shops
    WHERE id = shop_id AND is_approved = true
  ) OR (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid() AND role = 'admin'
    )
  ) OR (
    EXISTS (
      SELECT 1 FROM public.rental_shops rs
      JOIN public.users u ON rs.owner_id = u.id
      WHERE rs.id = shop_id AND u.id = auth.uid()
    )
  )
);

CREATE POLICY "Shop owners can manage their own bikes" 
ON public.bikes FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.rental_shops rs
    JOIN public.users u ON rs.owner_id = u.id
    WHERE rs.id = shop_id AND u.id = auth.uid()
  )
);

-- Create a function to handle user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (new.id, new.email, 'regular', now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call the function on user creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user(); 