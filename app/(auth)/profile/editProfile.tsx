import { View, Text } from 'react-native'
import React from 'react'
import EditProfile from '@/screens/EditProfile'
import { SafeAreaView } from 'react-native-safe-area-context'

const editProfile = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <EditProfile />
    </SafeAreaView>
  )
}

export default editProfile