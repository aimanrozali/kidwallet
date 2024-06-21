import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import { API_URL } from '@/config';
import axios from 'axios';

const EditProfile = () => {

  useEffect(() => {

    const url = `${API_URL}/api/User/GetInfo`;

    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const responseJson = response.data.data;
        setUserName(responseJson.userName);
        setEmail(responseJson.email);
        setPhoneNumber(responseJson.phoneNumber);
        //setLoading(false);
        console.log("Header")

      } catch (err) {
        console.error(err);
      }
    }

    fetchData();

  }, []);




  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("0");
  const [email, setEmail] = useState("");
  const [userName, setUserName] = useState("");

  const update = async () => {
    await axios.put(`${API_URL}/api/User/UpdateUser`, { email, userName, phoneNumber }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res.data.data);
      alert("Profile Updated Successfully")
      router.push('/profile');
    })
      .catch((err) => {
        console.error(err);
      });
  }

  const updateData = async () => {

  }



  return (
    <View>
      <View style={{ paddingHorizontal: 10 }}>
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} >
            <Ionicons name='chevron-back' size={30} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerText}>Edit Profile</Text>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ paddingTop: 40 }}>
            <Text style={{ paddingBottom: 10, marginLeft: 15 }}>User Name</Text>
            <TextInput
              style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
              value={userName}
              onChangeText={setUserName}
            />

            <Text style={{ paddingBottom: 10, marginLeft: 15 }}>E-Mail</Text>
            <TextInput
              keyboardType='email-address'
              style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
              value={email}
              onChangeText={setEmail}
            />

            {/* <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Phone Number</Text>
            <TextInput
              keyboardType='phone-pad'
              style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
            /> */}

            <TouchableOpacity
              style={[defaultStyles.btn, { marginHorizontal: 40, marginTop: 10 }]}
              onPress={update}
            >
              <Text style={defaultStyles.btnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}

export default EditProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    alignItems: 'center',
    gap: 10
  },
  headerText: {
    fontFamily: 'lato-bold',
    fontSize: 15,
    paddingBottom: 2,
  }
})