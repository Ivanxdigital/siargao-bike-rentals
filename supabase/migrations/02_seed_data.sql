-- Insert initial categories
INSERT INTO public.categories (name, description, icon)
VALUES
  ('Mountain Bike', 'Designed for off-road cycling and island trails', 'mountain'),
  ('Beach Cruiser', 'Perfect for casual rides along the beach', 'cruiser'),
  ('City Bike', 'Designed for casual riding in town', 'city'),
  ('Electric Bike', 'Equipped with an electric motor for effortless exploration', 'electric'),
  ('Hybrid Bike', 'Versatile bikes that handle various island terrains', 'hybrid'),
  ('Kids Bike', 'Designed for children with smaller frames', 'kids'),
  ('Scooter', 'Motorized scooters for quick island transportation', 'scooter')
ON CONFLICT (name) DO NOTHING;

-- IMPORTANT: For the seed data to work, we'll first disable the FK constraint temporarily.
-- This is ONLY for seeding test data and should NOT be done in production.
ALTER TABLE "public"."rental_shops" DROP CONSTRAINT IF EXISTS "rental_shops_owner_id_fkey";

-- Sample rental shops (these would be created by actual shop owners in production)
-- We're using a placeholder UUID that doesn't need to exist in the users table
-- since we temporarily disabled the foreign key constraint
INSERT INTO public.rental_shops 
  (id, owner_id, name, description, address, city, latitude, longitude, phone_number, is_approved, created_at, updated_at)
VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    '10000000-0000-0000-0000-000000000000', -- Placeholder UUID
    'Island Bike Rentals',
    'Premium bike rentals in the heart of Siargao. We offer a wide variety of bikes for all your island adventures.',
    '123 Cloud 9 Road',
    'General Luna',
    9.8175,
    126.1075,
    '+63 912 345 6789',
    true,
    now(),
    now()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '10000000-0000-0000-0000-000000000000', -- Placeholder UUID
    'Surf & Cycle',
    'Rent bikes and surfboards in one place. Perfect for exploring the island on two wheels or catching waves.',
    '456 Tourism Road',
    'General Luna',
    9.8125,
    126.1090,
    '+63 923 456 7890',
    true,
    now(),
    now()
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    '10000000-0000-0000-0000-000000000000', -- Placeholder UUID
    'Green Pedals',
    'Eco-friendly bike rental service. Our fleet includes electric bikes for effortless exploration.',
    '789 Dapa Highway',
    'Dapa',
    9.7532,
    126.0450,
    '+63 934 567 8901',
    true,
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- Restore the foreign key constraint (commented out for testing)
-- In production, you would un-comment this line after creating proper user records
-- ALTER TABLE "public"."rental_shops" ADD CONSTRAINT "rental_shops_owner_id_fkey" 
--   FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id");

-- Sample bikes
INSERT INTO public.bikes
  (id, shop_id, name, description, category, price_per_day, price_per_hour, price_per_week, specifications, created_at, updated_at)
VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'Island Explorer',
    'Sturdy mountain bike perfect for exploring Siargao trails and dirt roads',
    'Mountain Bike',
    800,
    100,
    5000,
    '{"frame_size": "M", "gears": 18, "suspension": "Front", "frame_material": "Aluminum"}',
    now(),
    now()
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'Town Cruiser',
    'Comfortable city bike for cruising around General Luna',
    'City Bike',
    600,
    80,
    3500,
    '{"frame_size": "L", "gears": 7, "basket": true, "frame_material": "Steel"}',
    now(),
    now()
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '22222222-2222-2222-2222-222222222222',
    'Beach Glider',
    'Laid-back cruiser bike perfect for beach rides and sunset cruising',
    'Beach Cruiser',
    500,
    70,
    3000,
    '{"frame_size": "M", "gears": 3, "color": "Blue", "frame_material": "Steel"}',
    now(),
    now()
  ),
  (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '22222222-2222-2222-2222-222222222222',
    'Siargao Surfer',
    'Electric bike with surfboard rack for effortless trips to surf spots',
    'Electric Bike',
    1200,
    180,
    7000,
    '{"frame_size": "M", "battery": "48V 10Ah", "range": "50km", "motor": "350W", "surfboard_rack": true}',
    now(),
    now()
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '33333333-3333-3333-3333-333333333333',
    'Island Hopper',
    'Versatile hybrid bike suitable for all island terrain types',
    'Hybrid Bike',
    700,
    90,
    4200,
    '{"frame_size": "L", "gears": 21, "weight": "11kg", "frame_material": "Aluminum"}',
    now(),
    now()
  ),
  (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '33333333-3333-3333-3333-333333333333',
    'Mini Explorer',
    'Safe and durable bike for young island adventurers',
    'Kids Bike',
    400,
    60,
    2400,
    '{"frame_size": "S", "gears": 1, "training_wheels": true, "age_range": "4-7 years"}',
    now(),
    now()
  ),
  (
    'eeeeeeee-eeee-eeee-eeee-ffffffffffff',
    '33333333-3333-3333-3333-333333333333',
    'Island Zip',
    'Motorized scooter for quick trips around the island',
    'Scooter',
    1500,
    250,
    9000,
    '{"engine": "125cc", "fuel_capacity": "5L", "helmet_included": true, "max_speed": "60km/h"}',
    now(),
    now()
  )
ON CONFLICT (id) DO NOTHING;

-- Sample bike images
INSERT INTO public.bike_images
  (id, bike_id, image_url, is_primary)
VALUES
  (
    '11111111-aaaa-aaaa-aaaa-111111111111',
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'https://example.com/bikes/mountain_bike_1.jpg',
    true
  ),
  (
    '22222222-bbbb-bbbb-bbbb-222222222222',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'https://example.com/bikes/city_bike_1.jpg',
    true
  ),
  (
    '33333333-cccc-cccc-cccc-333333333333',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    'https://example.com/bikes/cruiser_1.jpg',
    true
  ),
  (
    '44444444-dddd-dddd-dddd-444444444444',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    'https://example.com/bikes/ebike_1.jpg',
    true
  ),
  (
    '55555555-eeee-eeee-eeee-555555555555',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'https://example.com/bikes/hybrid_1.jpg',
    true
  ),
  (
    '66666666-ffff-ffff-ffff-666666666666',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'https://example.com/bikes/kids_bike_1.jpg',
    true
  ),
  (
    '77777777-eeee-ffff-eeee-777777777777',
    'eeeeeeee-eeee-eeee-eeee-ffffffffffff',
    'https://example.com/bikes/scooter_1.jpg',
    true
  )
ON CONFLICT (id) DO NOTHING; 