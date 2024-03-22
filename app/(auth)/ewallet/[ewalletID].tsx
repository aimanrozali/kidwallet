import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Tabs, useNavigation, useRouter } from 'expo-router'
import { Entypo, FontAwesome5, FontAwesome6, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'

const WalletPage = () => {

  const router = useRouter();

  // Get Today's full date and day
  let todayDate = new Date()
  var today = todayDate.toLocaleDateString("en-MY", { month: 'long', year: 'numeric', day: 'numeric' });

  // Get Transaction History


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Screen header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons
              name='chevron-back'
              size={25}
              onPress={() => router.back()} />
          </TouchableOpacity>
        </View>
        {/* Wallet Header */}
        <View style={styles.textContainer}>
          <Text style={{ fontFamily: 'lato-bold', fontSize: 15 }}>
            Abdul Zakwan
          </Text>
          <Text style={{ fontFamily: 'lato-sb', fontSize: 12 }}>
            Total Balance
          </Text>
          <Text style={{ fontFamily: 'lato-black', fontSize: 25 }}>
            RM24.00
          </Text>
        </View>

        <View style={styles.mainButtonContainer}>
          <TouchableOpacity style={styles.btn}>
            <Ionicons name='add-circle-outline' size={40} />
            <Text style={styles.btnText}>Add Funds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <FontAwesome6 name="money-bill-transfer" size={40} />
            <Text style={styles.btnText}>Withdraw Money</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <Entypo name="dots-three-horizontal" size={40} />
            <Text style={styles.btnText}>Add Funds</Text>
          </TouchableOpacity>
        </View>

        {/* threshold card */}
        <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 15, alignItems: 'center' }]}>
          <View>
            <Text style={{ fontFamily: 'lato-bold', fontSize: 15 }}>Current Daily Spending Threshold</Text>
            <Text style={{ fontFamily: 'lato-black', fontSize: 18, paddingVertical: 5 }}>RM8.00</Text>
            <Text style={{ fontFamily: 'lato-sb', fontSize: 13, color: Colors.grey }}>RM4.00 Spent Today</Text>
          </View>
          <TouchableOpacity style={{ alignItems: 'center', gap: 5 }}>
            <Ionicons name='pencil' size={24} color='black' />
            <Text style={{ fontFamily: 'lato-sb' }}>Edit</Text>
          </TouchableOpacity>
        </View>

        {/*  Transaction History */}
        <View>
          <View style={{ paddingTop: 20, gap: 10 }}>
            <Text style={{ fontFamily: 'lato-bold', fontSize: 15 }}>
              Transaction History
            </Text>
            <Text style={{ fontFamily: 'lato-sb', fontSize: 12, color: Colors.grey }}>
              Today, {today}
            </Text>
          </View>
          <View style={[, { paddingTop: 10 }]}>
            <ScrollView style={[styles.card, {}]}
              contentContainerStyle={{ padding: 0 }}
            >
              <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', padding: 10 }}>
                <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                  <Ionicons name="fast-food-outline" size={30} />
                  <View style={{ gap: 5 }}>
                    <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>Nasi Lemak</Text>
                    <Text style={{ fontFamily: 'lato-sb', fontSize: 10 }}>12.14 AM</Text>
                  </View>
                </View>
                <Text style={{ fontFamily: 'lato-black', fontSize: 15, color: 'red' }}>-RM1.50</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', padding: 10 }}>
                <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }}>
                  <Ionicons name="fast-food-outline" size={30} />
                  <View style={{ gap: 5 }}>
                    <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>Nasi Lemak</Text>
                    <Text style={{ fontFamily: 'lato-sb', fontSize: 10 }}>12.14 AM</Text>
                  </View>
                </View>
                <Text style={{ fontFamily: 'lato-black', fontSize: 15, color: 'red' }}>-RM1.50</Text>
              </View>


            </ScrollView>
          </View>
        </View>

      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  header: {
    paddingTop: 10,
    height: 40,
  },
  innerContainer: {
    paddingHorizontal: 20
  },
  textContainer: {
    gap: 8,
    paddingTop: 20,
  },
  mainButtonContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  btn: {
    alignItems: 'center'
  },
  btnText: {
    fontFamily: 'lato-sb',
    fontSize: 12,
    paddingTop: 5
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
})

export default WalletPage