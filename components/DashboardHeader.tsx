import { View, Text, Image, StyleSheet, Touchable, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { API_URL } from '@/config';
import axios from 'axios';
import { User } from '@/interfaces/user';
import { Student } from '@/interfaces/student';
import { useFocusEffect } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

interface UserData {
  email: string;
  userName: string;
  phoneNumber: string;
  profilePicture: string;
  students: Student[];

}

const DashboardHeader = () => {

  const { authState } = useAuth();

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  const defaultProfilePic = "https://kidwallet-bucket.s3.ap-southeast-1.amazonaws.com/profilePictures/default.jpg";

  const refreshData = () => {
    setRefresh(!refresh);
    console.log(refresh);
  }


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
    //Main container
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
          <Text style={{ fontFamily: 'lato-bold', fontSize: 20, paddingTop: 5 }}>RM50.30</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', alignSelf: 'flex-end' }}>
          <Ionicons name='arrow-up-circle-outline' size={20} color={'green'} />
          <Text style={{ fontFamily: 'lato-light', fontSize: 11 }}>5.3% from last week</Text>
        </View>
      </View>
    </View>
  )
}

export default DashboardHeader


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
  }
})