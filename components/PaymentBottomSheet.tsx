// BottomSheetContent.js
import { API_URL } from '@/config';
import { decodeCard } from '@/utils/BytesConvert';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, Button } from 'react-native';
import nfcManager, { NfcTech } from 'react-native-nfc-manager';

interface Props {
  errorState: {
    error: { status: boolean; message: string; };
    setError: React.Dispatch<React.SetStateAction<{ status: boolean; message: string; }>>;
  },
  eWalletID: string;
  scanState: {
    scanning: string;
    setScanning: React.Dispatch<React.SetStateAction<string>>;
  },
  switchers: {
    switcher: boolean;
    setSwitcher: React.Dispatch<React.SetStateAction<boolean>>;
  },
  complete: {
    completed: boolean;
    setCompleted: React.Dispatch<React.SetStateAction<boolean>>;
  }
}

const NFCBottomSheet = ({ errorState, eWalletID, scanState, switchers, complete }: Props) => {

  const [errorCard, setErrorCard] = useState({
    status: false,
    message: ''
  });

  useEffect(() => {
    nfcManager.start();
    console.log("NFC STARTED");
  }, [switchers.switcher])




  useEffect(() => {
    const scanNfc = async () => {
      try {
        await nfcManager.requestTechnology(NfcTech.Ndef);

        const tag = await nfcManager.getTag();
        var result = "";
        if (tag?.id) {
          scanState.setScanning('loading');
          result = decodeCard(tag?.id);
        }
        console.log("NFC TAG::", result);
        const res = await updateData(result);
        if (res.success) {
          scanState.setScanning('success');
          errorState.setError({ status: false, message: '' });
          setTimeout(() => {
            complete.setCompleted(true);
          }, 2000)

        }
        else {
          scanState.setScanning('error');
          setErrorCard({ status: true, message: res.message });
        }
      } catch (err) {
        //console.warn('NFC ERROR::', JSON.stringify(err));
      }
    }



    const cleanUp = () => {
      nfcManager.cancelTechnologyRequest();
    }
    scanNfc();
    cleanUp();

  }, []);


  const updateData = async (cardNum: string) => {
    const response = await axios.post(`${API_URL}/api/Wallet/AddCard`,
      {
        walletID: eWalletID,
        cardID: cardNum
      }
    );

    if (response.data.success) {
      console.log("Card added successfully");
    }
    else {
      console.log("Card not added: ", response.data.message);
    }
    return response.data;
  }

  return (
    <BottomSheetView style={styles.container} >
      <View style={styles.header}>
        <Text style={styles.title}>Add Card</Text>
        <Text style={styles.description}>Place the card at the back of your mobile phone for 5 seconds</Text>
      </View>
      <View style={styles.content}>
        {scanState.scanning === 'scanning' &&
          <LottieView
            style={styles.image}
            source={require('../assets/animation/anim.json')}
            autoPlay
          />
        }
        {scanState.scanning === 'loading' &&
          <LottieView
            style={styles.image}
            source={require('../assets/animation/loading.json')}
            autoPlay
          />
        }
        {scanState.scanning === 'success' &&
          <LottieView
            style={styles.image}
            source={require('../assets/animation/success.json')}
            autoPlay
          />
        }
        {scanState.scanning === 'error' &&
          <>
            <LottieView
              style={styles.image}
              source={require('../assets/animation/error2.json')}
              autoPlay
              loop={false}
            />
            <Text style={{ color: 'red' }}>{errorCard.message}</Text>
          </>
        }



      </View>
    </BottomSheetView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 30
  },
  title: {
    fontSize: 20,
    fontFamily: 'lato-bold',
  },
  content: {
    alignItems: 'center',
  },
  image: {
    width: '60%',
    height: '60%',
    marginBottom: 0,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'lato-sb',
    paddingTop: 5
  },
});

export default NFCBottomSheet;
