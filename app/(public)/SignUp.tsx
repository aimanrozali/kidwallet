import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { defaultStyles } from '@/constants/Styles'
import { useAuth } from '@/context/AuthContext'
import * as yup from 'yup'

const signUp = () => {

  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required('Email Address is Required'),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    phoneNumber: yup
      .number()
      .min(10, ({ min }) => `Phone number must be at least ${min} number`),
  })

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const router = useRouter();
  const { onRegister } = useAuth();

  const register = async () => {
    try {
      await loginValidationSchema.validate({ email, password, phoneNumber });
      const result = onRegister!(email, password, userName, phoneNumber);
      console.log(result);
      // If the registration is successful, navigate to the login page
      alert("Registration Successful")
      router.push("/Login");
    }
    catch (e) {
      Alert.alert('Email must be valid and password must be at least 8 characters');
      console.error("Error on SignUp.tsx", e);
    }
  }

  return (
    <SafeAreaView>
      <View>
        <View style={{ paddingHorizontal: 10 }}>
          {/* header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} >
              <Ionicons name='chevron-back' size={30} />
            </TouchableOpacity>
            <View>
              <Text style={styles.headerText}>Sign Up</Text>
            </View>
          </View>

          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={{ paddingTop: 40 }}>
              <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Email</Text>
              <TextInput
                placeholder='Enter your email'
                keyboardType='email-address'
                style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
                value={email}
                onChangeText={setEmail}
              />

              <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Password</Text>
              <TextInput
                placeholder='Enter your password' secureTextEntry={true}
                style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
                value={password}
                onChangeText={setPassword}
              />

              <Text style={{ paddingBottom: 10, marginLeft: 15 }}>User Name</Text>
              <TextInput
                placeholder='Enter your User Name'
                style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
                value={userName}
                onChangeText={setUserName}
              />

              <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Phone Number</Text>
              <TextInput
                placeholder='Enter your Phone Number'
                keyboardType='phone-pad'
                style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />

              <TouchableOpacity
                style={[defaultStyles.btn, { marginHorizontal: 40, marginTop: 10 }]}
                onPress={register}
              >
                <Text style={defaultStyles.btnText}>Register</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default signUp

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