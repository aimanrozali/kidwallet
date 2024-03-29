import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import DashboardHeader from '@/components/DashboardHeader'
import DashboardGraph from '@/components/DashboardGraph'
import EwalletList from '@/components/EwalletList'
import { API_URL } from '@/config'
import axios from 'axios'
import { User } from '@/interfaces/user'
import { Student } from '@/interfaces/student'


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