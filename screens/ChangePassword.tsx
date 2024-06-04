import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Keyboard, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import { API_URL } from '@/config';
import axios from 'axios';

const ChangePassword = () => {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const validatePassword = (password: string) => {
    // Example validation: at least 8 characters, contains a number
    const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return regex.test(password);
  };

  const clearInput = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmNewPassword("");
  }

  const updatePassword = async () => {
    if (!validatePassword(newPassword)) {
      Alert.alert("Invalid Password", "Password must be at least 8 characters long and contain a number and an uppercase letter.");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      Alert.alert("Password Mismatch", "New password and confirmation do not match.");
      return;
    }

    await axios.post(`${API_URL}/Auth/ChangePassword`, {
      oldPassword: currentPassword,
      newPassword
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res.data.data);
      if (res.data.success) {
        clearInput();
        Alert.alert("Success", "Password changed successfully");
        router.push('/profile');
      } else {
        Alert.alert("Error", res.data.message);
      }

    }).catch((err) => {
      console.error(err);
      Alert.alert("Error", "Failed to change password");
    });
  };

  return (
    <View>
      <View style={{ paddingHorizontal: 10 }}>
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} >
            <Ionicons name='chevron-back' size={30} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerText}>Change Password</Text>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ paddingTop: 40 }}>
            <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Current Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                secureTextEntry={!showCurrentPassword}
                style={[defaultStyles.inputField, { flex: 1 }]}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <TouchableOpacity onPress={() => setShowCurrentPassword(!showCurrentPassword)}>
                <Ionicons name={showCurrentPassword ? 'eye-off' : 'eye'} size={24} />
              </TouchableOpacity>
            </View>

            <Text style={{ paddingBottom: 10, marginLeft: 15 }}>New Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                secureTextEntry={!showNewPassword}
                style={[defaultStyles.inputField, { flex: 1 }]}
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity onPress={() => setShowNewPassword(!showNewPassword)}>
                <Ionicons name={showNewPassword ? 'eye-off' : 'eye'} size={24} />
              </TouchableOpacity>
            </View>

            <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
              <TextInput
                secureTextEntry={!showConfirmNewPassword}
                style={[defaultStyles.inputField, { flex: 1 }]}
                value={confirmNewPassword}
                onChangeText={setConfirmNewPassword}
              />
              <TouchableOpacity onPress={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                <Ionicons name={showConfirmNewPassword ? 'eye-off' : 'eye'} size={24} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[defaultStyles.btn, { marginHorizontal: 40, marginTop: 10 }]}
              onPress={updatePassword}
            >
              <Text style={defaultStyles.btnText}>Update Password</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}

export default ChangePassword

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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 20,
    gap: 5
  }
});
