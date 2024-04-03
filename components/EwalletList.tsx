import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { Link, useRouter } from 'expo-router'
import { API_URL } from '@/config'
import axios from 'axios'
import { Student } from '@/interfaces/student'
import { useAuth } from '@/context/AuthContext'


const EwalletList = () => {

  const { authState } = useAuth();

  const [studentData, setStudentData] = useState<Student[] | null>(null);

  useEffect(() => {
    const url = `${API_URL}/api/Student/GetAll`;

    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const responseJson = response.data.data;
        setStudentData(responseJson);

        console.log(responseJson); // Log the updated value here

      } catch (err) {
        //console.error("At Student", err);
      }
    }
    if (authState?.authenticated) {
      fetchData();
    }

  }, [authState?.authenticated]);


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
        {studentData?.length ?
          (<ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 15 }}>
            {studentData?.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => router.navigate(`/(auth)/ewallet/${item.studentID}`)}
                style={[styles.card, { flexDirection: 'row', alignItems: 'center', padding: 5, justifyContent: 'space-between' }]}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome name='dollar' size={26} style={{ padding: 10, alignItems: 'center' }} />
                  <View style={{ padding: 10 }}>
                    <Text style={{ fontFamily: 'lato-bold', fontSize: 15, paddingBottom: 5 }}>{item.studentName}</Text>
                    {/* <Text style={item.limit === 0 ? styles.limitTextBlack : styles.limitTextRed} >{item.limit === 0 ? 'Not Exceed Limit' : 'Limit Exceeded'}</Text> */}
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Text style={{ fontFamily: 'lato-black', fontSize: 18 }}>RM{(item.wallet.walletBalance).toFixed(2)}</Text>
                  <Ionicons name='chevron-forward' size={20} />
                </View>
              </TouchableOpacity>
            ))}


          </ScrollView>) :
          (<View style={{ alignContent: 'center', alignItems: 'center', paddingTop: 100 }}>
            <Text style={{ fontFamily: "lato-sb", verticalAlign: 'middle' }}>No wallet registered under this account. Please register first.</Text>
          </View>)
        }

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