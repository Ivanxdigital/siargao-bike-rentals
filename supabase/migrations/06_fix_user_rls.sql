-- Drop all existing policies on the users table to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Admin can view all users" ON public.users;
DROP POLICY IF EXISTS "Admin can manage users" ON public.users;
DROP POLICY IF EXISTS "Admin can view all users alternative" ON public.users;

-- Create a simpler policy that allows all authenticated users to read the users table
-- This is more permissive but solves immediate issues
CREATE POLICY "Authenticated users can view users" 
ON public.users FOR SELECT 
TO authenticated
USING (true);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
TO authenticated
USING (auth.uid() = id);

-- Allow users to view their own data without recursion
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- For admins to manage users, use a simpler approach without recursion
CREATE POLICY "Admins can manage all users" 
ON public.users FOR ALL 
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM auth.users
    WHERE id = auth.uid() AND raw_user_meta_data->>'role' = 'admin'
  )
);

-- Ensure service role can access everything
CREATE POLICY "Service role has full access to users" 
ON public.users 
FOR ALL 
TO service_role
USING (true); 