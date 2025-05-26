import { Tabs } from 'expo-router';
import React from 'react';

import Icon from '@/components/ui/Icon';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import { useAuth } from "@/src/hooks/useAuth";
import Login from "../(auth)/login";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { accountInfo } = useAuth();

  if (!accountInfo) {
    return <Login />;
  }

  return (
    <Tabs
    screenOptions={{
      tabBarActiveTintColor: Colors.light.background,
      tabBarInactiveTintColor: '#B0B0B0',
      headerShown: false,
      tabBarStyle: {
        backgroundColor: Colors.dark.primary,
        borderTopWidth: 0,
        borderTopColor: 'transparent',
        height: 60,
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="favorite"
        options={{
          title: 'Favorite',
          tabBarIcon: ({ color }) => <Icon type="MaterialCommunityIcons" name="heart-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color }) => <Icon type="MaterialCommunityIcons" name="magnify" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="cartTab"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <Icon type="MaterialCommunityIcons" name="cart-outline" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Icon type="MaterialCommunityIcons" name="account-outline" size={28} color={color} />,
        }}
      />
    </Tabs>
  );
}
