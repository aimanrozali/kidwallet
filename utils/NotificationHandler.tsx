import { View, Text } from 'react-native'
import React, { ReactNode } from 'react'
import messaging from '@react-native-firebase/messaging';
import Notifications from 'expo-notifications';
import { router } from 'expo-router';

const NotificationHandler = ({ children }: ReactNode) => {

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

  // Handle user clicking on a notification and open the screen
  const handleNotificationClick = async (response) => {
    const screen = response?.notification?.request?.content?.data?.screen;
    if (screen !== null) {
      router.navigate(screen);
    }
  };

  // Listen for user clicking on a notification
  const notificationClickSubscription =
    Notifications.addNotificationResponseReceivedListener(
      handleNotificationClick
    );

  // Handle user opening the app from a notification (when the app is in the background)
  messaging().onNotificationOpenedApp((remoteMessage) => {
    console.log(
      "Notification caused app to open from background state:",
      remoteMessage.data?.screen,
      router
    );
    if (remoteMessage?.data?.screen) {
      router.navigate(`${remoteMessage.data.screen}`);
    }
  });

  // Check if the app was opened from a notification (when the app was completely quit)
  messaging()
    .getInitialNotification()
    .then((remoteMessage) => {
      if (remoteMessage) {
        console.log(
          "Notification caused app to open from quit state:",
          remoteMessage.notification
        );
        if (remoteMessage?.data?.screen) {
          router.navigate(`${remoteMessage.data.screen}`);
        }
      }
    });

  // Handle push notifications when the app is in the background
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log("Message handled in the background!", remoteMessage);
    const notification = {
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      data: remoteMessage.data, // optional data payload
    };

    // Schedule the notification with a null trigger to show immediately
    await Notifications.scheduleNotificationAsync({
      content: notification,
      trigger: null,
    });
  });

  // Handle push notifications when the app is in the foreground
  const handlePushNotification = async (remoteMessage: any) => {
    const notification = {
      title: remoteMessage.notification.title,
      body: remoteMessage.notification.body,
      data: remoteMessage.data, // optional data payload
    };

    // Schedule the notification with a null trigger to show immediately
    await Notifications.scheduleNotificationAsync({
      content: notification,
      trigger: null,
    });
  };

  // Listen for push notifications when the app is in the foreground
  const unsubscribe = messaging().onMessage(handlePushNotification);

  // Clean up the event listeners
  return ({ children }: any) => {

    unsubscribe();
    notificationClickSubscription.remove();
  };

}

export default NotificationHandler