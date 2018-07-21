import { 
  PushNotificationIOS, 
  Alert, 
  Linking, 
  Platform 
} from 'react-native'

export const requestNotificationPermissions = () => {
  return new Promise((resolve, reject) => {
    PushNotificationIOS.requestPermissions().then((permissions) => {
      if (permissions.alert == 1) {
        resolve(permissions);
        return;
      }
      Alert.alert(
        'Location Permission',
        'Location access has not been allowed. Please enable it in Settings.',
        [
          { text: 'Cancel', onPress: () => resolve(permissions) },
          { text: 'Settings', onPress: () => {
              resolve(permissions);
              Platform.select({
                ios: () => Linking.openURL('app-settings:')
              })();
            }, style: 'cancel' }
        ],
        { cancelable: false }
      );
    }).catch((error) => {
      reject(error);
    });
  });
};

export const scheduleNotification = (title, body, date, sound = true) => {
  const localNotification = {
    alertTitle: title,
    alertBody: body,
    fireDate: date,
    isSilent: !sound
  };

  PushNotificationIOS.scheduleLocalNotification(localNotification);
};

export const clearNotifications = () => {
  PushNotificationIOS.cancelAllLocalNotifications();
  PushNotificationIOS.removeAllDeliveredNotifications();
}

export const setApplicationIconBadgeNumber = (number) => {
  PushNotificationIOS.setApplicationIconBadgeNumber(number);
}

const timeTo11 = (date) => {
  date.setHours(11);
  date.setMinutes(0);
  date.setSeconds(0);
  return date;
}

export const tomorrowAt11 = () => {
  let date = new Date();
  date.setDate(date.getDate() + 1);
  return timeTo11(date);
};

export const nextFridayAt11 = () => {
  let date = new Date();
  const dayOfWeek = 5 // Friday
  date.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);
  return timeTo11(date);
};

export const nextMonthAt11 = () => {
  let date = new Date();
  date.setMonth(date.getMonth() + 1);
  date.setDate(1);
  return timeTo11(date);
};
