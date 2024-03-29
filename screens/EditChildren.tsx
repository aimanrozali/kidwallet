import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_URL } from '@/config';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DropDownPicker from 'react-native-dropdown-picker';
import { RadioButton } from 'react-native-paper';

const allergics = [
  { name: "Tree Nuts", value: "Tree Nuts" },
  { name: "Dairy", value: "Dairy" },
  { name: "Eggs", value: "Eggs" },
  { name: "Wheat", value: "Wheat" },
  { name: "Soy", value: "Soy" },
  { name: "Bean", value: "Bean" },
  { name: "Seafood", value: "Seafood" },
];

const genders = [
  { name: "Male", value: "Male" },
  { name: "Female", value: "Female" }
];

const EditChildren = () => {

  const { id } = useLocalSearchParams<{ id: string }>();

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
        setBirthDate(responseJson.birthDate);
        setAllergens(responseJson.allergy);
        //setLoading(false);
        console.log("Header")

      } catch (err) {
        console.error(err);
      }
    }

    fetchData();

  }, []);


  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [studentID, setStudentID] = useState(id);
  const [studentName, setStudentName] = useState("");
  const [grade, setGrade] = useState("");
  const [className, setClassName] = useState("");
  const [gender, setGender] = useState('');
  const [birthDate, setBirthDate] = useState(Date);
  const [allergy, setAllergens] = useState([]);
  const [genderItems, setGenderItems] = useState([
    { name: "Male", value: "m" },
    { name: "Female", value: "f" }
  ]);

  const update = async () => {
    console.log(allergy);
    await axios.put(`${API_URL}/api/Student`, { studentID, studentName, grade, className, gender, birthDate, allergy }, {
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => {
      console.log(res.data.data);
      alert("Data successfully updated!");
    })
      .catch((err) => {
        console.error(err);
      });
  }

  const updateData = async () => {

  }



  return (
    <View>
      <View style={{ paddingHorizontal: 10 }}>
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} >
            <Ionicons name='chevron-back' size={30} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerText}>Edit Profile</Text>
          </View>
        </View>

        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ paddingTop: 40 }}>
            <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Name</Text>
            <TextInput
              style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
              value={studentName}
              onChangeText={setStudentName}
            />

            <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Grade</Text>
            <TextInput
              style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
              value={grade}
              onChangeText={setGrade}
            />

            <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Class Name</Text>
            <TextInput
              keyboardType='phone-pad'
              style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
              value={className}
              onChangeText={setClassName}
            />

            <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Birth Date</Text>
            <TextInput
              style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
              value={birthDate}
              onChangeText={setBirthDate}
            />

            <Text style={{ paddingBottom: 10, marginLeft: 15 }}>Gender</Text>
            <View style={{ flexDirection: 'row' }}>
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
              style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
              value={gender}
              onChangeText={setGender}
            /> */}

            <Text style={{ paddingBottom: 10, marginLeft: 15, paddingTop: 10 }}>Allergics</Text>
            {/* <View style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}>
              <Text>{allergy.join(', ')}</Text>
            </View> */}
            <SectionedMultiSelect
              IconRenderer={MaterialIcons}
              items={allergics}
              uniqueKey="value"
              onSelectedItemsChange={setAllergens}
              selectedItems={allergy}
              styles={{
                container: styles.multiSelectContainer,
                backdrop: styles.multiSelectBackdrop,
                selectToggle: styles.multiSelectBox,
              }}

            />
            {/* <TextInput
              style={[defaultStyles.inputField, { marginBottom: 20, marginHorizontal: 20 }]}
              value={allergens}
              onChangeText={setAllergens}
            /> */}

            <TouchableOpacity
              style={[defaultStyles.btn, { marginHorizontal: 40, marginTop: 10 }]}
              onPress={update}
            >
              <Text style={defaultStyles.btnText}>Update</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </View>
  )
}

export default EditChildren

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