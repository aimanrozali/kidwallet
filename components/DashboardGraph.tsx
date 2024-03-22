import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { LineChart } from 'react-native-chart-kit'
import { defaultStyles } from '@/constants/Styles'

const DashboardGraph = () => {
  return (

    <View style={{ padding: 10 }}>
      <View>
        <LineChart
          data={{
            labels: ["January", "February", "March", "April", "May"],
            datasets: [
              {
                data: [
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100,
                  Math.random() * 100
                ]
              }
            ]
          }}
          width={(Dimensions.get("window").width) - 20} // from react-native
          height={220}
          yAxisLabel="$"
          yAxisSuffix="k"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: "#e26a00",
            backgroundGradientFrom: "#fb8c00",
            backgroundGradientTo: "#ffa726",
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16
            },
            propsForDots: {
              r: "6",
              strokeWidth: "2",
              stroke: "#ffa726"
            }
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 20 }}>
        <TouchableOpacity style={[defaultStyles.btnOutline, { width: 150 }]}>
          <Text style={[defaultStyles.btnText, { marginHorizontal: 20 }]}>View Report</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[defaultStyles.btnOutline, { width: 150 }]}>
          <Text style={[defaultStyles.btnText, { marginHorizontal: 20 }]}>View Transaction</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default DashboardGraph

