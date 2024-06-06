import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Entypo, Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { defaultStyles } from "@/constants/Styles";
import { Student } from "@/interfaces/student";
import { API_URL } from "@/config";
import axios from "axios";
import { Orders } from "@/interfaces/order";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { SwipeListView } from "react-native-swipe-list-view";
import DatePicker from "react-native-date-picker";

const OrderedMeals = () => {
  const [orderData, setOrderData] = useState<Orders[] | null>(null);
  const [filteredOrderData, setFilteredOrderData] = useState<Orders[] | null>(
    null
  );
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [dataChange, setDataChange] = useState(false);
  const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [filterByDate, setFilterByDate] = useState(false);

  const { id } = useLocalSearchParams<{ id: string }>();

  const cancelOrder = async (orderID: number) => {
    var responseJson;
    try {
      console.log("Cancelling Order", orderID);
      const response = await axios.put(
        `${API_URL}/api/Order/UpdateOrderStatus?id=${orderID}&status=2`
      );
      responseJson = response.data;
    } catch (err) {
      console.error("At UpdateOrder", err);
    }

    return responseJson;
  };

  const confirmCancelOrder = async (orderID: number) => {
    var res = await cancelOrder(orderID);
    if (res.success) {
      setDataChange(!dataChange);
      Alert.alert("Order Cancelled Successfully");
    } else {
      Alert.alert("Failed to Cancel Order", res.message);
    }
  };

  const checkEligibility = async (orderID: number) => {
    try {
      const response = await axios.post(`${API_URL}/api/Order/CheckRefundEligibility?id=${orderID}`);

      if (response.data.success === true) {
        if (response.data.data === true) {
          return true;
        }
        else {
          return false;
        }
      }
    }
    catch (error) {
      console.error("At CheckEligibility", error);
    }
    return false;
  }

  const handleOptionSelect = async (orderID: number) => {

    let eligible = await checkEligibility(orderID);
    console.log("Selected option:", orderID);
    if (eligible) {
      Alert.alert(
        "Cancel Order",
        "Are you sure you want to cancel this order? You order will be refunded.",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              confirmCancelOrder(orderID);
            },
          },
        ]
      );
    }
    else {
      Alert.alert(
        "Cancel Order",
        "Are you sure you want to cancel this order? You order will not be refunded.",
        [
          {
            text: "No",
            style: "cancel",
          },
          {
            text: "Yes",
            onPress: () => {
              confirmCancelOrder(orderID);
            },
          },
        ]
      );
    }

  };

  useEffect(() => {
    const url = `${API_URL}/api/Student`;
    //console.log(url + `/${id}`);

    const fetchData = async () => {
      try {
        const response = await axios.get(url + `/${id}`);
        const responseJson = response.data.data;
        setStudent(responseJson);
      } catch (err) {
        console.error("At OrderedMeals", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const url = `${API_URL}/api/Order/GetOrdersByStudentID`;

    const fetchData = async () => {
      try {
        const response = await axios.get(url + `/${id}`);
        const responseJson = response.data.data;
        setOrderData(responseJson);
        setLoading(false);
      } catch (err) {
        console.error("At OrderedMeals", err);
      }
    };

    fetchData();
  }, [dataChange]);

  useEffect(() => {
    if (orderData) {
      let filteredOrders = orderData;
      if (filterByDate) {
        filteredOrders = orderData.filter(
          (order) => new Date(order.orderDate).toDateString() === date.toDateString()
        );
      }
      setFilteredOrderData(filteredOrders);
    }
  }, [orderData, date, filterByDate]);

  const router = useRouter();
  return (
    <View style={{ paddingHorizontal: 5 }}>
      <View style={styles.header}>
        <View style={{ flexDirection: "row", width: '40%' }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={30} />
          </TouchableOpacity>
          <View>
            <Text style={styles.headerText}>Pre-Ordered Meals List for {student?.studentName}</Text>
            {/* <ShimmerPlaceholder visible={!loading} width={50}>
              <Text style={styles.headerText}>{student?.studentName}</Text>
            </ShimmerPlaceholder> */}
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            style={styles.dateContainer}
            onPress={() => setOpen(true)}
          >
            <Ionicons name="calendar" size={25} />
            <Text style={{ fontFamily: "lato-sb", fontSize: 12, color: Colors.grey }}>
              {date.toDateString()}
            </Text>
          </TouchableOpacity>
          <Switch
            value={filterByDate}
            onValueChange={() => setFilterByDate((prev) => !prev)}
          />
        </View>
      </View>

      <SwipeListView
        style={[styles.card, { maxHeight: "75%", minHeight: "50%" }]}
        contentContainerStyle={{ paddingHorizontal: 15, paddingTop: 5 }}
        data={filteredOrderData}
        renderItem={(data, rowMap) => (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              paddingVertical: 10,
              backgroundColor: "#fff",
              borderBottomWidth: StyleSheet.hairlineWidth,
              borderBottomColor: "#c7c7c7",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center", gap: 15 }}>
              <Image source={{ uri: data.item.meal.mealPic }} style={styles.smallImage} />

              <Text style={{ fontFamily: "lato-bold", fontSize: 15 }}>
                {data.item.meal.mealName}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <View style={{ alignItems: "flex-end", gap: 5 }}>
                <Text style={{ fontFamily: "lato-bold", fontSize: 13 }}>
                  {data.item.status === 0
                    ? "Not Collected"
                    : data.item.status === 1
                      ? "Collected"
                      : "Cancelled"}
                </Text>
                <Text style={{ fontFamily: "lato-sb", fontSize: 10, color: Colors.grey }}>
                  {new Date(data.item.orderDate).toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
        )}
        renderHiddenItem={(data, rowMap) => (
          <View style={styles.rowBack}>
            <View style={styles.innerRowBack}>
              <TouchableOpacity
                style={styles.btnCancel}
                onPress={() => handleOptionSelect(data.item.id)}
              >
                <Entypo name="cross" size={24} color={"#FF6666"} />
                <Text style={styles.cancelText}>Cancel Order</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        rightOpenValue={-85}
        ListEmptyComponent={() => (
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <Text>No Ordered Meals</Text>
          </View>

        )}
      >
        {filteredOrderData?.length === 0 ? <Text>No Ordered Meals</Text> : null}
      </SwipeListView>

      <View
        style={{
          paddingTop: 20,
          alignItems: "flex-end",
          paddingRight: 10,
          bottom: 0,
          paddingBottom: 10,
        }}
      >
        <TouchableOpacity
          style={[defaultStyles.btn, { paddingHorizontal: 30 }]}
          onPress={() =>
            router.push(
              `/(auth)/(tabs)/orderMeals/mealsList?id=${student?.studentID}&&name=${student?.studentName}`
            )
          }
        >
          <Text style={{ fontFamily: "lato-bold" }}>Order Meals</Text>
        </TouchableOpacity>
      </View>

      <DatePicker
        modal
        open={open}
        date={date}
        onConfirm={(date) => {
          setDate(date);
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        mode="date"
      />
    </View>
  );
};

export default OrderedMeals;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    paddingTop: 15,
    paddingLeft: 10,
    paddingRight: 10,
    alignItems: "center",
    gap: 10,
    height: 60,
    justifyContent: "space-between",
  },
  headerText: {
    fontFamily: "lato-bold",
    fontSize: 14,
    paddingBottom: 2,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    margin: 10,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 4,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    gap: 20,
  },
  cardInnerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 15,
    alignItems: "center",
  },
  smallImage: {
    height: 45,
    width: 45,
    borderRadius: 25,
  },
  popup: {
    position: "absolute",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    elevation: 5,
  },
  rowBack: {
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  btnCancel: {
    paddingVertical: 10,
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  cancelText: {
    fontFamily: "lato-bold",
    fontSize: 13,
    color: "#FF6666",
  },
  innerRowBack: {
    alignContent: "center",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});
