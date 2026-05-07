import React from "react";
import { Text } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import { MovieProvider } from "./src/contexts/MovieContext";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import SuggestionsScreen from "./src/screens/SuggestionsScreen";
import FranchisesScreen from "./src/screens/FranchisesScreen";
import ListsScreen from "./src/screens/ListsScreen";
import MovieDetailScreen from "./src/screens/MovieDetailScreen";
import { colors } from "./src/styles/theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const insets = useSafeAreaInsets();
  const bottomPadding = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 66 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 7,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: "800" },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color }) => {
          const icons = {
            Início: "🔥",
            Pesquisar: "🔎",
            Sugestões: "🎲",
            Franquias: "🎞️",
            Listas: "⭐",
          };

          return <Text style={{ color, fontSize: 20 }}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Pesquisar" component={SearchScreen} />
      <Tab.Screen name="Sugestões" component={SuggestionsScreen} />
      <Tab.Screen name="Franquias" component={FranchisesScreen} />
      <Tab.Screen name="Listas" component={ListsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MovieProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <Stack.Navigator
            screenOptions={{
              headerStyle: { backgroundColor: colors.background },
              headerTintColor: colors.text,
              headerTitleStyle: { fontWeight: "800" },
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen
              name="MainTabs"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="MovieDetail"
              component={MovieDetailScreen}
              options={{ title: "Detalhes do filme" }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </MovieProvider>
    </SafeAreaProvider>
  );
}
