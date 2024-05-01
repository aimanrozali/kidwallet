import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@/config';
import axios from 'axios';
import { Student, Wallet } from '@/interfaces/student';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { User } from '@/interfaces/user';
import { usePlatformPay, PlatformPayButton, PlatformPay } from '@stripe/stripe-react-native';
import { useDispatch } from 'react-redux';
import { setEmail, setPayAmount, setWallet } from '@/hooks/PaymentReducer';

const TopupScreen = () => {

  const { isPlatformPaySupported, confirmPlatformPayPayment } = usePlatformPay();

  const router = useRouter();
  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [amount, setAmount] = useState<number>();
  const [supportGPay, setSupportGPay] = useState(true);
  const dispatch = useDispatch();

  // const [ready, setReady] = useState(false);
  // const { initPaymentSheet, presentPaymentSheet, loading, resetPaymentSheetCustomer } = usePaymentSheet();

  const { ewalletID } = useLocalSearchParams<{ ewalletID: string }>();
  //console.log(ewalletID);

  // useEffect(() => {
  //   initialisePaymentSheet();
  // }, []);

  useEffect(() => {
    (async function () {
      if (!(await isPlatformPaySupported({ googlePay: { testEnv: true } }))) {
        setSupportGPay(false);
        return;
      }
    })();
  }, [])

  useEffect(() => {
    const url = `${API_URL}/api/Wallet`;
    //console.log(url + `/${ewalletID}`);

    const fetchData = async () => {
      try {
        const response = await axios.get(url + `/${ewalletID}`);
        const responseJson = response.data.data;
        setWalletData(responseJson);

        //console.log("At Wallet:", responseJson); // Log the updated value here

      } catch (err) {
        console.error("At Wallet", err);
      }
    }

    fetchData();

  }, []);

  useEffect(() => {
    const url = `${API_URL}/api/User/GetInfo`;

    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const responseJson = response.data.data;
        setUserData(responseJson);

        //console.log("At Wallet User Data:", responseJson); // Log the updated value here

      } catch (err) {
        console.error("At Wallet", err);
      }
    }

    fetchData();

  }, []);

  const handleChangeText = (text: any) => {
    // Remove any non-numeric characters from the input
    const numericText = text.replace(/[^0-9]/g, '');
    setAmount(numericText);
  };

  const fetchPaymentSheetParams = async () => {
    const response = await axios.post(`${API_URL}/api/Payment/InitPayment`, {
      amount: amount,
      email: userData?.email,
      WalletID: walletData?.walletID,
    });
    const { paymentIntent } = response.data;

    return {
      paymentIntent,
    };
  };

  const pay = async () => {
    const { paymentIntent } = await fetchPaymentSheetParams();

    const { error } = await confirmPlatformPayPayment(
      paymentIntent,
      {
        googlePay: {
          testEnv: true,
          merchantName: 'KidWallet App',
          merchantCountryCode: 'MY',
          currencyCode: 'MYR',

        },
      }
    );

    if (error) {
      Alert.alert(error.code, error.message, [{ text: 'OK', onPress: () => router.back() }]);
      // Update UI to prompt user to retry payment (and possibly another payment method)
      return;
    }
    Alert.alert('Success', 'The payment was confirmed successfully.', [{ text: 'OK', onPress: () => router.back() }]);
  }

  const payByCard = async () => {
    dispatch(setWallet(walletData?.walletID));
    dispatch(setPayAmount(amount));
    dispatch(setEmail(userData?.email));
    router.push(`/(auth)/ewallet/paymentScreen?studentID=${walletData?.student.studentID}`);
  }


  return (
    <>
      <View style={styles.innerContainer}>
        {/* Screen header */}
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons
              name='chevron-back'
              size={25}
              onPress={() => router.back()} />
          </TouchableOpacity>
        </View>
        {/* Wallet Header */}
        <View style={styles.textContainer}>
          <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>
            Add funds for
          </Text>
          <Text style={{ fontFamily: 'lato-bold', fontSize: 15 }}>
            {walletData?.student.studentName}
          </Text>
        </View>

        <View style={styles.amountContainer}>

          <View style={[defaultStyles.inputField, { flexDirection: 'row', alignItems: 'center' }]}>
            <Text>RM </Text>
            <TextInput
              inputMode='numeric'
              placeholder='10.00'
              value={amount?.toString()}
              onChangeText={handleChangeText}>
            </TextInput>
          </View>
        </View>
      </View>

      {/* Footer */}


      <View style={[styles.footer, { gap: 10 }]}>
        <PlatformPayButton
          type={PlatformPay.ButtonType.Pay}
          onPress={pay}
          style={{
            width: '100%',
            height: 50,
          }}
        />
        <TouchableOpacity style={styles.btn}
          onPress={payByCard}>
          <Text>Pay With Card, GrabPay</Text>
        </TouchableOpacity>
      </View>
    </>

  )
}

export default TopupScreen

const styles = StyleSheet.create({
  innerContainer: {
    paddingHorizontal: 20
  },
  header: {
    paddingTop: 10,
    height: 40,
  },
  textContainer: {
    gap: 8,
    paddingTop: 20,
  },
  amountContainer: {
    paddingTop: 20,
  },
  innerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 30,
    marginHorizontal: 20
  },
  outerRow: {
    justifyContent: 'space-between',
    paddingTop: 20,
  },
  btn: {
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnOutline: {
    backgroundColor: '#fff',
    height: 50,
    borderWidth: 0.5,
    borderColor: Colors.dark,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: '#000',
    fontSize: 13,
    fontFamily: 'lato-bold',
  },
  btnIcon: {
    position: 'absolute',
    left: 16,
  },
  footer: {
    position: 'absolute',
    height: 'auto',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: Colors.grey,
  }
})