import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import axios from 'axios';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { API_URL } from '@/config';
import * as yup from 'yup';
import { Formik } from 'formik';
import { Ionicons } from '@expo/vector-icons';

const ForgotPassword = () => {
  const router = useRouter();

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Please enter a valid email')
      .required('Email address is required'),
  });

  const handleSendResetLink = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    try {
      const response = await axios.post(`${API_URL}/Auth/RequestResetPassword?email=${values.email}`);
      if (response.data.success) {
        Alert.alert('Success', 'A password reset link has been sent to your email.');
        resetForm();
      } else {
        setErrors({ email: 'Failed to send reset link. Please try again.' });
      }
    } catch (error) {
      setErrors({ email: 'An error occurred. Please try again.' });
    }
    setSubmitting(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <>
          <View style={{ paddingTop: 10, paddingLeft: 10 }}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="black" />
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inner}>

            <View style={styles.content}>
              <Text style={styles.title}>Forgot Password</Text>
              <Text style={styles.description}>Enter your email address to receive a password reset link.</Text>
              <Formik
                initialValues={{ email: '' }}
                validationSchema={validationSchema}
                onSubmit={handleSendResetLink}
              >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                  <View style={styles.form}>
                    <TextInput
                      placeholder='Enter your email'
                      keyboardType='email-address'
                      style={[defaultStyles.inputField, styles.input]}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      autoCapitalize='none'
                      autoCorrect={false}
                    />
                    {errors.email && touched.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                    {isSubmitting ? (
                      <ActivityIndicator size='large' color={Colors.primary} />
                    ) : (
                      <TouchableOpacity
                        style={[defaultStyles.btn, styles.button]}
                        onPress={handleSubmit}
                      >
                        <Text style={defaultStyles.btnText}>Send Reset Link</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
              </Formik>
            </View>
          </View>
        </>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
  },
  inner: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    marginLeft: 5,
    color: 'black',
  },
  content: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    marginHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#555',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 20,
    textAlign: 'center',
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    padding: 10,
  },
  button: {
    marginTop: 10,
    width: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
});
