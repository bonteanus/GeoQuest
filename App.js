import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { GeoQuestProvider } from "./src/context/GeoQuestContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <GeoQuestProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <StatusBar style="light" />
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </GeoQuestProvider>
  );
}