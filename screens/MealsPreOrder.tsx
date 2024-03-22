import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

const MealsPreOrder = () => {

  const router = useRouter();

  return (
    <View style={{ paddingHorizontal: 10 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} >
          <Ionicons name='chevron-back' size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Meals Pre-Order</Text>
      </View>

      <View style={{ paddingTop: 20 }}>
        <ScrollView>


          <TouchableOpacity style={[styles.card, {}]}
            onPress={() => router.navigate('(auth)/orderMeals/orderedList')}>
            <View style={styles.cardInnerContainer}>
              <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>Abdul Zakwan</Text>
              <Ionicons name='chevron-forward' size={20} />
            </View>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </View>
  )
}

export default MealsPreOrder

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 10,
    alignItems: 'center',
    gap: 10
  },
  headerText: {
    fontFamily: 'lato-bold',
    fontSize: 15
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 20,
  },
  cardInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
  }
})