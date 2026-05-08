import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { MovieProvider } from "./src/contexts/MovieContext";
import AuthScreen from "./src/screens/AuthScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SearchScreen from "./src/screens/SearchScreen";
import SuggestionsScreen from "./src/screens/SuggestionsScreen";
import FranchisesScreen from "./src/screens/FranchisesScreen";
import ClubsScreen from "./src/screens/ClubsScreen";
import ListsScreen from "./src/screens/ListsScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import MovieDetailScreen from "./src/screens/MovieDetailScreen";
import ClubDetailScreen from "./src/screens/ClubDetailScreen";
import { colors } from "./src/styles/theme";

const linking = {
  prefixes: ["cinemood://"],
  config: {
    screens: {
      Auth: "auth/callback",
      MainTabs: "app",
    },
  },
};

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
          height: 68 + bottomPadding,
          paddingBottom: bottomPadding,
          paddingTop: 7,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontSize: 9, fontWeight: "800" },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color }) => {
          const icons = {
            Início: "🔥",
            Pesquisar: "🔎",
            Sugestões: "🎲",
            Franquias: "🎞️",
            Clubes: "👥",
            Listas: "⭐",
            Usuário: "⚙️",
          };

          return <Text style={{ color, fontSize: 18 }}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Pesquisar" component={SearchScreen} />
      <Tab.Screen name="Sugestões" component={SuggestionsScreen} />
      <Tab.Screen name="Franquias" component={FranchisesScreen} />
      <Tab.Screen name="Clubes" component={ClubsScreen} />
      <Tab.Screen name="Listas" component={ListsScreen} />
      <Tab.Screen name="Usuário" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }}>
      <ActivityIndicator color={colors.primary} size="large" />
      <Text style={{ color: colors.muted, marginTop: 12 }}>Abrindo CineMood...</Text>
    </View>
  );
}

function AppNavigator() {
  const { session, loadingAuth } = useAuth();

  if (loadingAuth) return <LoadingScreen />;

  if (!session) {
    return (
      <NavigationContainer linking={linking}>
        <StatusBar style="light" />
        <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
          <Stack.Screen name="Auth" component={AuthScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <MovieProvider>
      <NavigationContainer linking={linking}>
        <StatusBar style="light" />
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: colors.background },
            headerTintColor: colors.text,
            headerTitleStyle: { fontWeight: "800" },
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="MovieDetail" component={MovieDetailScreen} options={{ title: "Detalhes do filme" }} />
          <Stack.Screen name="ClubDetail" component={ClubDetailScreen} options={{ title: "Clube de filmes" }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "Perfil" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </MovieProvider>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
