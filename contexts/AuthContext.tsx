import React, { createContext, useState, useContext, useEffect } from 'react';
import { supabase, getUser } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

// Define the type for the AuthContext
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signUp: (email: string, password: string, role: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  isShopOwner: boolean;
  isAdmin: boolean;
};

// Create the context with default values
const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signUp: async () => ({ error: null }),
  signIn: async () => ({ error: null }),
  signOut: async () => {},
  isShopOwner: false,
  isAdmin: false,
});

// Provider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isShopOwner, setIsShopOwner] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for existing session on mount
    getSessionAndUser();

    // Subscribe to auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('Auth state change:', event);
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
        if (currentSession?.user) {
          await getUserRole(currentSession.user.id);
        }
      }
    );

    return () => {
      // Clean up subscription
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Get initial session
  const getSessionAndUser = async () => {
    try {
      setLoading(true);
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        await getUserRole(currentSession.user.id);
      }
    } catch (error) {
      console.error('Error getting session:', error);
    } finally {
      setLoading(false);
    }
  };

  // Get user role from the database
  const getUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      setIsShopOwner(data?.role === 'rental_shop');
      setIsAdmin(data?.role === 'admin');
    } catch (error) {
      console.error('Error getting user role:', error);
      setIsShopOwner(false);
      setIsAdmin(false);
    }
  };

  // Sign up a new user
  const signUp = async (email: string, password: string, role: string) => {
    try {
      console.log('Signing up with:', { email, role });
      
      // We won't insert the user record manually - the trigger function will handle it
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            role: role // Store role in the user metadata
          }
        }
      });
      
      if (error) {
        console.error('Signup error:', error);
        throw error;
      }
      
      console.log('Signup successful, user:', data.user?.id);
      return { error: null };
    } catch (error: any) {
      console.error('Error signing up:', error);
      
      // Create a more user-friendly error message
      let errorMessage = 'An error occurred during signup. Please try again.';
      
      if (error.message) {
        if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return { 
        error: { 
          ...error, 
          message: errorMessage 
        } 
      };
    }
  };

  // Sign in existing user
  const signIn = async (email: string, password: string) => {
    try {
      console.log('Signing in with:', email);
      const { error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      });
      
      if (error) throw error;
      return { error: null };
    } catch (error: any) {
      console.error('Error signing in:', error);
      
      // Create a more user-friendly error message
      let errorMessage = 'An error occurred during sign in. Please try again.';
      
      if (error.message) {
        if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your internet connection and try again.';
        } else if (error.message.includes('Invalid login')) {
          errorMessage = 'Invalid email or password. Please try again.';
        } else {
          errorMessage = error.message;
        }
      }
      
      return { 
        error: { 
          ...error, 
          message: errorMessage 
        } 
      };
    }
  };

  // Sign out
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setIsShopOwner(false);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const value = {
    session,
    user,
    loading,
    signUp,
    signIn,
    signOut,
    isShopOwner,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 