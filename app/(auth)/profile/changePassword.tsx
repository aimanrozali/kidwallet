import { View, Text } from 'react-native'
import React from 'react'
import ChangePassword from '@/screens/ChangePassword'
import { SafeAreaView } from 'react-native-safe-area-context'

const changePassword = () => {
  return (
    <SafeAreaView>
      <ChangePassword />
    </SafeAreaView>
  )
}

export default changePassword