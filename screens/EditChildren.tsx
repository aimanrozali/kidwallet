import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Pressable, Alert, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import { ActivityIndicator, Modal, RadioButton } from 'react-native-paper';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DatePicker from 'react-native-date-picker';
import axios from 'axios';
import { API_URL } from '@/config';
import moment from 'moment';
import Colors from '@/constants/Colors';
import { useLocalSearchParams } from 'expo-router';
import { Picker } from '@react-native-picker/picker';

const allergics = [
  { name: "Tree Nuts", value: "Tree Nuts" },
  { name: "Dairy", value: "Dairy" },
  { name: "Eggs", value: "Eggs" },
  { name: "Wheat", value: "Wheat" },
  { name: "Soy", value: "Soy" },
  { name: "Bean", value: "Bean" },
  { name: "Seafood", value: "Seafood" },
];

const EditChildren = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [studentID, setStudentID] = useState(parseInt(id));
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState("");
  const [className, setClassName] = useState("");
  const [gender, setGender] = useState('');
  const [date, setDate] = useState(new Date());
  const [allergy, setAllergens] = useState([]);

  useEffect(() => {
    const url = `${API_URL}/api/Student/${id}`;

    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const responseJson = response.data.data;
        setStudentName(responseJson.studentName);
        setGrade(responseJson.grade);
        setClassName(responseJson.className);
        setGender(responseJson.gender);
        setDate(new Date(responseJson.birthDate));
        setAllergens(responseJson.allergy);
      } catch (err) {
        console.error(err);
      }
    }

    fetchData();
  }, [id]);

  const update = async () => {
    setLoading(true);
    try {
      await axios.put(`${API_URL}/api/Student`, {
        studentID, studentName, grade, className, gender, birthDate: modifyDate(), allergy
      }, {
        headers: { 'Content-Type': 'application/json' }
      });
      setLoading(false);
      Alert.alert('Success', 'Data successfully updated!');
    } catch (err) {
      setLoading(false);
      console.error(err);
      Alert.alert('Error', 'Failed to update data');
    }
  }

  const deletePrompt = () => {
    Alert.alert("Delete", "Are you sure you want to delete this child?", [
      { text: 'Cancel', onPress: () => console.log('Cancel Pressed') },
      { text: 'Delete', style: 'destructive', onPress: () => handleDelete() }
    ]);
  }

  const deleteChild = async () => {
    let resp = false;
    try {
      await axios.delete(`${API_URL}/api/Student/${id}`);
      resp = true;
    } catch (error) {
      console.error('Unexpected error:', error);
    }
    return resp;
  };

  const handleDelete = async () => {
    setLoading(true);
    let res = await deleteChild();
    if (res) {
      setLoading(false);
      Alert.alert('Success', 'Child deleted successfully', [{ text: 'OK', onPress: () => router.navigate('(auth)/profile/manageChildren') }]);
    } else {
      setLoading(false);
      Alert.alert('Error', 'Failed to delete child');
    }
  }

  const modifyDate = () => {
    let parsedDate = moment(date, 'M/D/YYYY');
    return parsedDate.format('YYYY-MM-DD');
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} >
          <Ionicons name='chevron-back' size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>
      <ScrollView style={{ flex: 1, paddingHorizontal: 10 }}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.formStyle}>
            <Text style={styles.formText}>Name</Text>
            <TextInput
              style={[defaultStyles.inputField, styles.inputFieldCont]}
              value={studentName}
              onChangeText={setStudentName}
            />

            <Text style={styles.formText}>Grade</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={defaultStyles.inputField}
                selectedValue={grade}
                onValueChange={(itemValue, itemIndex) =>
                  setGrade(itemValue)
                }>
                <Picker.Item label="Grade 1" value="1" />
                <Picker.Item label="Grade 2" value="2" />
                <Picker.Item label="Grade 3" value="3" />
                <Picker.Item label="Grade 4" value="4" />
                <Picker.Item label="Grade 5" value="5" />
                <Picker.Item label="Grade 6" value="6" />
              </Picker>
            </View>

            <Text style={styles.formText}>Class Name</Text>
            <View style={styles.pickerContainer}>
              <Picker
                style={defaultStyles.inputField}
                selectedValue={className}
                onValueChange={(itemValue, itemIndex) =>
                  setClassName(itemValue)
                }>
                <Picker.Item label="A" value="a" />
                <Picker.Item label="B" value="b" />
                <Picker.Item label="C" value="c" />
                <Picker.Item label="D" value="d" />
              </Picker>
            </View>

            <Text style={styles.formText}>Birth Date</Text>
            <Pressable onPress={() => setOpen(true)}>
              <View pointerEvents='none'>
                <TextInput
                  style={[defaultStyles.inputField, styles.inputFieldCont]}
                  value={date.toLocaleDateString()}
                />
              </View>
            </Pressable>
            <DatePicker
              modal
              mode='date'
              locale='en-MY'
              open={open}
              date={date}
              maximumDate={new Date()}
              onConfirm={(date) => {
                setDate(date);
                setOpen(false);
              }}
              onCancel={() => {
                setOpen(false);
              }}
            />

            <Text style={styles.formText}>Gender</Text>
            <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
              <RadioButton.Android
                value='Male'
                status={gender === 'm' ? 'checked' : 'unchecked'}
                onPress={() => setGender('m')}
                color={Colors.primary}
              />
              <Text style={{ textAlignVertical: 'center', marginRight: 20 }}>Male</Text>

              <RadioButton.Android
                value='Female'
                status={gender === 'f' ? 'checked' : 'unchecked'}
                onPress={() => setGender('f')}
                color={Colors.primary}
              />
              <Text style={{ textAlignVertical: 'center' }}>Female</Text>
            </View>

            <Text style={styles.formText}>Allergics</Text>
            <SectionedMultiSelect
              IconRenderer={MaterialIcons}
              items={allergics}
              uniqueKey="value"
              onSelectedItemsChange={(items) => setAllergens(items)}
              selectedItems={allergy}
              styles={{
                container: styles.multiSelectContainer,
                backdrop: styles.multiSelectBackdrop,
                selectToggle: styles.multiSelectBox,
              }}
            />

            <TouchableOpacity
              style={[defaultStyles.btn, { marginHorizontal: 40, marginTop: 10 }]}
              onPress={update}
            >
              <Text style={defaultStyles.btnText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[defaultStyles.btn, styles.deleteButton]}
              onPress={deletePrompt}
            >
              <Text style={defaultStyles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </ScrollView>

      <Modal visible={loading} dismissable={false} contentContainerStyle={styles.loadingModal}>
        <ActivityIndicator animating={loading} color={Colors.primary} size="large" />
      </Modal>
    </View>
  );
}

export default EditChildren;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 10,
    alignItems: 'center',
    gap: 10,
  },
  headerText: {
    fontFamily: 'lato-bold',
    fontSize: 18,
    color: 'black',
  },
  formStyle: {
    paddingTop: 20,
    marginHorizontal: 20,
  },
  inputFieldCont: {
    marginBottom: 20,
  },
  formText: {
    paddingBottom: 10,
    fontFamily: 'lato-bold',
    color: 'black',
  },
  multiSelectBackdrop: {
    backgroundColor: 'grey',
  },
  multiSelectBox: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#bbb',
    padding: 12,
    marginBottom: 12,
  },
  multiSelectContainer: {
    paddingBottom: 10,
    marginLeft: 15,
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#bbb',
  },
  deleteButton: {
    backgroundColor: Colors.red,
    marginHorizontal: 40,
    marginTop: 10,
  },
  loadingModal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
