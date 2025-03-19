import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

// Component to require authentication for certain screens
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth' as any;

    if (!user && !inAuthGroup) {
      // If not authenticated and not in auth group, redirect to login
      router.replace('/auth/login' as any);
    } else if (user && inAuthGroup) {
      // If authenticated and in auth group, redirect to home
      router.replace('/(tabs)');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <>{children}</>;
}

// Component to require shop owner role
export function RequireShopOwner({ children }: { children: React.ReactNode }) {
  const { isShopOwner, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isShopOwner) {
      // If not a shop owner, redirect to home
      router.replace('/(tabs)');
    }
  }, [isShopOwner, loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <>{children}</>;
}

// Component to require admin role
export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (!isAdmin) {
      // If not an admin, redirect to home
      router.replace('/(tabs)');
    }
  }, [isAdmin, loading]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 