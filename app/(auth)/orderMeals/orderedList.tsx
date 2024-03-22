import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import OrderedMeals from '@/screens/OrderedMeals'

const orderedList = () => {
  return (
    <SafeAreaView style={styles.container}>
      <OrderedMeals />
    </SafeAreaView>
  )
}

export default orderedList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})