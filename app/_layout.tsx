import { STRIPE_PUBLISH_KEY } from '@/config';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { store } from '@/store/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useFonts } from 'expo-font';
import { router, Stack, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { Alert, PermissionsAndroid } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import notifee, { AndroidImportance } from '@notifee/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';


export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '/WelcomeScreen',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'lato-black': require('../assets/fonts/Lato-Black.ttf'),
    'lato-bold': require('../assets/fonts/Lato-Bold.ttf'),
    'lato-light': require('../assets/fonts/Lato-Light.ttf'),
    'lato-sb': require('../assets/fonts/Lato-SemiBold.ttf'),
  });

  useEffect(() => {
    const requestUserPermission = async () => {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;


      if (enabled) {
        console.log('Authorization status:', authStatus);
        const token = await messaging().getToken();
        //store token in secure storage
        await SecureStore.setItemAsync('DEVICE_TOKEN', token);
        const tokenStored = await SecureStore.getItemAsync('DEVICE_TOKEN');

        console.log('FCM token:', tokenStored);
      }
    };

    requestUserPermission();
  }, [])

  async function onMessageReceived(message: any) {

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
      importance: AndroidImportance.HIGH,
    });
    console.log('onMessageReceived', message);
    // notifee.displayNotification(JSON.parse(JSON.stringify(message)));
    await notifee.displayNotification({
      title: message.notification.title,
      body: message.notification.body,
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
      },
    });
  }

  useEffect(() => {
    const unsubscribe = messaging().onMessage(onMessageReceived);

    return unsubscribe;
  }, []);





  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }






  return (
    <AuthProvider>
      <Provider store={store}>
        <StripeProvider
          publishableKey={STRIPE_PUBLISH_KEY}>
          <RootLayoutNav />
        </StripeProvider>
      </Provider>
    </AuthProvider>
  );
}

function RootLayoutNav() {

  const { authState, onLogout } = useAuth();

  return (
    <Stack>
      <Stack.Screen name='(public)/WelcomeScreen' options={{ headerShown: false }} />
      <Stack.Screen name='(public)/Login' options={{ headerShown: false }} />
      <Stack.Screen name='(public)/SignUp' options={{ headerShown: false }} />
      <Stack.Screen name='(public)/EmailConfirmation' options={{ headerShown: false }} />
      <Stack.Screen name='(public)/ForgotPassword' options={{ headerShown: false }} />
      <Stack.Screen name='(auth)/(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(auth)/ewallet/[ewalletID]' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/ewallet/topupScreen' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/ewallet/paymentScreen' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      {/* <Stack.Screen name='(auth)/orderMeals/orderedList' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/orderMeals/mealsList' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/orderMeals/[mealID]' options={{ headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/orderMeals/viewCart' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} /> */}
      <Stack.Screen name='(auth)/profile/editProfile' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/profile/manageChildren' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/profile/changePassword' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/profile/editChildren' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/profile/addChildren' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/profile/ChangeProfilePicture' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
    </Stack>
  );
}
