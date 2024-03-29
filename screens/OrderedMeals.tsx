import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Student } from '@/interfaces/student';
import { API_URL } from '@/config';
import axios from 'axios';

const OrderedMeals = () => {

  const [orderData, setOrderData] = useState<Student | null>(null);

  const { id } = useLocalSearchParams<{ id: string }>();

  console.log(id);

  useEffect(() => {
    const url = `${API_URL}/api/Student`;
    console.log(url + `/${id}`);

    const fetchData = async () => {
      try {
        const response = await axios.get(url + `/${id}`);
        const responseJson = response.data.data;
        setOrderData(responseJson);

        console.log("At OrderedMeals:", responseJson); // Log the updated value here

      } catch (err) {
        console.error("At OrderedMeals", err);
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
        <View>
          <Text style={styles.headerText}>Pre-Ordered Meals List for</Text>
          <Text style={styles.headerText}>{orderData?.studentName}</Text>
        </View>
      </View>

      {/* card */}
      <View style={styles.card}>
        <ScrollView style={{}}
          contentContainerStyle={{ padding: 15 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
              <Ionicons name='fast-food' size={30} />
              <Text style={{ fontFamily: 'lato-bold', fontSize: 15 }}>
                Nasi Ayam
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: "center", gap: 10 }}>
              <View style={{ alignItems: 'flex-end', gap: 5 }}>
                <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>
                  Collected
                </Text>
                <Text style={{ fontFamily: 'lato-sb', fontSize: 10, color: Colors.grey }}>
                  1/2/2024
                </Text>
              </View>
              <TouchableOpacity>
                <MaterialIcons name="more-horiz" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>

      <View style={{ paddingTop: 20, alignItems: 'flex-end', paddingRight: 10 }}>
        <TouchableOpacity
          style={[defaultStyles.btn, { paddingHorizontal: 30 }]}
          onPress={() => router.push(`/(auth)/orderMeals/mealsList?id=${orderData?.studentID}&&name=${orderData?.studentName}`)}
        >
          <Text style={{ fontFamily: 'lato-bold' }}>Order Meals</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default OrderedMeals

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: 'center',
    gap: 10
  },
  headerText: {
    fontFamily: 'lato-bold',
    fontSize: 15,
    paddingBottom: 2,
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