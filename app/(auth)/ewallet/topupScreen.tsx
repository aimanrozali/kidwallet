import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import TopupScreen from '@/screens/TopupScreen'

const topupScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <TopupScreen />
    </SafeAreaView>
  )
}

export default topupScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
})