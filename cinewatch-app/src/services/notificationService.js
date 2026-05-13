import { Alert, Platform } from 'react-native';
import Constants from 'expo-constants';

function isExpoGoAndroid() {
  return Platform.OS === 'android' && Constants.appOwnership === 'expo';
}

function showExpoGoWarning() {
  Alert.alert(
    'Notificações indisponíveis no Expo Go',
    'No Android, o Expo Go não suporta mais notificações push/remotas com expo-notifications. O app continua funcionando normalmente. Para usar notificações, gere uma development build.'
  );
}

async function loadNotificationsModule() {
  if (isExpoGoAndroid()) {
    return null;
  }

  try {
    return await import('expo-notifications');
  } catch (error) {
    console.log('Não foi possível carregar expo-notifications:', error?.message || error);
    return null;
  }
}

export async function requestNotificationPermission({ showWarning = false } = {}) {
  const Notifications = await loadNotificationsModule();

  if (!Notifications) {
    if (showWarning) showExpoGoWarning();
    return false;
  }

  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;

  const result = await Notifications.requestPermissionsAsync();
  return result.granted;
}

export async function scheduleLocalReminder(title, body, seconds = 60 * 60 * 24) {
  const Notifications = await loadNotificationsModule();

  if (!Notifications) {
    showExpoGoWarning();
    return null;
  }

  const granted = await requestNotificationPermission();
  if (!granted) return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('cinemood', {
      name: 'CineMood',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }

  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger: { seconds, channelId: 'cinemood' },
  });
}

export async function cancelAllLocalReminders() {
  const Notifications = await loadNotificationsModule();

  if (!Notifications) {
    showExpoGoWarning();
    return null;
  }

  return Notifications.cancelAllScheduledNotificationsAsync();
}
