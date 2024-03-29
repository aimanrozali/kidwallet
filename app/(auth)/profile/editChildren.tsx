import { View, Text } from 'react-native'
import React from 'react'
import EditChildren from '@/screens/EditChildren'
import { SafeAreaView } from 'react-native-safe-area-context'

const editChildren = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <EditChildren />
    </SafeAreaView>
  )
}

export default editChildren