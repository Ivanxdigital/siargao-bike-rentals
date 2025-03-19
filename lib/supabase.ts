import 'react-native-url-polyfill/auto';
import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';

// SecureStore adapter for persisting session data
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

// Get Supabase URL and anon key directly from environment variables
// Note: In Expo, we can access the variables directly from process.env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key length:', supabaseAnonKey ? supabaseAnonKey.length : 0);

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Test connection and log result
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
});

// Helper function to get session
export const getSession = async () => {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    return data.session;
  } catch (error) {
    console.error('Exception getting session:', error);
    return null;
  }
};

// Helper function to get user
export const getUser = async () => {
  const session = await getSession();
  return session?.user || null;
};

// Helper to check if user is a shop owner
export const isShopOwner = async () => {
  const user = await getUser();
  if (!user) return false;
  
  try {
    // Check user's role in the database
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (error || !data) return false;
    return data.role === 'rental_shop';
  } catch (error) {
    console.error('Error checking shop owner status:', error);
    return false;
  }
};

// Helper to check if user is an admin
export const isAdmin = async () => {
  const user = await getUser();
  if (!user) return false;
  
  try {
    // Check user's role in the database
    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();
      
    if (error || !data) return false;
    return data.role === 'admin';
  } catch (error) {
    console.error('Error checking admin status:', error);
    return false;
  }
}; 