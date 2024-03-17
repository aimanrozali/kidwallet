import { View, Text, Image, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const DashboardHeader = () => {
  return (
    //Main container
    <View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Image
            source={require('@/assets/images/black.png')}
            style={styles.image} />
          <View style={{ alignContent: 'flex-start' }}>
            <Text style={{ fontFamily: 'lato-light', fontSize: 10 }}>Welcome back,</Text>
            <Text style={{ fontFamily: 'lato-bold', paddingTop: 5 }}>Aiman Rozali</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Ionicons name='help-circle-outline' size={24} />
          <Ionicons name='notifications' size={24} />
        </View>
      </View>
      <View style={styles.container}>
        <View>
          <Text style={{ fontFamily: 'lato-sb', fontSize: 10 }}>Total Spent</Text>
          <Text style={{ fontFamily: 'lato-bold', fontSize: 20, paddingTop: 5 }}>RM50.30</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 5, alignItems: 'center', alignSelf: 'flex-end' }}>
          <Ionicons name='arrow-up-circle-outline' size={20} color={'green'} />
          <Text style={{ fontFamily: 'lato-light', fontSize: 11 }}>5.3% from last week</Text>
        </View>
      </View>
    </View>
  )
}

export default DashboardHeader


const styles = StyleSheet.create({
  image: {
    height: 35,
    width: 35,
    borderRadius: 20,
  },
  container: {
    paddingTop: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})