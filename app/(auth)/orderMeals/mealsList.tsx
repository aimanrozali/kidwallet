import { View, Text, StyleSheet } from 'react-native'
import React, { useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MealsList from '@/screens/MealsList'
import mealsData from '@/data/meals.json';
import drinksData from '@/data/drinks.json';

const mealsList = () => {

  const mealItems = useMemo(() => mealsData as any, []);
  const drinkItems = useMemo(() => drinksData as any, []);


  return (
    <SafeAreaView style={styles.container}>
      <MealsList meals={mealItems} drinks={drinkItems} />
    </SafeAreaView>
  )
}

export default mealsList

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})