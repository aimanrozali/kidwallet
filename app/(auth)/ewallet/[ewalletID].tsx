import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Tabs, useLocalSearchParams, useNavigation, useRouter, useSegments } from 'expo-router'
import { Entypo, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { API_URL } from '@/config'
import axios from 'axios'
import { Student, Wallet } from '@/interfaces/student'
import { ActivityIndicator } from 'react-native-paper'
import moment from 'moment';

const WalletPage = () => {

  const router = useRouter();
  const segments = useSegments();

  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);

  const { ewalletID } = useLocalSearchParams<{ ewalletID: string }>();

  useEffect(() => {
    const url = `${API_URL}/api/Wallet`;
    console.log(url + `/${ewalletID}`);

    const fetchData = async () => {
      try {
        const response = await axios.get(url + `/${ewalletID}`);
        const responseJson = response.data.data;
        setWalletData(responseJson);
        setLoading(false);

        console.log("At Wallet:", responseJson); // Log the updated value here

      } catch (err) {
        console.error("At Wallet", err);
      }
    }

    fetchData();

  }, [segments]);

  // const data = (walletData as Wallet).find((item: { WalletID: string }) => item.WalletID === ewalletID)

  // console.log(data);

  // Get Today's full date and day
  let todayDate = new Date()
  var today = todayDate.toLocaleDateString("en-MY", { month: 'long', year: 'numeric', day: 'numeric' });

  const formatDate = (dateItem: Date) => {
    var x = dateItem.toLocaleString();
    var formatted = moment(x).format('MMMM Do YYYY, h:mm:ss a');
    return formatted;
  }


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
            {walletData?.student.studentName}
          </Text>
          <Text style={{ fontFamily: 'lato-sb', fontSize: 12 }}>
            Total Balance
          </Text>
          <Text style={{ fontFamily: 'lato-black', fontSize: 25 }}>
            RM{walletData?.walletBalance.toFixed(2)}
          </Text>
        </View>

        <View style={styles.mainButtonContainer}>
          <TouchableOpacity style={styles.btn}
            onPress={() => router.navigate(`/(auth)/ewallet/topupScreen?ewalletID=${ewalletID}`)}>
            <Ionicons name='add-circle-outline' size={35} />
            <Text style={styles.btnText}>Add Funds</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <FontAwesome6 name="edit" size={35} />
            <Text style={styles.btnText}>Edit Threshold</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn}>
            <Entypo name="dots-three-horizontal" size={35} />
            <Text style={styles.btnText}>More</Text>
          </TouchableOpacity>
        </View>

        {/* threshold card */}
        <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 15, alignItems: 'center' }]}>
          <View>
            <Text style={{ fontFamily: 'lato-bold', fontSize: 15 }}>Current Daily Spending Threshold</Text>
            <Text style={{ fontFamily: 'lato-black', fontSize: 18, paddingVertical: 5 }}>RM{walletData?.dailySpendingLimit.toFixed(2)}</Text>
            <Text style={{ fontFamily: 'lato-sb', fontSize: 13, color: Colors.grey }}>RM4.00 Spent Today</Text>
          </View>
          {/* <TouchableOpacity style={{ alignItems: 'center', gap: 5 }}>
            <Ionicons name='pencil' size={24} color='black' />
            <Text style={{ fontFamily: 'lato-sb' }}>Edit</Text>
          </TouchableOpacity> */}
        </View>

        {/*  Transaction History */}
        <View>
          <View style={{ paddingVertical: 20, gap: 10 }}>
            <Text style={{ fontFamily: 'lato-bold', fontSize: 15 }}>
              Transaction History
            </Text>
            <Text style={{ fontFamily: 'lato-sb', fontSize: 12, color: Colors.grey }}>
              Today, {today}
            </Text>
          </View>
          <ScrollView style={[styles.card, { maxHeight: '80%', minHeight: 'auto', paddingTop: 5 }]}
            contentContainerStyle={{ padding: 0, }}
            showsVerticalScrollIndicator={false}
          >
            {!loading ? (
              walletData && walletData?.transactions.length > 0 ? (
                walletData.transactions.map((item, index) => (
                  <View key={index} style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', padding: 10 }}>
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
                ))
              ) :
                <Text>No Transactions</Text>
            )
              : <ActivityIndicator />}

          </ScrollView>
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