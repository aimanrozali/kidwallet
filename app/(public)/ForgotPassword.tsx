import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { API_URL } from '@/config';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();
  const [message, setMessage] = useState<string>();
  const router = useRouter();

  const handleSendResetLink = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const response = await axios.post(`${API_URL}/Auth/RequestResetPassword?email=${email}`);
      setLoading(false);
      if (response.data.success) {
        setMessage('A password reset link has been sent to your email.');
      } else {
        setError('Failed to send reset link. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again.' + error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Forgot Password</Text>
        <Text style={styles.description}>Enter your email address to receive a password reset link.</Text>
        <TextInput
          placeholder='Enter your email'
          keyboardType='email-address'
          style={[defaultStyles.inputField, styles.input]}
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoCapitalize='none'
          autoCorrect={false}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}
        {message && <Text style={styles.messageText}>{message}</Text>}
        {loading ? (
          <ActivityIndicator size='large' color='#0000ff' />
        ) : (
          <TouchableOpacity
            style={[defaultStyles.btn, styles.button]}
            onPress={handleSendResetLink}
          >
            <Text style={defaultStyles.btnText}>Send Reset Link</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ForgotPassword;

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
  input: {
    marginBottom: 20,
    textAlign: 'center',
    width: '100%'
  },
  button: {
    marginTop: 10,
    width: '100%',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  messageText: {
    color: 'green',
    marginBottom: 10,
  },
});
