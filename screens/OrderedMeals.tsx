import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { defaultStyles } from '@/constants/Styles';
import { Student } from '@/interfaces/student';
import { API_URL } from '@/config';
import axios from 'axios';
import { Orders } from '@/interfaces/order';
import { ActivityIndicator } from 'react-native-paper';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';
import { LinearGradient } from 'expo-linear-gradient';


const OrderedMeals = () => {

  const [orderData, setOrderData] = useState<Orders[] | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

  const { id } = useLocalSearchParams<{ id: string }>();

  console.log(id);

  useEffect(() => {
    const url = `${API_URL}/api/Student`;
    console.log(url + `/${id}`);

    const fetchData = async () => {
      try {
        const response = await axios.get(url + `/${id}`);
        const responseJson = response.data.data;
        setStudent(responseJson);

        console.log("At OrderedMeals:", responseJson); // Log the updated value here

      } catch (err) {
        console.error("At OrderedMeals", err);
      }
    }

    fetchData();

  }, []);

  useEffect(() => {
    const url = `${API_URL}/api/Order/GetOrdersByStudentID`;
    console.log(url + `/${id}`);

    const fetchData = async () => {
      try {
        const response = await axios.get(url + `/${id}`);
        const responseJson = response.data.data;
        setOrderData(responseJson);

        console.log("At OrderedMealsData:", responseJson); // Log the updated value here

        setLoading(false);

      } catch (err) {
        console.error("At OrderedMeals", err);
      }
    }

    fetchData();
  }, [])


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
          <ShimmerPlaceholder visible={!loading} width={50}>
            <Text style={styles.headerText}>{student?.studentName}</Text>
          </ShimmerPlaceholder>

        </View>
      </View>

      {/* card */}
      <View style={styles.card}>
        <ScrollView style={{}}
          contentContainerStyle={{ padding: 15 }}>
          {!loading ? (
            orderData && orderData?.length > 0 ? (
              orderData.map((order, index) => (
                <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
                    <Image source={{ uri: order.meal.mealPic }} style={styles.smallImage} />

                    <Text style={{ fontFamily: 'lato-bold', fontSize: 15 }}>
                      {order.meal.mealName}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: "center", gap: 10 }}>
                    <View style={{ alignItems: 'flex-end', gap: 5 }}>
                      <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>
                        {order.status === 0 ? 'Not Collected' : order.status === 1 ? 'Collected' : 'Cancelled'}
                      </Text>
                      <Text style={{ fontFamily: 'lato-sb', fontSize: 10, color: Colors.grey }}>
                        {order.orderDate.toString()}
                      </Text>
                    </View>
                    <TouchableOpacity>
                      <MaterialIcons name="more-horiz" size={24} />
                    </TouchableOpacity>
                  </View>
                </View>
              )
              )
            ) : <Text>No Meals Ordered</Text>) :
            <ActivityIndicator animating={loading} />
          }

        </ScrollView>
      </View>

      <View style={{ paddingTop: 20, alignItems: 'flex-end', paddingRight: 10 }}>
        <TouchableOpacity
          style={[defaultStyles.btn, { paddingHorizontal: 30 }]}
          onPress={() => router.push(`/(auth)/orderMeals/mealsList?id=${student?.studentID}&&name=${student?.studentName}`)}
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
  },
  smallImage: {
    height: 45,
    width: 45,
    borderRadius: 25
  }
})