import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DashboardHeader from '@/components/DashboardHeader'
import DashboardGraph from '@/components/DashboardGraph'
import EwalletList from '@/components/EwalletList'
import { Student } from '@/interfaces/student'
import axios from 'axios'
import { API_URL } from '@/config'
import { useAuth } from '@/context/AuthContext'
import { FontAwesome, Ionicons } from '@expo/vector-icons'
import Colors from '@/constants/Colors'
import { useRouter, useSegments } from 'expo-router'

interface UserData {
  email: string;
  userName: string;
  phoneNumber: string;
  profilePicture: string;
  students: Student[];

}


const Dashboard = () => {

  const { authState } = useAuth();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const defaultProfilePic = "https://kidwallet-bucket.s3.ap-southeast-1.amazonaws.com/profilePictures/default.jpg";

  const refreshData = () => {
    setRefresh(!refresh);
    console.log(refresh);
  }

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

  }, [authState?.authenticated, refresh, segments]);


  useEffect(() => {
    const url = `${API_URL}/api/User/GetInfo`;

    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const responseJson = response.data.data;
        setUserData(responseJson as UserData);
        setLoading(false);
        console.log("Header")

      } catch (err) {
        console.error(err);
      }
    }

    if (authState?.authenticated) {
      fetchData();
      console.log("Data Fetched")
    }
  }, [authState?.authenticated, refresh])


  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Image
              source={{ uri: userData?.profilePicture ? userData?.profilePicture : "https://avatar.iran.liara.run/public" }}
              style={styles.image} />
            <View style={{ alignContent: 'flex-start' }}>
              <Text style={{ fontFamily: 'lato-light', fontSize: 10 }}>Welcome back,</Text>
              <Text style={{ fontFamily: 'lato-bold', paddingTop: 5 }}>{loading ? "loading..." : userData?.userName}</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <TouchableOpacity onPress={refreshData}>
              <Ionicons name='refresh' size={24} />
            </TouchableOpacity>
            <Ionicons name='help-circle-outline' size={24} />
            <Ionicons name='notifications' size={24} />
          </View>
        </View>
        <View style={styles.container}>
          <View>
            <Text style={{ fontFamily: 'lato-sb', fontSize: 10 }}>Total Spent</Text>
            <Text style={{ fontFamily: 'lato-bold', fontSize: 20, paddingTop: 5 }}>RM21.45</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', alignSelf: 'flex-end' }}>
            {/* <Ionicons name='arrow-up-circle-outline' size={20} color={'green'} />
            <Text style={{ fontFamily: 'lato-light', fontSize: 11 }}>5.3% from last week</Text> */}
          </View>
        </View>
      </View>
      <DashboardGraph />
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
                  onPress={() => router.navigate(`/(auth)/ewallet/${item.wallet.walletID}`)}
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
    </SafeAreaView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  image: {
    height: 35,
    width: 35,
    borderRadius: 20,
  },
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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