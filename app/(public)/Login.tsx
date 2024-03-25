import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { defaultStyles } from '@/constants/Styles'
import { Ionicons } from '@expo/vector-icons'
import { useAuth } from '@/context/AuthContext'
import axios from 'axios'
import { API_URL } from '@/config'
import { router } from 'expo-router'
import safeStringify from 'safe-stringify';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { onLogin } = useAuth();

  const login = async () => {
    await onLogin!(email, password);
    // if (result.data.status) {
    //   alert(result.message)
    // }
    //console.log("RESULT::", result.data.token);
  }

  // const testConn = async () => {
  //   try {
  //     const result = await axios.get(`${API_URL}/Auth/test`);
  //     console.log(result.data.data);
  //   }
  //   catch (e) {
  //     console.error(e);
  //   }

  // }

  // useEffect(() => {
  //   const testCall = async () => {
  //     const result = await axios.get(`${API_URL}/`)
  //   }
  // })



  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'android' ? 'height' : 'padding'}
        keyboardVerticalOffset={Platform.OS === "android" ? 75 : 0}
      >


        <View style={styles.imageContainer}>
          <Image style={styles.image} source={require('@/assets/images/login.png')} />
        </View>

        <View style={styles.textContainer}>
          <Text style={{ fontFamily: 'lato-black', fontSize: 25, paddingVertical: 10 }}>Good to see you here!</Text>
          <Text style={{ fontFamily: 'lato-light', fontSize: 12, paddingTop: 10 }}>Create a KidWallet account to get started</Text>
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

            <TouchableOpacity
              style={[defaultStyles.btn, { marginHorizontal: 40, marginTop: 10 }]}
              onPress={login}
            >
              <Text style={defaultStyles.btnText}>Login</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingTop: 10 }}>
          <Text style={{ fontFamily: 'lato-light', fontSize: 13 }}>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.navigate('SignUp')}>
            <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={{ alignItems: 'center', paddingTop: 40 }}>
          <Ionicons name='help-circle-outline' size={35} />
          <Text>Help</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>
    </SafeAreaView>

  )
}

export default Login

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 200,
  },
  imageContainer: {
    alignItems: 'center',
    paddingTop: 100,
  },
  textContainer: {
    paddingTop: 15,
    alignItems: 'center'
  },
})