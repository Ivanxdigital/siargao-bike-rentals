import { Tabs } from 'expo-router';
import { Home, Search, Heart, User } from 'lucide-react-native';
import { StyleSheet, View, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: '#FFFFFF', // Solid white
          borderTopWidth: 0,
          elevation: 0,
          height: 70 + (insets.bottom > 0 ? insets.bottom - 10 : 0),
          paddingBottom: insets.bottom > 0 ? insets.bottom - 10 : 10,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          ...Platform.select({
            ios: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -3 },
              shadowOpacity: 0.1,
              shadowRadius: 3,
            },
            android: {
              elevation: 8,
            },
          }),
        },
        tabBarActiveTintColor: '#FF6B00',
        tabBarInactiveTintColor: '#A0A0A0',
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
          marginTop: 2,
        },
        tabBarItemStyle: {
          height: 50,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Home size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Search size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <Heart size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <View style={focused ? styles.activeIconContainer : null}>
              <User size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: 'rgba(255, 107, 0, 0.1)',
    borderRadius: 10,
    padding: 6,
    marginTop: -2,
  },
});