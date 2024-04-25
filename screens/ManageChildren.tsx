import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Student } from '@/interfaces/student';
import { API_URL } from '@/config';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { ActivityIndicator } from 'react-native-paper';

interface Props {
  refresh: boolean

}

const ManageChildren = (refresh: Props) => {

  const [studentData, setStudentData] = useState<Student[] | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const url = `${API_URL}/api/Student/GetAll`;

    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const responseJson = response.data.data;
        setLoading(false);
        setStudentData(responseJson);

        console.log(responseJson); // Log the updated value here

      } catch (err) {
        console.error("At MealsPreOrder", err);
      }
    }

    fetchData();

  }, [refresh]);

  const router = useRouter();

  return (
    <View style={{ paddingHorizontal: 10, flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} >
          <Ionicons name='chevron-back' size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage Children</Text>
      </View>

      <View style={{ paddingTop: 20 }}>
        {loading ? <ActivityIndicator style={{ paddingTop: 50 }} animating={true} color={Colors.primary} size='large' /> :
          studentData?.length ?
            (<ScrollView>

              {studentData?.map((item, index) => (
                <TouchableOpacity style={[styles.card, {}]}
                  onPress={() => router.navigate(`(auth)/profile/editChildren?id=${item.studentID}`)}
                  key={index}>
                  <View style={styles.cardInnerContainer}>
                    <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>{item.studentName}</Text>
                    <Ionicons name='chevron-forward' size={20} />
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>) : (

              <View style={{ alignSelf: 'center', paddingTop: 100, flexShrink: 2, width: '70%' }}>
                <Text style={{ fontFamily: "lato-sb", alignSelf: 'center', alignContent: 'center', flexWrap: 'wrap' }}>No children / dependent registered under this account. Please register first.</Text>
              </View>
            )
        }


      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={defaultStyles.btn}
          onPress={() => router.navigate(`(auth)/profile/addChildren`)}>
          <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>Add Children</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ManageChildren

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
  card: {
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
  },
  cardInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    height: 100,
    bottom: -30,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: Colors.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
  }
})