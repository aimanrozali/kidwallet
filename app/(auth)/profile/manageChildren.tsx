import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import ManageChildren from '@/screens/ManageChildren'
import { SafeAreaView } from 'react-native-safe-area-context'

const manageChildren = () => {

  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    setRefresh(!refresh);
  }, [])

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ManageChildren refresh={refresh} />
    </SafeAreaView>
  )
}

export default manageChildren