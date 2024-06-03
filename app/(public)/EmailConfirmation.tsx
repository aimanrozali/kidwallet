import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { defaultStyles } from '@/constants/Styles'
import { useAuth } from '@/context/AuthContext'
import Colors from '@/constants/Colors'

const EmailConfirmation = () => {

  const { email } = useLocalSearchParams<{ email: string }>();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
  const [resendDisabled, setResendDisabled] = useState(true);

  const router = useRouter();
  const { verifyOtp, resendOtp } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setInterval(() => {
        setCountdown(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setResendDisabled(false);
    }
  }, [countdown]);

  const handleConfirm = async () => {
    if (!/^\d{6}$/.test(otp)) {
      Alert.alert("Invalid OTP", "OTP must be a 6-digit number");
      return;
    }
    setLoading(true);
    setError('');
    const result = await verifyOtp!(email, otp);
    setLoading(false);
    // console.log(result);
    // if (result.data.success) {
    //   Alert.alert("Email confirmed successfully");
    //   router.push("/Login");
    // } else {
    //   setError("Invalid OTP");
    // }
  }

  const handleResendOtp = async () => {
    try {
      await resendOtp!(email);
      setCountdown(300);
      setResendDisabled(true);
      Alert.alert("OTP resent successfully");
    } catch (error) {
      Alert.alert("Error", "Failed to resend OTP");
      console.error("Error on EmailConfirmation.tsx", error);
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Email Confirmation</Text>
        <Text style={styles.description}>Please enter the 6-digit OTP code sent to your email</Text>
        <Text style={styles.description}>Email was sent to email: {email}</Text>
        <View style={styles.otpContainer}>
          <TextInput
            placeholder='Enter OTP code'
            keyboardType='number-pad'
            style={[defaultStyles.inputField, styles.input]}
            value={otp}
            onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ''))}
            maxLength={6}
          />
          <TouchableOpacity
            style={[defaultStyles.btn, styles.resendButton, { backgroundColor: resendDisabled ? '#bcbcbc' : Colors.primary }]}
            onPress={handleResendOtp}
            disabled={resendDisabled}
          >
            <Text style={defaultStyles.btnText}>Resend OTP</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.countdownText}>Resend OTP in {formatTime(countdown)}</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <TouchableOpacity
            style={[defaultStyles.btn, styles.button]}
            onPress={handleConfirm}
          >
            <Text style={defaultStyles.btnText}>Confirm</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

export default EmailConfirmation

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    textAlign: 'center',
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  resendButton: {
    marginLeft: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  countdownText: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
});
