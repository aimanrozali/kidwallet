import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { API_URL } from "@/config";
import { useRouter, useSegments } from "expo-router";
import { Alert } from "react-native";

interface AuthProps {
  authState?: { token: string | null; authenticated: boolean | null };
  onRegister?: (email: string, password: string, userName: string) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
  resendOtp?: (email: string) => Promise<any>;
  verifyOtp?: (email: string, code: string) => Promise<any>;
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

      console.log(axios.defaults.headers.common['Authorization']);

    };
    loadToken();
    //testTokenValidation();
  }, []);


  const testTokenValidation = async () => {
    console.log("Token Validation")
    axios.get(`${API_URL}/Auth/ValidateSession`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .catch((error) => {
        console.log(error.response.status);
        if (error.response.status === 401) {
          console.log("Masuk dak")
          Alert.alert("Session Expired", "Please Login Again");
          // console.error("Error at validation", error);
          logout();
        }
      });

  }

  const resendOtp = async (email: string) => {
    const response = await axios.post(`${API_URL}/Auth/SendOtp`, { email }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        console.log("OTP Resent");
      })
      .catch((error) => {
        console.error(error);
      });

    return response;
  }

  const verifyOtp = async (email: string, code: string) => {
    const response = await axios.post(`${API_URL}/Auth/VerifyEmail`, {
      email, code
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        if (res.data.success) {
          Alert.alert("Email confirmed successfully");
          router.push("/Login");
        } else {
          Alert.alert("Invalid OTP", res.data.data);
        }
      })
      .catch((error) => {
        console.error(error);
      });

    console.log(response);

    return response;
  }

  const register = async (email: string, password: string, userName: string) => {
    // Send POST request
    const response = await axios.post(`${API_URL}/Auth/Register`, { email, password, userName }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((res) => {
        // If request is successful, show alert and redirect
        console.log("SignUp")
        alert("Registered Successfully! Please check your email to verify your account.");
        router.push(`../(public)/EmailConfirmation?email=${email}`);
        // router.push("/Login");
      })
      .catch((error) => {
        Alert.alert("Error", error.response);
        // console.error(error);
      });

    return response;

    // Return response
    // return response;
    // If there's an error, log it and return error message

  };

  const login = async (email: string, password: string) => {
    const deviceToken = await SecureStore.getItemAsync('DEVICE_TOKEN');
    const result = await axios.post(`${API_URL}/Auth/Login`, { email, password, deviceToken }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then((async res => {
        setAuthState({
          token: res.data.token,
          authenticated: true
        })
        //console.log(res.data);
        axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;

        //console.log("Before Store")
        await SecureStore.setItemAsync(TOKEN_KEY, res.data.token);
        //console.log("After store")

      }))
      .catch((err) => {
        if (err.response) {
          if (err.response.status === 400) {
            if (err.response.data.locked) {
              Alert.alert("Account Locked", "Please wait for 5 minutes to login again.");
            }
            if (err.response.data.verified === false) {
              Alert.alert("Email Not Verified", "Please verify your email first");
              router.push(`../(public)/EmailConfirmation?email=${email}`);
            } else {
              Alert.alert("Invalid Credentials", `Please check your email and password,${err.response.data.attemptsLeft} attempts left before your account is locked`);
            }
          }
        }
      });


    return result;
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync(TOKEN_KEY);

    axios.defaults.headers.common["Authorization"] = "";


    setAuthState({
      token: null,
      authenticated: false,
    })
    alert("Logged Out");
    //console.log("LOGOUT::", authState)

    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    console.log(token);
  }

  const value = {
    onRegister: register,
    onLogin: login,
    onLogout: logout,
    resendOtp: resendOtp,
    verifyOtp: verifyOtp,
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