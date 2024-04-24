import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AddChildren from '@/screens/AddChildren'

const addChildren = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <AddChildren />
    </SafeAreaView>
  )
}

export default addChildren