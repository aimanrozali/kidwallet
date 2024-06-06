import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView } from 'react-native';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { API_URL } from '@/config';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '@/hooks/hooks';
import { addToCart, CartItem, decrementQuantity, incrementQuantity, removeFromCart, selectQuantityById } from '@/hooks/CardReducer';
import { RootState } from '@/store/store';

const IMG_HEIGHT = 300;
const { width } = Dimensions.get('window');

const MealPage = () => {
  const dispatch = useAppDispatch();
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const { type } = useLocalSearchParams<{ type: string }>();
  const { mealID } = useLocalSearchParams<{ mealID: string }>();
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const router = useRouter();

  useEffect(() => {
    const url = `${API_URL}/api/Meal/${mealID}`;
    const fetchData = async () => {
      try {
        const response = await axios.get(url);
        setData(response.data.data);
        setLoaded(true);
      } catch (err) {
        console.error("At MealsPreOrder", err);
      }
    };
    fetchData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={'black'} />
        </TouchableOpacity>
      )
    });
  });

  const counterMeals = useAppSelector((state: RootState) => selectQuantityById(parseInt(mealID), id)(state.cart));

  const addItemToCart = (item: CartItem) => {
    dispatch(addToCart({ studentID: id, ...item }));
  };
  const removeItemFromCart = (item: CartItem) => {
    dispatch(removeFromCart(item));
  };
  const increaseQuantity = (item: CartItem) => {
    dispatch(incrementQuantity(item));
  };
  const decreaseQuantity = (item: CartItem) => {
    if (item.quantity === 1) {
      dispatch(removeFromCart({ studentID: id, ...item }));
    } else {
      dispatch(decrementQuantity({ studentID: id, ...item }));
    }
  };

  console.log(data?.allergens.length)

  const renderFood = (type: string, meal: any) => {
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.innerContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>{meal.mealName}</Text>
            <View style={styles.priceContainer}>
              <Text style={styles.headerText}>RM{meal.price.toFixed(2)}</Text>
              <Text style={styles.subText}>per serving</Text>
            </View>
          </View>
          <View style={styles.nutritionContainer}>
            <Text style={styles.subHeaderTxt}>Nutrition Facts</Text>
            {type === "0" ? (
              <>
                <View style={styles.nutritionView}>
                  <Text style={styles.nutritionTxt}>Serving Size</Text>
                  <Text style={styles.nutritionTxt}>1 dish (300g)</Text>
                </View>
                <View style={styles.nutritionView}>
                  <Text style={styles.nutritionTxt}>Total Protein</Text>
                  <Text style={styles.nutritionTxt}>{meal.protein}g</Text>
                </View>
                <View style={styles.nutritionView}>
                  <Text style={styles.nutritionTxt}>Total Carbohydrate</Text>
                  <Text style={styles.nutritionTxt}>{meal.carbohydrate}g</Text>
                </View>
                <View style={styles.nutritionView}>
                  <Text style={styles.nutritionTxt}>Total Fat</Text>
                  <Text style={styles.nutritionTxt}>{meal.fat}g</Text>
                </View>
                <View style={styles.nutritionView}>
                  <Text style={styles.nutritionTxt}>Total Fiber</Text>
                  <Text style={styles.nutritionTxt}>{meal.fiber}g</Text>
                </View>
              </>
            ) : (
              <>
                <View style={styles.nutritionView}>
                  <Text style={styles.nutritionTxt}>Total Sugar</Text>
                  <Text style={styles.nutritionTxt}>{meal.sugar}g</Text>
                </View>
                <View style={styles.nutritionView}>
                  <Text style={styles.nutritionTxt}>Total Caffeine</Text>
                  <Text style={styles.nutritionTxt}>{meal.caffeine}mg</Text>
                </View>
                <View style={styles.nutritionView}>
                  <Text style={styles.nutritionTxt}>Total Calcium</Text>
                  <Text style={styles.nutritionTxt}>{meal.calcium}mg</Text>
                </View>
              </>
            )}
          </View>
          <View style={{ paddingTop: 20, gap: 10 }}>
            <Text style={styles.subHeaderTxt}>Allergens</Text>
            <Text style={styles.allergensTxt}>{meal.allergens.length === 0 ? "None" : meal.allergens.join(', ')}</Text>
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {data && data?.mealPic && (
        <Image source={{ uri: data.mealPic }} style={styles.image} />
      )}
      {loaded && data && renderFood(type, data)}
      <View style={styles.footer}>
        <View style={styles.footerInner}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={() => decreaseQuantity(data as any)}>
              <Ionicons name="remove-circle-outline" size={30} color={'black'} />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{counterMeals}</Text>
            <TouchableOpacity onPress={() => increaseQuantity(data as any)}>
              <Ionicons name='add-circle-outline' size={30} color={'black'} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addToCartButton} onPress={() => addItemToCart(data as any)}>
            <Text style={styles.addToCartText}>Add To Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MealPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollViewContent: {
    paddingBottom: 100, // Ensure enough space for the fixed footer
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  image: {
    height: IMG_HEIGHT,
    width,
    resizeMode: 'cover',
  },
  innerContainer: {
    padding: 20,
    backgroundColor: '#fff',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    fontFamily: 'lato-bold',
    fontSize: 24,
    color: 'black',
  },
  subText: {
    fontFamily: 'lato-regular',
    fontSize: 12,
    color: Colors.grey,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  nutritionContainer: {
    marginTop: 20,
  },
  subHeaderTxt: {
    fontFamily: 'lato-bold',
    fontSize: 18,
    color: 'black',
    marginBottom: 10,
  },
  nutritionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.grey,
  },
  nutritionTxt: {
    fontFamily: 'lato-regular',
    fontSize: 14,
    color: Colors.darkGrey,
  },
  allergensContainer: {
    marginTop: 20,
  },
  allergensTxt: {
    fontFamily: 'lato-regular',
    fontSize: 14,
    color: Colors.darkGrey,
  },
  footer: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderTopWidth: 0.5,
    borderTopColor: Colors.grey,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  footerInner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  quantityText: {
    fontFamily: 'lato-bold',
    fontSize: 18,
    color: 'black',
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  addToCartText: {
    fontFamily: 'lato-bold',
    fontSize: 16,
    color: 'black',
  },
});
