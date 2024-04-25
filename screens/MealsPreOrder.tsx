import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter, useSegments } from 'expo-router'
import { Student } from '@/interfaces/student'
import { API_URL } from '@/config'
import axios from 'axios'
import { useAuth } from '@/context/AuthContext'

interface Props {
  refresh: boolean;
}

const MealsPreOrder = (refresh: Props) => {

  const { authState } = useAuth();

  const [studentData, setStudentData] = useState<Student[] | null>(null);

  const segments = useSegments();

  // Get student data on mount and refresh if necessary

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

  }, [refresh, segments]);

  const router = useRouter();

  return (
    <View style={{ paddingHorizontal: 10 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} >
          <Ionicons name='chevron-back' size={30} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Meals Pre-Order</Text>
      </View>

      <View style={{ paddingTop: 20 }}>
        {studentData?.length ?
          (<ScrollView>

            {studentData?.map((item, index) => (
              <TouchableOpacity style={[styles.card, {}]}
                onPress={() => router.navigate('(auth)/orderMeals/orderedList?id=' + item.studentID)}
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

export default MealsPreOrder

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