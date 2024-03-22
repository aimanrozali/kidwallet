import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DashboardHeader from '@/components/DashboardHeader'
import DashboardGraph from '@/components/DashboardGraph'
import EwalletList from '@/components/EwalletList'

const Dashboard = () => {
  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <DashboardHeader />
      <DashboardGraph />
      <EwalletList />
    </SafeAreaView>
  )
}

export default Dashboard