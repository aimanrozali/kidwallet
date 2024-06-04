import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import * as yup from 'yup';
import { Formik } from 'formik';
import { ActivityIndicator } from 'react-native-paper';
import Colors from '@/constants/Colors';

const Login = () => {
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required('Email Address is Required'),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, 'Password must contain at least one letter, one number and one special character')
      .required('Password is required'),
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { onLogin } = useAuth();

  const login = async (values: any) => {
    try {
      setLoading(true);
      await loginValidationSchema.validate(values);
      await onLogin!(values.email, values.password);
      setLoading(false);
    } catch (err) {
      Alert.alert('Email must be valid and password must be at least 8 characters with one letter, one number, and one special character.');
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={require('@/assets/images/login.png')} />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Good to see you here!</Text>
            <Text style={styles.subtitle}>Create a KidWallet account to get started</Text>
          </View>

          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={loginValidationSchema}
            onSubmit={login}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
              <View style={styles.formContainer}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Email</Text>
                  <TextInput
                    placeholder='Enter your email'
                    keyboardType='email-address'
                    style={styles.inputField}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                  {errors.email && touched.email && (
                    <Text style={styles.errorText}>{errors.email}</Text>
                  )}
                </View>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Password</Text>
                  <View style={styles.passwordContainer}>
                    <TextInput
                      placeholder='Enter your password'
                      secureTextEntry={!showPassword}
                      style={[styles.inputField, { flex: 1 }]}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      value={values.password}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} style={styles.icon} />
                    </TouchableOpacity>
                  </View>
                  {errors.password && touched.password && (
                    <Text style={styles.errorText}>{errors.password}</Text>
                  )}
                </View>

                <TouchableOpacity
                  style={styles.button}
                  onPress={handleSubmit}
                >
                  {loading ?
                    <View style={styles.loadingContainer}>
                      <Text style={styles.buttonText}>Logging in...</Text>
                      <ActivityIndicator animating={loading} color='black' />
                    </View>
                    :
                    <Text style={styles.buttonText}>Login</Text>
                  }
                </TouchableOpacity>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>Don't have an account?</Text>
                  <TouchableOpacity onPress={() => router.navigate('SignUp')}>
                    <Text style={styles.footerLink}>Sign Up</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => router.navigate('ForgotPassword')}>
                  <Text style={styles.forgotPassword}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>
            )}
          </Formik>

          <TouchableOpacity style={styles.helpContainer}>
            <Ionicons name='help-circle-outline' size={35} />
            <Text>Help</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    flex: 1,
    justifyContent: 'center',
  },
  inner: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  image: {
    height: 150,
    width: 200,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontFamily: 'lato-black',
    fontSize: 25,
    paddingVertical: 10,
  },
  subtitle: {
    fontFamily: 'lato-light',
    fontSize: 12,
    paddingTop: 10,
    color: '#555',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    marginHorizontal: 20,
  },
  inputWrapper: {
    marginBottom: 15,
  },
  label: {
    marginLeft: 5,
    marginBottom: 5,
    color: '#333',
    fontWeight: 'bold',
  },
  inputField: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: 5,
    marginTop: 5,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
  },
  icon: {
    marginRight: 10,
  },
  button: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    fontFamily: 'lato-light',
    fontSize: 13,
    color: '#555',
  },
  footerLink: {
    fontFamily: 'lato-bold',
    fontSize: 13,
    color: 'black',
    marginLeft: 5,
  },
  forgotPassword: {
    fontFamily: 'lato-sb',
    fontSize: 13,
    textAlign: 'center',
    color: 'black',
    paddingVertical: 10,
  },
  helpContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
});
