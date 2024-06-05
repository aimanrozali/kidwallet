import { API_URL } from '@/config';
import { decodeCard } from '@/utils/BytesConvert';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import axios from 'axios';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
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
    const initNfc = async () => {
      try {
        await nfcManager.start();
        console.log("NFC STARTED");
      } catch (err) {
        console.error("NFC START ERROR:", err);
        Alert.alert("Error", "Failed to initialize NFC. Please ensure NFC is enabled on your device.");
      }
    };

    initNfc();
  }, [switchers.switcher]);

  useEffect(() => {
    const scanNfc = async (retryCount = 0) => {
      try {
        await nfcManager.requestTechnology(NfcTech.NfcA);  // Use NfcA for ISO14443A / ISO19536

        const tag = await nfcManager.getTag();
        let result = "";
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
          }, 2000);
        } else {
          scanState.setScanning('error');
          setErrorCard({ status: true, message: res.message });
        }
      } catch (err) {
        //console.error('NFC ERROR::', JSON.stringify(err));
        if (retryCount < 3) {
          console.log(`Retrying NFC scan (${retryCount + 1})...`);
          setTimeout(() => scanNfc(retryCount + 1), 1000); // Retry after 1 second
        } else {
          // scanState.setScanning('error');
          // setErrorCard({ status: true, message: 'Tag Not Supported by OS' });
        }
      } finally {
        nfcManager.cancelTechnologyRequest();
      }
    };

    scanNfc();
    return () => {
      nfcManager.cancelTechnologyRequest();
    };
  }, [switchers.switcher]);

  const updateData = async (cardNum: string) => {
    try {
      const response = await axios.post(`${API_URL}/api/Wallet/AddCard`, {
        walletID: eWalletID,
        cardID: cardNum
      });

      if (response.data.success) {
        console.log("Card added successfully");
      } else {
        console.log("Card not added: ", response.data.message);
      }
      return response.data;
    } catch (error) {
      console.error('Error updating data:', error);
      return { success: false, message: 'Failed to update data' };
    }
  };

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
