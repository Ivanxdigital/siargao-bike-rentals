import { ExpoConfig, ConfigContext } from 'expo/config';

// Read from environment variables or .env file
export default ({ config }: ConfigContext): ExpoConfig => {
  return {
    ...config,
    name: 'Siargao Bike Rentals',
    slug: 'siargao-bike-rentals',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'siargaobikerentals',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    updates: {
      fallbackToCacheTimeout: 0,
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      infoPlist: {
        NSLocationWhenInUseUsageDescription:
          'This app uses your location to find bike rentals near you.',
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      permissions: ['ACCESS_FINE_LOCATION'],
    },
    web: {
      bundler: 'metro',
      output: 'single',
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router', 'expo-location'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      // Load environment variables
      supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL,
      supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
      eas: {
        projectId: 'siargao-bike-rentals',
      },
    },
  };
}; 