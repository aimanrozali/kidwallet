import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import MealsList from '@/screens/MealsList'
import mealsData from '@/data/meals.json';
import drinksData from '@/data/drinks.json';
import { API_URL } from '@/config';
import axios from 'axios';
import { Meals } from '@/interfaces/meals';
import { useLocalSearchParams } from 'expo-router';

const mealsList = () => {

  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("PASSED:::", id);

  const { name } = useLocalSearchParams<{ name: string }>();
  console.log("PASSED:::", name);


  // const mealItems = useMemo(() => meal as Meals, []);
  // const drinkItems = useMemo(() => drink as any, []);


  return (
    <SafeAreaView style={styles.container}>
      <MealsList name={name} id={id} />

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