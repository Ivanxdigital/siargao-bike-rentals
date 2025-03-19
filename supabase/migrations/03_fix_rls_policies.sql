-- Drop the problematic policy that causes infinite recursion
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;

-- Create a new policy that avoids the recursion by checking the role directly from auth.jwt()
-- This way, it doesn't need to query the users table to check if a user is an admin
CREATE POLICY "Admin can view all users" 
ON public.users FOR SELECT 
USING (
  (SELECT role FROM auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Alternative approach if the above doesn't work:
-- Create a security definer function to check admin status
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Then create a policy that uses this function
DROP POLICY IF EXISTS "Admin can view all users alternative" ON public.users;
CREATE POLICY "Admin can view all users alternative" 
ON public.users FOR SELECT 
USING (
  public.is_admin() OR auth.uid() = id
);

-- Another fix for rental_shops to avoid infinite recursion
DROP POLICY IF EXISTS "Anyone can view approved rental shops" ON public.rental_shops;
CREATE POLICY "Anyone can view approved rental shops" 
ON public.rental_shops FOR SELECT 
USING (
  is_approved = true OR 
  owner_id = auth.uid() OR
  (SELECT role FROM auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
); 