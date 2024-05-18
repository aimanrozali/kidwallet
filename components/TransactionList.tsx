import { View, Text, FlatList, StyleSheet } from 'react-native'
import React from 'react'
import { Transaction, Wallet } from '@/interfaces/student'
import formatDate from '@/utils/FormatDate'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { ActivityIndicator } from 'react-native-paper'

interface walletProps {
  walletTrans?: Transaction[],
  loading?: boolean
}

const TransactionList = ({ walletTrans, loading }: walletProps) => {
  return (
    <View style={[styles.card, { height: '80%' }]}>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={walletTrans}
        keyExtractor={(item) => item.transactionTime.toString()}
        contentContainerStyle={{ flexGrow: 1 }}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', padding: 10 }}>
            <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
              {item.transactionType === 2 ? (
                <MaterialCommunityIcons name="cash-plus" size={30} />
              ) : (
                <Ionicons name="fast-food-outline" size={30} />
              )
              }

              <View style={{ gap: 5 }}>
                <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>{item.description}</Text>
                <Text style={{ fontFamily: 'lato-sb', fontSize: 10 }}>{formatDate(item.transactionTime)}</Text>
              </View>
            </View>
            <Text style={{
              fontFamily: 'lato-black', fontSize: 15,
              color: item.transactionType === 2 ? 'green' : 'red'
            }}>{item.transactionType === 2 ? '+' : '-'}RM{item.amount.toFixed(2)}</Text>
          </View>
        )}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', top: '30%', bottom: '50%' }}>
            {loading ? (
              <ActivityIndicator size="large" color="black" />
            ) : (
              <Text style={{ fontFamily: 'lato-sb', fontSize: 15, textAlign: 'center', marginTop: 20 }}>
                No transactions yet
              </Text>
            )}
          </View>
        }
      />
    </View>
  )
}

export default TransactionList

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
    bottom: 10,
  },
})
