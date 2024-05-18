import { View, Text, ScrollView, Dimensions } from 'react-native'
import React from 'react'

interface ScrollableViewProps {
  children: React.ReactNode

}


const ScrollableView = ({ children }: ScrollableViewProps) => {

  const { height } = Dimensions.get('window');

  return (
    <ScrollView scrollEnabled={false} style={{ height: height }}>
      {children}
    </ScrollView>
  )
}

export default ScrollableView