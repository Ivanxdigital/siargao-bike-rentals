-- Fix for infinite recursion in the users policy
-- The issue occurs because a policy is checking itself recursively

-- Drop the problematic admin policy that's causing recursion
DROP POLICY IF EXISTS "Admin can manage users" ON public.users;

-- Create a fixed version that doesn't cause recursion
CREATE POLICY "Admin can manage users" 
ON public.users FOR ALL
USING (
  (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- Update the bikes viewing policy to avoid recursion
DROP POLICY IF EXISTS "Anyone can view available bikes from approved shops" ON public.bikes;

CREATE POLICY "Anyone can view available bikes from approved shops" 
ON public.bikes FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.rental_shops
    WHERE id = shop_id AND is_approved = true
  ) OR (
    (SELECT role FROM auth.users WHERE id = auth.uid()) = 'admin'
  ) OR (
    EXISTS (
      SELECT 1 FROM public.rental_shops rs
      WHERE rs.id = shop_id AND rs.owner_id = auth.uid()
    )
  )
);

-- Ensure we have enable row level security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rental_shops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rentals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY; 