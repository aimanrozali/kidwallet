import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { defaultStyles } from '@/constants/Styles'
import { useAuth } from '@/context/AuthContext'
import * as yup from 'yup'
import { Formik } from 'formik'

const signUp = () => {
  const loginValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required('Email Address is Required'),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirmPass: yup
      .string()
      .oneOf([yup.ref('password')], 'Passwords must match')
      .required('Confirm Password is required'),
    userName: yup
      .string()
      .required('User Name is required')
  });

  const router = useRouter();
  const { onRegister } = useAuth();

  const register = async (values: any) => {
    // try {
    await loginValidationSchema.validate(values);
    const result = await onRegister!(values.email, values.password, values.userName);
    // console.log(result);
    // alert("Registration Successful");
    // router.push("/Login");
    // } catch (e) {
    //   console.error("Error on SignUp.tsx", e);
    // }
  }

  return (
    <SafeAreaView>
      <Formik
        initialValues={{ email: '', password: '', confirmPass: '', userName: '' }}
        validationSchema={loginValidationSchema}
        onSubmit={register}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
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
                    style={[defaultStyles.inputField, { marginBottom: 5, marginHorizontal: 20 }]}
                    onChangeText={handleChange('email')}
                    onBlur={handleBlur('email')}
                    value={values.email}
                  />
                  {/* {errors.email && touched.email && ( */}
                  <Text style={styles.errorText}>{errors.email}</Text>
                  {/* )} */}

                  <Text style={{ paddingBottom: 10, marginLeft: 15 }}>User Name</Text>
                  <TextInput
                    placeholder='Enter your User Name'
                    style={[defaultStyles.inputField, { marginBottom: 5, marginHorizontal: 20 }]}
                    onChangeText={handleChange('userName')}
                    onBlur={handleBlur('userName')}
                    value={values.userName}
                  />
                  {/* {errors.userName && touched.userName && ( */}
                  <Text style={styles.errorText}>{errors.userName}</Text>
                  {/* )} */}

                  <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Password</Text>
                  <TextInput
                    placeholder='Enter your password' secureTextEntry={true}
                    style={[defaultStyles.inputField, { marginBottom: 5, marginHorizontal: 20 }]}
                    onChangeText={handleChange('password')}
                    onBlur={handleBlur('password')}
                    value={values.password}
                  />
                  {/* {errors.password && touched.password && ( */}
                  <Text style={styles.errorText}>{errors.password}</Text>
                  {/* )} */}

                  <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Confirm Password</Text>
                  <TextInput
                    placeholder='Confirm password' secureTextEntry={true}
                    style={[defaultStyles.inputField, { marginBottom: 5, marginHorizontal: 20 }]}
                    onChangeText={handleChange('confirmPass')}
                    onBlur={handleBlur('confirmPass')}
                    value={values.confirmPass}
                  />
                  {/* {errors.confirmPass && touched.confirmPass && ( */}
                  <Text style={styles.errorText}>{errors.confirmPass}</Text>
                  {/* )} */}

                  <TouchableOpacity
                    style={[defaultStyles.btn, { marginHorizontal: 40, marginTop: 10 }]}
                    onPress={handleSubmit}
                  >
                    <Text style={defaultStyles.btnText}>Register</Text>
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        )}
      </Formik>
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
  },
  errorText: {
    color: 'red',
    marginLeft: 20,
    marginBottom: 10,
  }
})
