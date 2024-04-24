import { View, Text, Alert, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStripe } from '@stripe/stripe-react-native';

const paymentScreen = () => {

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  return (
    <SafeAreaView>
      <Text>paymentScreen</Text>
      <TouchableOpacity onPress={openPaymentSheet}>
        <Text>Open Payment Sheet</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

export default paymentScreen