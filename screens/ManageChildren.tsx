import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Student } from '@/interfaces/student';
import { API_URL } from '@/config';
import axios from 'axios';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const ManageChildren = () => {

  const [studentData, setStudentData] = useState<Student[] | null>(null);

  useEffect(() => {
    const url = `${API_URL}/api/Student/GetAll`;

    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const responseJson = response.data.data;
        setStudentData(responseJson);

        console.log(responseJson); // Log the updated value here

      } catch (err) {
        console.error("At MealsPreOrder", err);
      }
    }

    fetchData();

  }, []);

  const router = useRouter();

  return (
    <View style={{ paddingHorizontal: 10 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} >
          <Ionicons name='chevron-back' size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Manage Children</Text>
      </View>

      <View style={{ paddingTop: 20 }}>
        {studentData?.length ?
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
  }
})