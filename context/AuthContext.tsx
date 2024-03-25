import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "@/config";
import safeStringify from 'safe-stringify';
import { useRouter, useSegments } from "expo-router";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string, userName: string, phoneNumber: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}

const TOKEN_KEY = 'authToken'
const AuthContext = createContext<AuthProps>({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }: any) => {

  const router = useRouter();

  const [authState, setAuthState] = useState<{
    token: string | null;
    authenticated: boolean | null;
  }>({
    token: null,
    authenticated: false
  });

  useEffect(() => {
    const loadToken = async () => {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);

      console.log("TOKENNN:::", token);

      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setAuthState({
          token: token,
          authenticated: true,
        });
      }

      console.log(authState);

    };
    loadToken();
  }, []);


  const register = async (email: string, password: string, userName: string, phoneNumber: string) => {
    try {
      // return await axios.post(`${API_URL}/Auth/Register`, { email, password, userName, phoneNumber })
      await axios.post(`${API_URL}/Auth/Register`, { email, password, userName, phoneNumber }, {
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => {
        console.log(res.data);
      })
        .catch((err) => {
          console.error(err);
        });
    } catch (e) {
      return { error: true, msg: (e as any).response.data.message };
    }
  };

  const login = async (email: string, password: string) => {
    const result = await axios.post(`${API_URL}/Auth/Login`, { email, password }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((async res => {
        setAuthState({
          token: res.data.token,
          authenticated: true
        })
        console.log(res.data);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

        console.log("Before Store")
        await SecureStore.setItemAsync(TOKEN_KEY, res.data.token);
        console.log("After store")

      }))
      .catch((err) => {
        console.error(err);
      });
    console.log(authState);
    //console.log("Header", axios.defaults.headers.common['Authorization'])

    // setAuthState({
    //   token: result.data.data,
    //   authenticated: true
    // });

    // axios.defaults.headers.common['Authorization'] = `Bearer ${result.data.data}`;


    return result;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common["Authorization"] = "";


    setAuthState({
      token: null,
      authenticated: false,
    })
    console.log("LOGOUT::", authState)

    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log(token);
  }

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    authState
  };

  const segments = useSegments();

  useEffect(() => {
    const inAuthGroup = segments[0] === "(auth)";

    console.log("AuthGroup::", inAuthGroup);
    console.log("Authenticated::", authState.authenticated);

    if (authState.authenticated == false && inAuthGroup) {
      router.replace("/(public)/WelcomeScreen");

    }
    else if (authState.authenticated == true && !inAuthGroup) {
      router.replace("/(auth)/(tabs)")
    }
  }, [authState.authenticated, segments]);


  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
}