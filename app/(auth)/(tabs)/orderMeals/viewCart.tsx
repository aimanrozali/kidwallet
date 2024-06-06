import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import ViewCart from '@/screens/ViewCart'
import { SafeAreaView } from 'react-native-safe-area-context'

const viewCart = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ViewCart />
    </SafeAreaView>
  )
}

export default viewCart

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})