import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import MealsPreOrder from '@/screens/MealsPreOrder'

const orderMeals = () => {

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setRefresh(!refresh);
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <MealsPreOrder refresh={refresh} />
    </SafeAreaView>
  )
}

export default orderMeals