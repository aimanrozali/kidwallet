import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useSegments } from 'expo-router';
import { API_URL } from '@/config';
import axios from 'axios';
import { Student } from '@/interfaces/student';
import { useAuth } from '@/context/AuthContext';
import Colors from '@/constants/Colors';

interface UserData {
  email: string;
  userName: string;
  phoneNumber: string;
  profilePicture: string;
  students: Student[];
}

const Profile = () => {
  const [profile, setProfile] = useState<UserData | null>(null);

  const segments = useSegments();

  useEffect(() => {
    const url = `${API_URL}/api/User/GetInfo`;

    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const responseJson = response.data.data;
        setProfile(responseJson);
      } catch (err) {
        console.error("At MealsPreOrder", err);
      }
    };

    fetchData();
  }, [segments]);

  const { onLogout } = useAuth();

  const logout = async () => {
    if (onLogout) {
      await onLogout();
    }
  };

  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
      </View>

      {/* Account Details */}
      <View style={styles.profileCard}>
        <Image
          style={styles.image}
          source={{ uri: profile?.profilePicture || 'https://kidwallet-bucket.s3.ap-southeast-1.amazonaws.com/profilePictures/default.jpg' }}
        />
        <Text style={styles.profileName}>{profile?.userName}</Text>
        <Text style={styles.profileEmail}>{profile?.email}</Text>
        {/* <Text style={styles.profilePhone}>{profile?.phoneNumber}</Text> */}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        <ScrollView contentContainerStyle={styles.optionsCard}>
          <TouchableOpacity onPress={() => router.navigate(`(auth)/profile/editProfile`)}>
            <View style={styles.option}>
              <Text style={styles.optionText}>Edit Profile</Text>
              <Ionicons name='chevron-forward' size={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.navigate(`(auth)/profile/ChangeProfilePicture`)}>
            <View style={styles.option}>
              <Text style={styles.optionText}>Change Profile Picture</Text>
              <Ionicons name='chevron-forward' size={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.navigate(`(auth)/profile/manageChildren`)}>
            <View style={styles.option}>
              <Text style={styles.optionText}>Manage Children</Text>
              <Ionicons name='chevron-forward' size={20} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.navigate(`(auth)/profile/changePassword`)}>
            <View style={styles.option}>
              <Text style={styles.optionText}>Change Password</Text>
              <Ionicons name='chevron-forward' size={20} />
            </View>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontFamily: 'lato-bold',
    fontSize: 18,
    color: '#333',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 2 },
  },
  image: {
    height: 80,
    width: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontFamily: 'lato-bold',
    fontSize: 18,
    color: '#333',
  },
  profileEmail: {
    fontFamily: 'lato-regular',
    fontSize: 14,
    color: '#666',
  },
  profilePhone: {
    fontFamily: 'lato-regular',
    fontSize: 14,
    color: '#666',
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
    paddingBottom: 20
  },
  optionsCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    paddingVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: { width: 2, height: 2 },
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  optionText: {
    fontFamily: 'lato-bold',
    fontSize: 15,
    color: '#333',
  },
  logoutButton: {
    backgroundColor: Colors.red,
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 50,
    marginTop: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
