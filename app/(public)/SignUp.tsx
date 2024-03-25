import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { defaultStyles } from '@/constants/Styles'
import { useAuth } from '@/context/AuthContext'

const signUp = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const router = useRouter();
  const { onRegister } = useAuth();

  const register = async () => {
    try {
      const result = onRegister!(email, password, userName, phoneNumber);
      console.log(result);
    }
    catch (e) {
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