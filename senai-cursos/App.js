import React, { useState } from 'react';
import { BottomNavigation, PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HomeScreen from './src/screens/HomeScreen';
import SchoolScreen from './src/screens/SchoolScreen';
import ContactScreen from './src/screens/ContactScreen';
import { theme } from './src/styles/theme';
import { colors } from './src/styles/colors';

const renderScene = BottomNavigation.SceneMap({
  courses: HomeScreen,
  school: SchoolScreen,
  contact: ContactScreen,
});

export default function App() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: 'courses',
      title: 'Cursos',
      focusedIcon: 'book-open-page-variant',
      unfocusedIcon: 'book-open-page-variant-outline',
    },
    {
      key: 'school',
      title: 'Escola',
      focusedIcon: 'domain',
      unfocusedIcon: 'domain',
    },
    {
      key: 'contact',
      title: 'Contato',
      focusedIcon: 'email',
      unfocusedIcon: 'email-outline',
    },
  ]);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar style="light" backgroundColor={colors.primary} />
        <BottomNavigation
          navigationState={{ index, routes }}
          onIndexChange={setIndex}
          renderScene={renderScene}
          barStyle={{ backgroundColor: '#FFFFFF' }}
          activeColor={colors.primary}
          inactiveColor={colors.muted}
        />
      </PaperProvider>
    </SafeAreaProvider>
  );
}
