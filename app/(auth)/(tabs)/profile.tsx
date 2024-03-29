import { View, Text, Touchable, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuth } from '@/context/AuthContext'
import Profile from '@/screens/Profile'

const profile = () => {

  const { onLogout, authState } = useAuth();

  const logout = async () => {
    await onLogout;
    console.log("LOGOUT::", authState)
  }

  return (
    <SafeAreaView>
      <Profile />
      {/*
      <View>
        <Text>My Profile</Text>
         <TouchableOpacity onPress={onLogout}>
          <Text>Log Out</Text>
        </TouchableOpacity> 
      </View>*/}
    </SafeAreaView>
  )
}

export default profile