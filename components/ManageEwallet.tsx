import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'

const ManageEwallet = () => {
  return (
    <View>
      <Text>Manage E-Wallet</Text>
      <View>
        <ScrollView style={{ paddingTop: 10 }}>
          <TouchableOpacity style={[styles.card, { flexDirection: 'row', alignItems: 'center', padding: 10, justifyContent: 'space-between' }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <FontAwesome name='dollar' size={26} style={{ padding: 10, alignItems: 'center' }} />
              <View style={{ padding: 10 }}>
                <Text>Abdul Zakwan</Text>
                <Text>Not exceed limit</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
              <Text>RM24.00</Text>
              <Ionicons name='chevron-forward' size={26} />
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  )
}

export default ManageEwallet

const styles = StyleSheet.create({
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
  }
})