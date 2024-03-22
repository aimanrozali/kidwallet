import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import MealsPreOrder from '@/screens/MealsPreOrder'

const orderMeals = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <MealsPreOrder />
    </SafeAreaView>
  )
}

export default orderMeals