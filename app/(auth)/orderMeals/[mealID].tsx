import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import mealsData from '@/data/meals.json';
import drinksData from '@/data/drinks.json';
import { Meals } from '@/interfaces/meals';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import { Drinks } from '@/interfaces/drinks';

const IMG_HEIGHT = 200;
const { width } = Dimensions.get('window');

const MealPage = () => {

  //console.log(useLocalSearchParams<{ type: string }>())
  const { type } = useLocalSearchParams<{ type: string }>();
  const { mealID } = useLocalSearchParams<{ mealID: string }>();





  //console.log(mealID);
  //console.log(type);
  // console.log(meals);

  const navigation = useNavigation();
  const router = useRouter();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color={'#000'} />
        </TouchableOpacity>
      )
    })
  })

  const renderFood = (type: string) => {
    if (type === "0") {

      const meals: Meals = (mealsData as any[]).find((item) => item.id.toString() === mealID);
      return (
        <>
          <View>
            <Image source={{ uri: meals.imgUrl }} style={styles.image} />
          </View>

          <View style={styles.innerContainer}>
            <View style={{ paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.headerText}>{meals.meal_name}</Text>
              <View style={{ alignItems: 'flex-end', gap: 10 }}>
                <Text style={styles.headerText}>RM{meals.price}</Text>
                <Text style={{ fontFamily: 'lato-sb', fontSize: 12, color: Colors.grey }}>per serving</Text>
              </View>
            </View>

            <View style={{ paddingTop: 25 }}>
              <Text style={styles.subHeaderTxt}>Nutrition Facts</Text>
              <View style={[styles.nutritionView, { paddingTop: 20 }]}>
                <Text style={styles.nutritionTxt}>Serving Size</Text>
                <Text style={styles.nutritionTxt}>1 dish (300g)</Text>
              </View>
              <View style={styles.nutritionView}>
                <Text style={styles.nutritionTxt}>Total Protein</Text>
                <Text style={styles.nutritionTxt}>{meals.nutrition_facts.protein}</Text>
              </View>
              <View style={styles.nutritionView}>
                <Text style={styles.nutritionTxt}>Total Carbohydrate</Text>
                <Text style={styles.nutritionTxt}>{meals.nutrition_facts.carbohydrates}</Text>
              </View>
              <View style={styles.nutritionView}>
                <Text style={styles.nutritionTxt}>Total Fat</Text>
                <Text style={styles.nutritionTxt}>{meals.nutrition_facts.fat}</Text>
              </View>
              <View style={styles.nutritionView}>
                <Text style={styles.nutritionTxt}>Total Fiber</Text>
                <Text style={styles.nutritionTxt}>{meals.nutrition_facts.fiber}</Text>
              </View>


            </View>


            <View style={{ paddingTop: 20, gap: 10 }}>
              <Text style={styles.subHeaderTxt}>Allergens</Text>
              <Text style={styles.allergensTxt}>{meals.allergens.join(', ')}</Text>
            </View>
          </View>
          {/* footer */}
          <View style={styles.footer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignContent: 'center', gap: 10 }}>
                <TouchableOpacity>
                  <Ionicons name="remove-circle-outline" size={30} />
                </TouchableOpacity>
                <Text style={{ textAlignVertical: 'center' }}>1</Text>
                <TouchableOpacity>
                  <Ionicons name='add-circle-outline' size={30} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={defaultStyles.btn}>
                <Text style={[defaultStyles.btnText, { paddingHorizontal: 20 }]}>Add To Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )
    }
    else {
      const drinks: Drinks = (drinksData as any[]).find((item) => item.id.toString() === mealID);
      return (
        <>
          <View>
            <Image source={{ uri: drinks.imgUrl }} style={styles.image} />
          </View>

          <View style={styles.innerContainer}>
            <View style={{ paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.headerText}>{drinks.drink_name}</Text>
              <View style={{ alignItems: 'flex-end', gap: 10 }}>
                <Text style={styles.headerText}>RM{drinks.price}</Text>
                <Text style={{ fontFamily: 'lato-sb', fontSize: 12, color: Colors.grey }}>per serving</Text>
              </View>
            </View>

            <View style={{ paddingTop: 25 }}>
              <Text style={styles.subHeaderTxt}>Nutrition Facts</Text>
              <View style={[styles.nutritionView, { paddingTop: 20 }]}>
                <Text style={styles.nutritionTxt}>Serving Size</Text>
                <Text style={styles.nutritionTxt}>1 dish (300g)</Text>
              </View>
              <View style={styles.nutritionView}>
                <Text style={styles.nutritionTxt}>Total Sugar</Text>
                <Text style={styles.nutritionTxt}>{drinks.nutrition_facts.sugar}</Text>
              </View>
            </View>

            <View style={{ paddingTop: 20, gap: 10 }}>
              <Text style={styles.subHeaderTxt}>Allergens</Text>
              <Text style={styles.allergensTxt}>{drinks.allergens.join(', ')}</Text>
            </View>
          </View>

          {/* footer */}
          <View style={styles.footer}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignContent: 'center', gap: 10 }}>
                <TouchableOpacity>
                  <Ionicons name="remove-circle-outline" size={30} />
                </TouchableOpacity>
                <Text style={{ textAlignVertical: 'center' }}>1</Text>
                <TouchableOpacity>
                  <Ionicons name='add-circle-outline' size={30} />
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={defaultStyles.btn}>
                <Text style={[defaultStyles.btnText, { paddingHorizontal: 20 }]}>Add To Cart</Text>
              </TouchableOpacity>
            </View>
          </View>

        </>
      )
    }
  }

  //console.log(meal);


  return (
    <SafeAreaView style={styles.container}>
      {renderFood(type)}

      {/* <View>
        <Image source={{ uri: meal.imgUrl }} style={styles.image} />
      </View>

      <View style={styles.innerContainer}>
        <View style={{ paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={styles.headerText}>{meal.meal_name}</Text>
          <View style={{ alignItems: 'flex-end', gap: 10 }}>
            <Text style={styles.headerText}>RM{meal.price}</Text>
            <Text style={{ fontFamily: 'lato-sb', fontSize: 12, color: Colors.grey }}>per serving</Text>
          </View>
        </View>

        <View style={{ paddingTop: 25 }}>
          <Text style={styles.subHeaderTxt}>Nutrition Facts</Text>
          <View style={[styles.nutritionView, { paddingTop: 20 }]}>
            <Text style={styles.nutritionTxt}>Serving Size</Text>
            <Text style={styles.nutritionTxt}>1 dish (300g)</Text>
          </View>
          <View style={styles.nutritionView}>
            <Text style={styles.nutritionTxt}>Total Protein</Text>
            <Text style={styles.nutritionTxt}>{meal.nutrition_facts.protein}</Text>
          </View>
          <View style={styles.nutritionView}>
            <Text style={styles.nutritionTxt}>Total Carbohydrate</Text>
            <Text style={styles.nutritionTxt}>{meal.nutrition_facts.carbohydrates}</Text>
          </View>
          <View style={styles.nutritionView}>
            <Text style={styles.nutritionTxt}>Total Fat</Text>
            <Text style={styles.nutritionTxt}>{meal.nutrition_facts.fat}</Text>
          </View>
          <View style={styles.nutritionView}>
            <Text style={styles.nutritionTxt}>Total Fiber</Text>
            <Text style={styles.nutritionTxt}>{meal.nutrition_facts.fiber}</Text>
          </View>


        </View>


        <View style={{ paddingTop: 20, gap: 10 }}>
          <Text style={styles.subHeaderTxt}>Allergens</Text>
          <Text style={styles.allergensTxt}>{meals.allergens.join(', ')}</Text>
        </View>
      </View> */}

      {/* footer */}
      {/* <View style={styles.footer}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignContent: 'center', gap: 10 }}>
            <TouchableOpacity>
              <Ionicons name="remove-circle-outline" size={30} />
            </TouchableOpacity>
            <Text style={{ textAlignVertical: 'center' }}>1</Text>
            <TouchableOpacity>
              <Ionicons name='add-circle-outline' size={30} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={defaultStyles.btn}>
            <Text style={[defaultStyles.btnText, { paddingHorizontal: 20 }]}>Add To Cart</Text>
          </TouchableOpacity>
        </View>
      </View> */}
    </SafeAreaView >
  )
}

export default MealPage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  roundButton: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    color: Colors.primary,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },
  header: {
    backgroundColor: '#fff',
    height: 100,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: Colors.grey,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  image: {
    height: IMG_HEIGHT,
    width,
  },
  innerContainer: {
    paddingHorizontal: 10
  },
  nutritionView: {
    borderBottomWidth: 0.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    alignItems: 'center'
  },
  nutritionTxt: {
    fontFamily: 'lato-bold',
    fontSize: 13
  },
  headerText: {
    fontFamily: 'lato-bold',
    fontSize: 20
  },
  subHeaderTxt: {
    fontFamily: 'lato-bold',
    fontSize: 18
  },
  allergensTxt: {
    fontFamily: 'lato-bold',
    fontSize: 15
  },
  footer: {
    position: 'absolute',
    height: 80,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderTopColor: Colors.grey,
    borderTopWidth: StyleSheet.hairlineWidth,
  }
})