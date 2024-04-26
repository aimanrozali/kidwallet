import { View, Text, StyleSheet, TouchableOpacity, Touchable, ScrollView, Image, ActivityIndicator } from 'react-native'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'expo-router'
import { FontAwesome5, Fontisto, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';
import MealPage from '@/app/(auth)/orderMeals/[mealID]';
import { Drinks } from '@/interfaces/drinks';
import { Meals } from '@/interfaces/meals';
import { API_URL } from '@/config';
import axios from 'axios';
import DatePicker from 'react-native-date-picker';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { setDates } from '@/hooks/DateReducer';
import { setName } from '@/hooks/NameReducer';
import { RootState } from '@/store/store';

interface Props {
  name: string,
  id: string
}

const MealsList = ({ name, id }: Props) => {


  const [meal, setMeal] = useState<Meals[] | null>(null);
  const [drink, setDrink] = useState<Meals[] | null>(null);
  const [loadedMeal, setLoadedMeal] = useState(false);
  const [loadedDrink, setLoadedDrink] = useState(false);

  //console.log("At MealList::", name);

  useEffect(() => {
    const url = `${API_URL}/api/Meal/GetAllFood`;

    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        const responseJson = response.data.data;
        setMeal(responseJson);

        //console.log("At Meal:", responseJson); // Log the updated value here
        setLoadedMeal(true);

      } catch (err) {
        console.error("At Meal", err);
        setLoadedMeal(false);
      }
    }

    fetchData();

  }, []);

  useEffect(() => {
    const urlDrink = `${API_URL}/api/Meal/GetAllDrinks`;

    const fetchData = async () => {
      try {
        const response = await axios.get(urlDrink);
        const responseJson = response.data.data;
        setDrink(responseJson);

        //console.log("At Drink:", responseJson); // Log the updated value here
        setLoadedDrink(true);

      } catch (err) {
        console.error("At Drink", err);
      }
    }

    fetchData();

  }, []);


  const dateFromStore = useAppSelector((state) => state.date.date);
  const orderName = useAppSelector((state) => state.name.name);
  const cart = useAppSelector((state: RootState) => state.cart.cart[id]);
  const dispatch = useAppDispatch();

  let todayDate = new Date()
  var today = todayDate.toLocaleDateString("en-MY", { month: 'numeric', year: 'numeric', day: 'numeric' });
  const [typeOrder, setTypeOrder] = useState(0); //0 for meal, 1 for drinks
  const router = useRouter();
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [cartEmpty, setCartEmpty] = useState(false);
  const [cartState, setCartState] = useState([]);

  useEffect(() => {
    if (cart?.length === 0) {
      setCartEmpty(true);
    } else {
      setCartEmpty(false);
    }
  }, [])

  useEffect(() => {
    dispatch(setDates(date.toISOString()));
    console.log("Date::", dateFromStore);
  }, [date]);

  useEffect(() => {
    dispatch(setName(name));
    console.log("Name::", orderName);
  }, []);





  return (
    <View style={{ paddingHorizontal: 10, flex: 1 }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} >
          <Ionicons name='chevron-back' size={30} />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerText}>Order Meals for</Text>
          <Text style={styles.headerText}>{name}</Text>
        </View>
      </View>

      {/* DateContainer */}
      <View style={styles.dateContainer}>
        <Text style={{ fontFamily: 'lato-bold', fontSize: 13 }}>
          Order For
        </Text>
        <TouchableOpacity
          onPress={() => setOpen(true)}
          style={{ flexDirection: 'row', gap: 5, alignItems: 'center' }}>
          <MaterialCommunityIcons name="calendar-blank" size={25} />
          <Text style={{ fontFamily: 'lato-black', fontSize: 18 }}>
            {date.toLocaleDateString("en-MY", { month: 'numeric', year: 'numeric', day: 'numeric' })}
          </Text>
        </TouchableOpacity>
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

      {/* Food Card */}
      <View style={{}}>
        <Text style={styles.mealsHeaderTxt}>Food</Text>
        <View style={styles.card}>
          {loadedMeal && meal ? (
            <ScrollView style={[styles.scrollViewStyle]}
            >

              {meal?.map((item, index) => (
                <View key={index} style={styles.innerScroll}>

                  <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }} key={index}>
                    {/* <Ionicons name="fast-food" size={30} /> */}
                    <Image source={{ uri: item.mealPic }} style={styles.smallImage} />

                    <View style={{ gap: 2 }}>
                      <Text style={styles.mealsNameTxt}>{item.mealName}</Text>
                      <View style={{ flexDirection: 'row', gap: 50 }}>
                        <Text style={styles.priceTxt}>RM{item.price.toFixed(2)}</Text>
                        <Text style={styles.caloriesTxt}>{item.calories}kcal</Text>
                      </View>
                    </View>

                  </View>

                  <View>
                    <TouchableOpacity key={index}>
                      <Ionicons name="add-circle" size={24} color={Colors.primary}
                        onPress={() => router.push(`/(auth)/orderMeals/${item.mealID}?type=${0}&id=${id}`)} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (<ActivityIndicator />
          )}

        </View>
      </View>

      {/* Drinks Card */}
      <View style={{}}>
        <Text style={styles.mealsHeaderTxt}>Drinks</Text>
        <View style={styles.card}>
          {loadedDrink && drink ? (
            <ScrollView style={[styles.scrollViewStyle]}
            >
              {drink?.map((item, index) => (
                <View key={index} style={styles.innerScroll}>
                  <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center' }} key={index}>
                    <Image source={{ uri: item.mealPic }} style={styles.smallImage} />
                    <View>
                      <Text style={styles.mealsNameTxt}>{item.mealName}</Text>
                      <View style={{ flexDirection: 'row', gap: 50 }}>
                        <Text style={styles.priceTxt}>RM{item.price.toFixed(2)}</Text>
                        <Text style={styles.caloriesTxt}>{item.calories}kcal</Text>
                      </View>
                    </View>
                  </View>
                  <View>
                    <TouchableOpacity key={index}>
                      <Ionicons name="add-circle" size={24} color={Colors.primary}
                        onPress={() => router.push(`/(auth)/orderMeals/${item.mealID}?id=${id}`)} />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) :
            <ActivityIndicator />
          }
        </View>
      </View>

      {/* View Cart Button */}
      <View style={styles.cartBtn}>
        <TouchableOpacity
          //disabled={cartEmpty}
          style={styles.btnEnabled}
          onPress={() => router.push(`/(auth)/orderMeals/viewCart?id=${id}`)}>
          <FontAwesome5 name="shopping-basket" size={24} color='black' />
          <Text style={{ fontFamily: 'lato-bold', fontSize: 13, padding: 10 }}>View Cart</Text>
        </TouchableOpacity>
      </View>

    </View>
  )
}

export default MealsList

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
  dateContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
    gap: 3,
    paddingTop: 10,
  },
  mealsHeaderTxt: {
    fontFamily: 'lato-bold',
    fontSize: 15,
    paddingTop: 10,
    paddingLeft: 10,
    paddingBottom: 5
  },
  cartBtn: {
    position: 'absolute',
    bottom: 20,
    right: 10,
    alignItems: 'flex-end'

  },
  bottom: {
    flex: 1,
    position: "absolute",
    right: 5,
  },
  btnEnabled: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  btnDisabled: {
    flexDirection: 'row',
    backgroundColor: '#CCCCCC', // Gray out the background color to indicate disabled state
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
    opacity: 0.5, // Reduce opacity to further indicate disabled state
  },
  innerScroll: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center'
  },
  mealsNameTxt: {
    fontFamily: 'lato-bold',
    fontSize: 15
  },
  priceTxt: {
    fontFamily: 'lato-bold',
    fontSize: 13,
    width: 60
  },
  caloriesTxt: {
    fontFamily: 'lato-sb',
    fontSize: 12,
    color: Colors.grey,
    width: 50,
    textAlign: 'right'
  },
  scrollViewStyle: {
    height: 240
  },
  smallImage: {
    height: 45,
    width: 45,
    borderRadius: 25
  }
})