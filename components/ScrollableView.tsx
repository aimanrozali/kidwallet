import { View, Text, ScrollView, Dimensions } from 'react-native'
import React from 'react'

interface ScrollableViewProps {
  children: React.ReactNode

}


const ScrollableView = ({ children }: ScrollableViewProps) => {

  const { height } = Dimensions.get('screen');

  return (
    <ScrollView scrollEnabled={true} style={{ height: height, flex: 1 }}>
      {children}
    </ScrollView>
  )
}

export default ScrollableView