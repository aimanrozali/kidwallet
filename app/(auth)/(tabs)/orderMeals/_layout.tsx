import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const Layout = () => {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name='orderedList' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='mealsList' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='[mealID]' options={{ headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='viewCart' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
    </Stack>
  )
}

export default Layout