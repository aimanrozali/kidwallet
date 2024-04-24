import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Pressable, Alert } from 'react-native'
import React, { useState } from 'react'
import { useRouter } from 'expo-router'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import { RadioButton } from 'react-native-paper';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DatePicker from 'react-native-date-picker';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_URL } from '@/config';
import moment from 'moment';

const allergics = [
  { name: "Tree Nuts", value: "Tree Nuts" },
  { name: "Dairy", value: "Dairy" },
  { name: "Eggs", value: "Eggs" },
  { name: "Wheat", value: "Wheat" },
  { name: "Soy", value: "Soy" },
  { name: "Bean", value: "Bean" },
  { name: "Seafood", value: "Seafood" },
];

const AddChildren = () => {

  const router = useRouter();

  const [gender, setGender] = useState('');
  const [allergy, setAllergens] = useState([]);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [grade, setGrade] = useState('');
  const [className, setClassName] = useState('');
  const [name, setName] = useState('');

  let todayDate = new Date()

  const handleAdd = async () => {
    let res = await addChild();
    if (res) {
      Alert.alert('Success', 'Child added successfully', [{ text: 'OK', onPress: () => router.navigate('(auth)/profile/manageChildren') }]);
    } else {
      Alert.alert('Error', 'Failed to add child');
    }
  }

  const addChild = async () => {
    let result = false;
    await axios.post(`${API_URL}/api/Student`, {
      studentName: name,
      birthDate: modifyDate(),
      gender: gender,
      grade: grade,
      className: className,
      allergy: allergy,
    },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then((response) => {
        console.log(response.data);
        result = response.data.success;
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error('Error status:', error.response?.status);
          console.error('Error message:', error.response?.data);
        } else {
          console.error('Unexpected error:', error);
        }
      });

    return result;
  }

  const modifyDate = () => {
    let parsedDate = moment(date, 'M/D/YYYY');
    return parsedDate.format('YYYY-MM-DD');
  }

  return (
    <View style={{ paddingHorizontal: 10, flex: 1 }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} >
          <Ionicons name='chevron-back' size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Children</Text>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.formStyle}>
          <Text style={styles.formText}>Name</Text>
          <TextInput
            style={[defaultStyles.inputField, styles.inputFieldCont]}
            value={name}
            onChangeText={setName}
          />

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
            maximumDate={todayDate}
            onConfirm={(date) => {
              setDate(date)
              setOpen(false)
            }}
            onCancel={() => {
              setOpen(false)
            }}
          />

          <Text style={styles.formText}>Gender</Text>

          <View style={{ flexDirection: 'row', paddingBottom: 10 }}>
            <RadioButton.Android
              value='Male'
              status={gender === 'm' ? 'checked' : 'unchecked'}
              onPress={() => setGender('m')}
              color="#007BFF"
            />
            <Text style={{ textAlignVertical: 'center' }}>Male</Text>

            <RadioButton.Android
              value='Female'
              status={gender === 'f' ? 'checked' : 'unchecked'}
              onPress={() => setGender('f')}
              color="#007BFF"
            />
            <Text style={{ textAlignVertical: 'center' }}>Female</Text>

          </View>

          {/* <TextInput
            style={[defaultStyles.inputField, styles.inputFieldCont]}
          /> */}

          <Text style={styles.formText}>Grade</Text>

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

          {/* <TextInput
            style={[defaultStyles.inputField, styles.inputFieldCont]}
          /> */}

          <Text style={styles.formText}>Class Name</Text>

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

          {/*<TextInput
            style={[defaultStyles.inputField, styles.inputFieldCont]}
          /> */}

          <Text style={styles.formText}>Allergics</Text>
          <SectionedMultiSelect
            IconRenderer={MaterialIcons} // Provide the correct type for IconRenderer prop
            items={allergics}
            uniqueKey="value"
            onSelectedItemsChange={(items: any[]) => setAllergens(items as never[])} // Update the type of setAllergens to accept an array of any type
            selectedItems={allergy}
            styles={{
              container: styles.multiSelectContainer,
              backdrop: styles.multiSelectBackdrop,
              selectToggle: styles.multiSelectBox,
            }}
          />

          <TouchableOpacity
            style={[defaultStyles.btn, { marginHorizontal: 40, marginTop: 10 }]}
            onPress={handleAdd}
          >
            <Text style={defaultStyles.btnText}>Add Children</Text>
          </TouchableOpacity>

        </View>

      </TouchableWithoutFeedback>

    </View>
  )
}

export default AddChildren

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 10,
    alignItems: 'center',
    gap: 10
  },
  headerText: {
    fontFamily: 'lato-bold',
    fontSize: 15
  },
  formStyle: {
    paddingTop: 20,
    marginHorizontal: 20
  },
  inputFieldCont: {
    marginBottom: 20,
  },
  formText: {
    paddingBottom: 10
  },
  multiSelectBackdrop: {
    backgroundColor: 'grey',
  },
  multiSelectBox: {
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#bbb',
    padding: 12,
    marginBottom: 12
  },
  multiSelectContainer: {
    paddingBottom: 10, marginLeft: 15
  }
})