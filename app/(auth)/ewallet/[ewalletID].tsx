import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter, useSegments } from 'expo-router';
import { FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { API_URL } from '@/config';
import axios from 'axios';
import { Wallet } from '@/interfaces/student';
import nfcManager from 'react-native-nfc-manager';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet from '@gorhom/bottom-sheet';
import NFCBottomSheet from '@/components/PaymentBottomSheet';
import TransactionList from '@/components/TransactionList';
import SetThresholdModal from '@/components/SetThresholdModal';

const WalletPage = () => {
  const router = useRouter();
  const segments = useSegments();
  const insets = useSafeAreaInsets();

  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState({ status: false, message: '' });
  const [nfcInitiated, setNfcInitiated] = useState(false);
  const [scanning, setScanning] = useState('scanning');
  const [switcher, setSwitcher] = useState(false);
  const [isThresholdModalVisible, setThresholdModalVisible] = useState(false);

  const { ewalletID } = useLocalSearchParams<{ ewalletID: string }>();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const { height } = Dimensions.get('window');
  const snapPoints = [height * 0.45];  // 45% of the screen height

  const openBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
    }
  };

  useEffect(() => {
    completed ? (
      bottomSheetRef.current?.close()
    ) : null;
  }, [completed]);

  const handleSheetChanges = async (index: number) => {
    console.log('handleSheetChanges', index);
    if (index === 0) {
      // Bottom sheet is open
      await startNfcScan();
    } else if (index === -1) {
      // Bottom sheet is closed
      console.log('Bottom sheet is closed');
      setScanning('scanning');
      console.log("Unmounting NFC");
      nfcManager.cancelTechnologyRequest();
      nfcManager.unregisterTagEvent();
      setNfcInitiated(false);
    }
  };

  useEffect(() => {
    const url = `${API_URL}/api/Wallet`;
    console.log(url + `/${ewalletID}`);

    const fetchData = async () => {
      try {
        const response = await axios.get(url + `/${ewalletID}`);
        const responseJson = response.data.data;
        setWalletData(responseJson);
        setLoading(false);
        if (responseJson.cardID === null) {
          setError({ status: true, message: 'No card registered. Please register to do any transaction in school.' });
        }

        console.log("At Wallet:", responseJson); // Log the updated value here
      } catch (err) {
        console.error("At Wallet", err);
      }
    };

    fetchData();
  }, [segments]);

  const startNfcScan = async () => {
    setSwitcher(!switcher);
    setNfcInitiated(true);
  };

  const scanNfc = async () => {
    openBottomSheet();
  };

  const handleSetThreshold = (newThreshold: any) => {
    if (walletData) {
      setWalletData({ ...walletData, dailySpendingLimit: newThreshold });
    }
  };

  // Get Today's full date and day
  let todayDate = new Date();
  var today = todayDate.toLocaleDateString("en-MY", { month: 'long', year: 'numeric', day: 'numeric' });

  return (
    <SafeAreaView style={styles.container} >
      <GestureHandlerRootView style={styles.gestureHandlerRootView}>
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
            <Text style={{ fontFamily: 'lato-bold', fontSize: 15 }}>
              {walletData?.student.studentName}
            </Text>
            <Text style={{ fontFamily: 'lato-sb', fontSize: 12 }}>
              Total Balance
            </Text>
            <Text style={{ fontFamily: 'lato-black', fontSize: 25 }}>
              RM{walletData?.walletBalance.toFixed(2)}
            </Text>
          </View>

          <View style={styles.mainButtonContainer}>
            <TouchableOpacity style={styles.btn}
              onPress={() => router.navigate(`/(auth)/ewallet/topupScreen?ewalletID=${ewalletID}`)}>
              <Ionicons name='add-circle-outline' size={35} />
              <Text style={styles.btnText}>Add Funds</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={() => setThresholdModalVisible(true)}>
              <FontAwesome6 name="edit" size={35} />
              <Text style={styles.btnText}>Edit Threshold</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={scanNfc}>
              <MaterialIcons name="add-card" size={35} />
              <Text style={styles.btnText}>{walletData?.cardID ? 'Update Card' : 'Add Card'}</Text>
            </TouchableOpacity>
          </View>

          {/* Warning Container */}
          {error.status && (
            <View style={styles.warningCard}>
              <View style={{ padding: 10, flexDirection: 'row', gap: 10 }}>
                <MaterialCommunityIcons name="alert-circle" size={24} color="black" />
                <Text>{error.message}</Text>
              </View>
            </View>
          )}

          {/* Threshold card */}
          <View style={styles.thresholdCard}>
            <View>
              <Text style={{ fontFamily: 'lato-bold', fontSize: 15 }}>Current Daily Spending Threshold</Text>
              <Text style={{ fontFamily: 'lato-black', fontSize: 18, paddingVertical: 5 }}>RM{walletData?.dailySpendingLimit.toFixed(2)}</Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <Text style={{ fontFamily: 'lato-sb', fontSize: 13, color: Colors.grey }}>RM{walletData?.totalSpentToday.toFixed(2)} Spent Today</Text>
                <Text style={{ fontFamily: 'lato-sb', fontSize: 13, color: Colors.grey }}>|</Text>
                <Text style={{ fontFamily: 'lato-sb', fontSize: 13, color: walletData?.reachLimit ? 'red' : 'green' }}>{walletData?.reachLimit ? "Limit reached" : "RM" + (walletData?.dailySpendingLimit ?? 0 - (walletData?.totalSpentToday ?? 0)).toFixed(2) + " before limit"}</Text>
              </View>
            </View>
          </View>

          {/* Transaction History */}
          <View style={styles.transactionHistoryContainer}>
            <View style={styles.transactionHistoryHeader}>
              <Text style={{ fontFamily: 'lato-bold', fontSize: 15 }}>
                Transaction History
              </Text>
              <Text style={{ fontFamily: 'lato-sb', fontSize: 12, color: Colors.grey }}>
                Today, {today}
              </Text>
            </View>

            <TransactionList walletTrans={walletData?.transactions} loading={loading} />
          </View>
        </View>
        <BottomSheet
          ref={bottomSheetRef}
          index={-1}
          snapPoints={snapPoints}
          enablePanDownToClose={true}
          onChange={handleSheetChanges}
          style={styles.sheetContainer}
        >
          <NFCBottomSheet errorState={{ error, setError }} eWalletID={ewalletID} scanState={{ scanning, setScanning }} switchers={{ switcher, setSwitcher }} complete={{ completed, setCompleted }} />
        </BottomSheet>

        {
          walletData?.dailySpendingLimit && (
            <SetThresholdModal
              isVisible={isThresholdModalVisible}
              onClose={() => setThresholdModalVisible(false)}
              walletId={ewalletID}
              thresholdvalue={walletData?.dailySpendingLimit || 0}
              onThresholdSet={handleSetThreshold}
            />
          )
        }


      </GestureHandlerRootView>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  gestureHandlerRootView: {
    flex: 1,
  },
  header: {
    paddingTop: 10,
    height: 'auto',
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  textContainer: {
    gap: 8,
    paddingTop: 20,
    height: 'auto',
  },
  mainButtonContainer: {
    paddingTop: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    height: 'auto',
  },
  btn: {
    alignItems: 'center',
  },
  btnText: {
    fontFamily: 'lato-sb',
    fontSize: 12,
    paddingTop: 5,
  },
  thresholdCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    margin: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center', // added this to fix the align-items error
  },
  transactionHistoryContainer: {
    flex: 1,  // This makes the transaction history take up remaining space
    paddingHorizontal: 0,
    paddingTop: 2,
  },
  transactionHistoryHeader: {
    paddingVertical: 10,
    gap: 10,
  },
  warningCard: {
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    marginVertical: 10,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sheetContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 1,
      height: 1,
    },
    marginHorizontal: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%'
  }
});

export default WalletPage;
