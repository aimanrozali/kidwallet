import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { Link, useRouter } from 'expo-router'

//Dummy Data
const eWallet = [
  {
    id: 1,
    name: 'Aiman Rozali',
    amount: 20.32,
    limit: 0,
  },
  {
    id: 2,
    name: 'Abdul Zakwan',
    amount: 10.65,
    limit: 1,
  },
  {
    id: 3,
    name: 'Ezzaty Nordin',
    amount: 50.21,
    limit: 1,
  },
  {
    id: 4,
    name: 'Cikambai',
    amount: 70.31,
    limit: 0,
  }
]

const EwalletList = () => {

  const router = useRouter();

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerShadow}>
        <Text
          style={{ fontFamily: 'lato-bold', paddingLeft: 10, paddingTop: 10 }}
        >
          Manage E-Wallet
        </Text>
      </View>

      <View style={{ paddingHorizontal: 10, paddingVertical: 10 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 15 }}>
          {eWallet.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => router.navigate(`/(auth)/ewallet/${item.id}`)}
              style={[styles.card, { flexDirection: 'row', alignItems: 'center', padding: 5, justifyContent: 'space-between' }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome name='dollar' size={26} style={{ padding: 10, alignItems: 'center' }} />
                <View style={{ padding: 10 }}>
                  <Text style={{ fontFamily: 'lato-bold', fontSize: 15, paddingBottom: 5 }}>{item.name}</Text>
                  <Text style={item.limit === 0 ? styles.limitTextBlack : styles.limitTextRed} >{item.limit === 0 ? 'Not Exceed Limit' : 'Limit Exceeded'}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Text style={{ fontFamily: 'lato-black', fontSize: 18 }}>RM{item.amount}</Text>
                <Ionicons name='chevron-forward' size={20} />
              </View>
            </TouchableOpacity>
          ))}


        </ScrollView>
      </View>
    </View>
  )
}

export default EwalletList

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
  },
  headerShadow: {
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
  },
  limitTextBlack: {
    fontFamily: 'lato-sb', color: Colors.grey, fontSize: 12
  },
  limitTextRed: {
    fontFamily: 'lato-sb', color: Colors.red, fontSize: 12
  }
})