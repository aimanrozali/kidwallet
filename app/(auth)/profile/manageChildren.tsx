import { View, Text } from 'react-native'
import React from 'react'
import ManageChildren from '@/screens/ManageChildren'
import { SafeAreaView } from 'react-native-safe-area-context'

const manageChildren = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ManageChildren />
    </SafeAreaView>
  )
}

export default manageChildren