import { createNativeStackNavigator } from "@react-navigation/native-stack";

import MainTabNavigator from "./MainTabNavigator";
import CacheDetailsScreen from "../screens/CacheDetailsScreen";
import LogFindScreen from "../screens/LogFindScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#236B4E",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="CacheDetails"
        component={CacheDetailsScreen}
        options={{ title: "Cache Details" }}
      />

      <Stack.Screen
        name="LogFind"
        component={LogFindScreen}
        options={{ title: "Log Discovery" }}
      />
    </Stack.Navigator>
  );
}