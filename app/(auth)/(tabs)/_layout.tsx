import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'

const Layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { paddingBottom: 5, paddingTop: 5, flexDirection: 'row' },
        tabBarActiveTintColor: Colors.dark,
        tabBarLabelStyle: {
          fontFamily: 'lato-sb',
        },
      }}
    >
      <Tabs.Screen
        name='index'
        options={{
          headerShown: false,
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name='orderMeals'
        options={{
          headerShown: false,
          tabBarLabel: 'Order Meals',
          tabBarIcon: ({ color, size }) => <FontAwesome name="cutlery" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name='profile'
        options={{
          tabBarLabel: 'My Profile',
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
    </Tabs>
  )
}

export default Layout