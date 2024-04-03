import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router';
import { API_URL } from '@/config';
import axios from 'axios';
import { Student } from '@/interfaces/student';
import { defaultStyles } from '@/constants/Styles';
import { useAuth } from '@/context/AuthContext';

interface UserData {
  email: string;
  userName: string;
  phoneNumber: string;
  profilePicture: string;
  students: Student[];

}

const Profile = () => {

  const [profile, setProfile] = useState<UserData | null>(null);

  useEffect(() => {
    const url = `${API_URL}/api/User/GetInfo`;

    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const responseJson = response.data.data;
        setProfile(responseJson);

        console.log(responseJson); // Log the updated value here
        //setLoaded(true);

      } catch (err) {
        console.error("At MealsPreOrder", err);
      }
    }

    fetchData();

  }, []);

  const { onLogout, authState } = useAuth();

  const logout = async () => {
    await onLogout;
    console.log("LOGOUT::", authState)
  }

  const router = useRouter();
  return (
    <View>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      {/* Account Details */}
      <View style={[styles.card, { padding: 10 }]}>
        <View style={{ alignItems: 'center', paddingTop: 10, gap: 10 }}>
          <Image style={styles.image} source={{ uri: profile?.profilePicture ? profile?.profilePicture : "https://avatar.iran.liara.run/public" }} />
          <Text style={styles.profileText}>{profile?.userName}</Text>
          <Text style={styles.profileText}>{profile?.email}</Text>
          <Text style={styles.profileText}>{profile?.phoneNumber}</Text>
        </View>
      </View>

      {/* Content */}
      <View>
        <ScrollView style={styles.card}>
          <TouchableOpacity
            onPress={() => router.navigate(`(auth)/profile/editProfile`)}
          >
            <View style={styles.cardInnerContainer}>
              <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>Edit Profile</Text>
              <Ionicons name='chevron-forward' size={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.navigate(`(auth)/profile/manageChildren`)}
          >
            <View style={styles.cardInnerContainer}>
              <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>Manage Children</Text>
              <Ionicons name='chevron-forward' size={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity >
            <View style={styles.cardInnerContainer}>
              <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>Change Password</Text>
              <Ionicons name='chevron-forward' size={20} />
            </View>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          style={[styles.btn, { marginHorizontal: 40, marginTop: 10 }]}
          onPress={onLogout}>
          <Text>Logout</Text>
        </TouchableOpacity>

      </View>

    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingBottom: 20
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
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 0,
    alignContent: 'center'
  },
  profileText: {
    fontFamily: 'lato-bold',
    fontSize: 15
  },
  btn: {
    backgroundColor: '#ff1100',
    height: 50,
    width: '30%',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center'
  },
})