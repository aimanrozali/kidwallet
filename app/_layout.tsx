import { STRIPE_PUBLISH_KEY } from '@/config';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { store } from '@/store/store';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useFonts } from 'expo-font';
import { Stack, Tabs } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Provider } from 'react-redux';


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
      <Stack.Screen name='(auth)/(tabs)' options={{ headerShown: false }} />
      <Stack.Screen name='(auth)/ewallet/[ewalletID]' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/ewallet/topupScreen' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/ewallet/paymentScreen' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/orderMeals/orderedList' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/orderMeals/mealsList' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/orderMeals/[mealID]' options={{ headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/orderMeals/viewCart' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/profile/editProfile' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/profile/manageChildren' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/profile/changePassword' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/profile/editChildren' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
      <Stack.Screen name='(auth)/profile/addChildren' options={{ headerShown: false, headerTitle: '', headerTransparent: true }} />
    </Stack>
  );
}
