import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@/config';
import axios from 'axios';
import { Student } from '@/interfaces/student';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { User } from '@/interfaces/user';
import { usePaymentSheet } from '@stripe/stripe-react-native';

const TopupScreen = () => {

  const router = useRouter();
  const [walletData, setWalletData] = useState<Student | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [amount, setAmount] = useState("");
  const [initPay, setInitPay] = useState(false);

  const [ready, setReady] = useState(false);
  const { initPaymentSheet, presentPaymentSheet, loading } = usePaymentSheet();

  const { ewalletID } = useLocalSearchParams<{ ewalletID: string }>();
  console.log(ewalletID);

  useEffect(() => {
    initialisePaymentSheet();
  }, [initPay]);

  useEffect(() => {
    const url = `${API_URL}/api/Student`;
    console.log(url + `/${ewalletID}`);

    const fetchData = async () => {
      try {
        const response = await axios.get(url + `/${ewalletID}`);
        const responseJson = response.data.data;
        setWalletData(responseJson);

        console.log("At Wallet:", responseJson); // Log the updated value here

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

        console.log("At Wallet User Data:", responseJson); // Log the updated value here

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
      setReady(true);
    }
  }

  const fetchPaymentSheetParams = async () => {
    const response = await axios.post(`${API_URL}/api/Payment/InitPayment`, {
      amount: amount,
      email: userData?.email,
      userID: 1
    });
    const { paymentIntent, ephemeralKey, customer } = response.data;

    return {
      paymentIntent,
      ephemeralKey,
      customer
    };
  };

  async function topup() {
    setInitPay(!initPay);
    const { error } = await presentPaymentSheet();

    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'The Payment Confirmed Successfully', [{ text: 'OK', onPress: () => router.navigate(`(auth)/ewallet/${walletData?.studentID}`) }]);
      setReady(false);
    }
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
            {walletData?.studentName}
          </Text>
        </View>

        <View style={styles.amountContainer}>

          <View style={[defaultStyles.inputField, { flexDirection: 'row', alignItems: 'center' }]}>
            <Text>RM </Text>
            <TextInput
              inputMode='numeric'
              placeholder='10.00'
              value={amount}
              onChangeText={handleChangeText}>
            </TextInput>
          </View>
          {/* <View style={styles.outerRow}>
          <View style={styles.innerRow}>
            <TouchableOpacity style={styles.btn}>
              <Text>RM 5</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>RM 5</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>RM 5</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.innerRow}>
            <TouchableOpacity>
              <Text>RM 5</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>RM 5</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>RM 5</Text>
            </TouchableOpacity>
          </View>
        </View> */}
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.btn}
          onPress={topup}>
          <Text>Add Funds</Text>
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
    height: 80,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: Colors.grey,
  }
})