import { View, Text, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { usePaymentSheet } from '@stripe/stripe-react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { API_URL } from '@/config';
import axios from 'axios';
import { useAppSelector } from '@/hooks/hooks';
import { ActivityIndicator } from 'react-native-paper';

const paymentScreen = () => {

  const router = useRouter();
  const { studentID } = useLocalSearchParams<{ studentID: string }>();
  const [loading, setLoading] = useState(true);


  const { initPaymentSheet, presentPaymentSheet } = usePaymentSheet();

  const wallet = useAppSelector((state) => state.wallet.wallet);
  const walletID = wallet?.WalletID;
  const email = wallet?.Email;
  const amount = wallet?.Amount;


  useEffect(() => {
    const initializePaymentSheet = async () => {
      await initialisePaymentSheet();
      topup();
    };

    initializePaymentSheet();
  }, []);



  const initialisePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

    const { error } = await initPaymentSheet({
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,
      merchantDisplayName: 'KidWallet App',

    });



    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {

    }
  }

  const fetchPaymentSheetParams = async () => {
    console.log("Fetching Payment Sheet Params");
    const response = await axios.post(`${API_URL}/api/Payment/InitPayment`, {
      amount: amount,
      email: email,
      WalletID: walletID,
    });
    const { paymentIntent, ephemeralKey, customer } = response.data;

    return {
      paymentIntent,
      ephemeralKey,
      customer
    };
  };

  async function topup() {
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message, [{ text: 'OK', onPress: () => router.back() }]);
    } else {
      Alert.alert('Success', 'The Payment Confirmed Successfully', [{ text: 'OK', onPress: () => router.navigate(`(auth)/ewallet/${walletID}`) }]);
    }
    setLoading(false);

  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ alignItems: 'center', justifyContent: 'center' }} >
        <ActivityIndicator animating={loading} />
        <Text>Payment in Progress...</Text>
      </View>
    </SafeAreaView>
  )
}

export default paymentScreen