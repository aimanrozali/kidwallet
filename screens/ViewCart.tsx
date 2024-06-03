import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { CartItem, clearCart, selectTotalPrice } from '@/hooks/CardReducer';
import { RootState } from '@/store/store';
import DatePicker from 'react-native-date-picker';
import { ActivityIndicator } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '@/config';
import { Wallet } from '@/interfaces/student';
import moment from 'moment';

const ViewCart = () => {

  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [walletData, setWalletData] = useState<Wallet | null>(null);
  const [cartEmpty, setCartEmpty] = useState(false);
  const [mealsData, setMealsData] = useState<number[]>([]);
  const [mealQuantity, setMealQuantity] = useState<number[]>([]);
  const [vendorData, setVendorData] = useState<number[]>([]);
  //const { orderDate } = useLocalSearchParams<{ orderDate: string }>();
  // const [date, setDate] = useState(new Date(orderDate));
  // console.log("ORDER DATE::", orderDate);


  // Get the cart items from Redux
  const orderName = useAppSelector((state) => state.name.name);
  let todayDate = new Date();
  const orderDate = useAppSelector((state) => state.date.date);
  const [date, setDate] = useState(new Date(orderDate));
  //console.log(orderDate);
  let cart = []
  cart = useAppSelector((state: RootState) => state.cart.cart[id]) ?? [];
  let subtotal = 0;
  if (typeof cart === 'undefined') {
    setCartEmpty(true);
    console.log("CART EMPTY::", cartEmpty)
  } else {
    // const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0) ?? 0;
    subtotal = useAppSelector((state: RootState) => selectTotalPrice(id)(state.cart));
    //console.log("CART::", cart)
  }

  // Assume a tax rate of 0%
  const taxRate = 0;
  // Calculate the tax amount
  const tax = subtotal * taxRate;

  // Calculate the total
  const total = subtotal + tax;

  console.log("CART::", cart);

  useEffect(() => {
    const mealsData = cart.map(item => item.mealID);
    const mealQuantity = cart.map(item => item.quantity);
    const vendorsData = cart.map(item => item.vendorID);
    setMealsData(mealsData as any);
    setMealQuantity(mealQuantity as any);
    setVendorData(vendorsData as any);
    console.log("MEALS DATA::", mealsData);
    console.log("MEAL QUANTITY::", mealQuantity);
    console.log("VENDORS DATA::", vendorsData);
  }, []);



  useEffect(() => {
    const url = `${API_URL}/api/Student`;
    //console.log(url + `/${id}`);

    const fetchData = async () => {
      try {
        const response = await axios.get(url + `/${id}`);
        const responseJson = response.data.data;
        setWalletData(responseJson.wallet);

        //console.log("At Wallet:", responseJson); // Log the updated value here

      } catch (err) {
        console.error("At Wallet", err);
      }
    }

    fetchData();

  }, []);


  const handleSubmit = async () => {
    setLoading(true);
    var response = await submitOrder();
    //console.log(response);
    if (response?.data.success) {

      var respOrder = await submitOrderDetails();

      if (respOrder?.data.success) {

        Alert.alert('Order Placed', 'Your order has been placed successfully');
        dispatch(clearCart({ studentID: id }));
        router.push(`/orderMeals/orderedList?id=${id}`)

      }
    }
    else {
      Alert.alert('Order Failed', response?.data.data);
    }
    setLoading(false);
  }

  const submitOrder = async () => {
    try {
      //console.log(requestData, "REQUEST DATA")
      //console.log(walletData?.walletID, "WALLET ID");
      //console.log(total, "TOTAL");
      var id = walletData!.walletID.toString();
      var amount = total;
      var transType = '3'
      const response = await axios.post(`${API_URL}/api/Wallet`, {
        Id: id,
        Amount: amount,
        PaymentType: transType
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error('Error status:', error.response?.status);
          console.error('Error message:', error.response?.data);
        } else {
          console.error('Unexpected error:', error);
        }
      });
      //console.log(response, "Response");
      return response;
    } catch (err) {
      console.error(err)
    }
  }

  const submitOrderDetails = async () => {
    console.log(mealsData);
    console.log(mealQuantity);
    const response = await axios.post(`${API_URL}/api/Order/SubmitOrder`,
      {
        StudentID: id,
        OrderDate: modifyDate(),
        MealID: mealsData,
        Quantity: mealQuantity,
        VendorID: vendorData
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
      .catch((error) => {
        if (axios.isAxiosError(error)) {
          console.error('Error status:', error.response?.status);
          console.error('Error message:', error.response?.data);
        } else {
          console.error('Unexpected error:', error);
        }
      });

    console.log("ORDERRESPONSE::", response);

    return response;
  }

  const modifyDate = () => {
    let parsedDate = moment(date, 'M/D/YYYY');
    return parsedDate.format('YYYY-MM-DD');
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 10 }}>
        {/* header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} >
            <Ionicons name='chevron-back' size={30} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerText}>Cart</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
          <View style={{ paddingTop: 10 }}>
            <Text style={styles.headerText}>
              Date
            </Text>
            <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }]}>
              {/* <Text>15/3/2024</Text> */}
              <Text>{date.toLocaleDateString()}</Text>
              {/* <TouchableOpacity>
                <MaterialCommunityIcons name="calendar-blank" size={25} />
              </TouchableOpacity> */}
            </View>
            <DatePicker
              modal
              mode='date'
              locale='en-MY'
              open={open}
              date={date}
              minimumDate={todayDate}
              onConfirm={(date) => {
                setDate(date)
                setOpen(false)
              }}
              onCancel={() => {
                setOpen(false)
              }}
            />
          </View>

          <View style={{ paddingTop: 10 }}>
            <Text style={styles.headerText}>
              Order For
            </Text>
            <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }]}>
              <Text>{orderName ? orderName.toString() : 'Guest'}</Text>
            </View>
          </View>

          {/* <View style={{ paddingTop: 10 }}>
            <Text style={styles.headerText}>
              School
            </Text>
            <View style={[styles.card, {}]}>
              <Text>SK Bayan Lepas</Text>
            </View>
          </View> */}

          {/* Item Order List */}
          <View style={{ paddingTop: 10 }}>
            <Text style={styles.headerText}>
              Order Summary
            </Text>
            <View style={[styles.cardOrder, { paddingVertical: 10, paddingHorizontal: 15 }]}>
              {cart && cart.length > 0 ? (
                cart.map((item: CartItem) => (
                  <View key={item.mealID} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                    <View style={{ flexDirection: 'row', gap: 20 }}>
                      <Text>{item.quantity}</Text>
                      <Text>{item.mealName}</Text>
                    </View>
                    <Text>RM{(item.price * item.quantity).toFixed(2) ?? 0}</Text>
                  </View>
                ))
              ) : (
                <Text>No items in cart</Text>
              )}
              <View style={{ borderWidth: StyleSheet.hairlineWidth }} />

              {/* Subtotal */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                <Text>Subtotal</Text>
                <Text>RM{subtotal.toFixed(2) ?? 0}</Text>
              </View>

              {/* Tax */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Text>Tax</Text>
                <Text>RM{tax.toFixed(2) ?? 0}</Text>
              </View>

            </View>
          </View>


          <View style={{ paddingTop: 10 }}>
            <Text style={styles.headerText}>
              Payment Method
            </Text>
            <View style={[styles.card, {}]}>
              <Text>Wallet</Text>
              {/* <TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} />
              </TouchableOpacity> */}
            </View>
          </View>
        </ScrollView>

      </View>

      <View style={styles.footer}>
        <TouchableOpacity onPress={handleSubmit} disabled={!(cart.length > 0)}>
          <View style={[cart.length > 0 ? defaultStyles.btn : defaultStyles.btnDis, { flexDirection: 'row', gap: 20 }]}>
            <Text style={[defaultStyles.btnText, {}]}>Place Order - RM{total.toFixed(2)}</Text>
            {loading && <ActivityIndicator
              animating={loading}
            />}
          </View>
        </TouchableOpacity>

      </View>
    </View>
  )
}

export default ViewCart

const styles = StyleSheet.create({
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
    height: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center'
  },
  cardOrder: {
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
    height: 50,
    bottom: 30,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: Colors.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
  }
})