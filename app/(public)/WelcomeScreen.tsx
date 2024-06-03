import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { defaultStyles } from '@/constants/Styles'
import { useRouter } from 'expo-router'

const WelcomeScreen = () => {

  const router = useRouter();

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <View>
        <View style={styles.imageContainer}>
          <Image
            source={require('@/assets/images/WelcomeImage.png')}
            style={styles.image} />
        </View>
        <View style={styles.textContainer}>
          <Text style={{ fontFamily: 'lato-black', fontSize: 25 }}>Welcome to</Text>
          <Text style={{ fontFamily: 'lato-black', fontSize: 25 }}>KidWallet ParentPay</Text>
          <Text style={{ fontFamily: 'lato-light', fontSize: 12, paddingTop: 10 }}>Manage your child's e-wallet with ease</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => router.navigate("Login")}
            style={[defaultStyles.btnOutline, { paddingHorizontal: 40 }]}>
            <Text style={defaultStyles.btnText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[defaultStyles.btn, { paddingHorizontal: 40 }]}
            onPress={() => router.navigate("SignUp")}>
            <Text style={defaultStyles.btnText}>Sign Up</Text>
          </TouchableOpacity>
          {/* <TouchableOpacity
            style={[defaultStyles.btn, { paddingHorizontal: 40 }]}
            onPress={() => router.navigate("EmailConfirmation")}>
            <Text style={defaultStyles.btnText}>Confirmation (TEST)</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </SafeAreaView>
  )
}

export default WelcomeScreen

const styles = StyleSheet.create({
  image: {
    height: 200,
    width: 200,
  },
  imageContainer: {
    alignItems: 'center',
    paddingTop: 100,
  },
  textContainer: {
    paddingTop: 5,
    alignItems: 'center'
  },
  buttonContainer: {
    padding: 50,
    flexDirection: "row",
    justifyContent: "space-around"
  }
})