-- The problem is that when a user signs up, the trigger function tries to insert a row into public.users,
-- but there's no RLS policy to allow this insertion. Let's fix this:

-- 1. First, let's create an INSERT policy for the users table
CREATE POLICY "Allow trigger to create users" 
ON public.users FOR INSERT 
TO authenticated, anon
WITH CHECK (true);  -- This allows the trigger function to insert any row

-- 2. Update the handle_new_user function to ensure it runs with proper permissions
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, role, created_at, updated_at)
  VALUES (new.id, new.email, 'regular', now(), now());
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;  -- SECURITY DEFINER ensures it runs with elevated privileges

-- 3. Recreate the trigger to ensure it's using the updated function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 4. Let's also make sure there's a policy to allow users to view their own profile
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
CREATE POLICY "Users can view their own profile" 
ON public.users FOR SELECT 
USING (auth.uid() = id);

-- 5. Bonus: Add an explicit update policy if it doesn't already exist
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
CREATE POLICY "Users can update their own profile" 
ON public.users FOR UPDATE 
USING (auth.uid() = id);

-- Sanity check: Make sure there's a policy for admins to view/manage other users
DROP POLICY IF EXISTS "Admin can manage users" ON public.users;
CREATE POLICY "Admin can manage users" 
ON public.users 
USING (
  EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'admin'
  )
); 