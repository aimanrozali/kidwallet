import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useNavigation, useRouter } from 'expo-router'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { defaultStyles } from '@/constants/Styles';
import Colors from '@/constants/Colors';

const ViewCart = () => {

  const navigation = useNavigation();
  const router = useRouter();


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
              <Text>15/3/2024</Text>
              <TouchableOpacity>
                <MaterialCommunityIcons name="calendar-blank" size={25} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ paddingTop: 10 }}>
            <Text style={styles.headerText}>
              Order For
            </Text>
            <View style={[styles.card, { flexDirection: 'row', justifyContent: 'space-between', padding: 10, alignItems: 'center' }]}>
              <Text>Abdul Zakwan</Text>
              <TouchableOpacity>
                <MaterialCommunityIcons name="pencil" size={25} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ paddingTop: 10 }}>
            <Text style={styles.headerText}>
              School
            </Text>
            <View style={[styles.card, {}]}>
              <Text>SK Bayan Lepas</Text>
            </View>
          </View>

          {/* Item Order List */}
          <View style={{ paddingTop: 10 }}>
            <Text style={styles.headerText}>
              Order Summary
            </Text>
            <View style={[styles.cardOrder, { paddingVertical: 10, paddingHorizontal: 15 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 }}>
                <View style={{ flexDirection: 'row', gap: 20 }}>
                  <Text>x1</Text>
                  <Text>Chicken Rice</Text>
                </View>
                <Text>RM4.00</Text>
              </View>
              <View style={{ borderWidth: StyleSheet.hairlineWidth }} />

              {/* Subtotal */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 10 }}>
                <Text>Subtotal</Text>
                <Text>RM6.50</Text>
              </View>

              {/* Tax */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10 }}>
                <Text>Tax</Text>
                <Text>RM6.50</Text>
              </View>

            </View>
          </View>


          <View style={{ paddingTop: 10 }}>
            <Text style={styles.headerText}>
              Payment Method
            </Text>
            <View style={[styles.card, {}]}>
              <Text>Card **** 4323</Text>
              <TouchableOpacity>
                <Ionicons name="chevron-forward" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

      </View>

      <View style={styles.footer}>

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