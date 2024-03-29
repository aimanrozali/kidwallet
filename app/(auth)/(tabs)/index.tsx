import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Dashboard from '@/screens/Dashboard'
import { API_URL } from '@/config'
import axios from 'axios'
import { User } from '@/interfaces/user';



const index = () => {

  const [userData, setUserData] = useState();
  const [studentData, setStudentData] = useState("");

  useEffect(() => {
    // const url = `${API_URL}/api/User/GetInfo`;

    // const fetchData = async () => {
    //   try {
    //     const response = await axios.get(url);
    //     const responseJson = response.data;
    //     setUserData(responseJson);

    //   } catch (err) {
    //     console.error(err);
    //   }
    // }

    // fetchData();
    console.log("This page")

  }, []);




  return (
    <Dashboard />
  )
}

export default index