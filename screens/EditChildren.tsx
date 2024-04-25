import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Keyboard, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { API_URL } from '@/config';
import axios from 'axios';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import DropDownPicker from 'react-native-dropdown-picker';
import { ActivityIndicator, Modal, RadioButton } from 'react-native-paper';

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
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [studentID, setStudentID] = useState(parseInt(id));
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

  const deletePrompt = () => {
    Alert.alert("Delete", "Are you sure you want to delete this child?",
      [{ text: 'Cancel', onPress: () => console.log('Cancel Pressed') }, { text: 'Delete', style: 'destructive', onPress: () => handleDelete() }]
    );
  }

  const deleteChild = async () => {
    let resp = false;
    await axios.delete(`${API_URL}/api/Student/${id}`)
      .then((response) => {
        resp = true;
        console.log(response.data);
      })
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error('Error status:', error.response?.status);
          console.error('Error message:', error.response?.data);
        } else {
          console.error('Unexpected error:', error);
        }
      });
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
            <TouchableOpacity
              style={[defaultStyles.btnDel, { marginHorizontal: 40, marginTop: 10 }]}
              onPress={deletePrompt}
            >
              <Text style={defaultStyles.btnText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>

      </View>
      <Modal visible={loading} dismissable={false} contentContainerStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', flex: 1, justifyContent: 'center', alignItems: 'center' }}>

        <ActivityIndicator animating={loading} color="#E2EF09" size="large" style={{ position: 'absolute', top: '45%', left: '45%', zIndex: 1 }} />

      </Modal>
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