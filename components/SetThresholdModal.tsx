import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Modal } from 'react-native';
import Colors from '@/constants/Colors';
import axios from 'axios';
import { API_URL } from '@/config';

interface Props {
  isVisible: boolean;
  onClose: () => void;
  walletId: string;
  onThresholdSet: (threshold: number) => void;
  thresholdvalue: number;

}

const SetThresholdModal = ({ isVisible, onClose, walletId, onThresholdSet, thresholdvalue }: Props) => {
  const [threshold, setThreshold] = useState(thresholdvalue.toString());
  const [loading, setLoading] = useState(false);
  console.log(walletId);

  const handleSetThreshold = async () => {
    const value = parseFloat(threshold);
    if (isNaN(value) || value < 5 || value > 100) {
      Alert.alert('Invalid Input', 'Please enter a number between 5 and 100.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(`${API_URL}/api/Wallet/SetThreshold`, {
        walletId,
        threshold: value,
      });

      if (response.data.success) {
        onThresholdSet(value);
        Alert.alert('Success', 'Daily spending threshold set successfully');
        onClose();
      } else {
        Alert.alert('Error', 'Failed to set threshold. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType='slide'
      transparent
      style={styles.modal}
      visible={isVisible}
      onRequestClose={onClose}>
      <View style={styles.modalContent}>
        <Text style={styles.title}>Set Daily Spending Threshold</Text>
        <TextInput
          placeholder="Enter amount"
          value={threshold}
          onChangeText={(text) => setThreshold(text.replace(/[^0-9]/g, ''))}
          keyboardType="numeric"
          style={styles.input}
        />
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={handleSetThreshold} disabled={loading}>
            <Text style={styles.buttonText}>Set Threshold</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1

  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    top: '30%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginLeft: 10,
  },
  cancelButton: {
    backgroundColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SetThresholdModal;
