import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/HomeScreen";
import MapScreen from "../screens/MapScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

const TAB_ICONS = {
  Home: "home",
  Map: "map",
  Leaderboard: "trophy",
  Profile: "person",
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerStyle: {
          backgroundColor: "#236B4E",
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        tabBarActiveTintColor: "#236B4E",
        tabBarInactiveTintColor: "#7A8580",
        tabBarStyle: {
          backgroundColor: "#FFFFFF",
          borderTopColor: "#DDE3E0",
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ color, size }) => (
          <Ionicons
            name={TAB_ICONS[route.name]}
            color={color}
            size={size}
          />
        ),
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "GeoQuest" }}
      />

      <Tab.Screen
        name="Map"
        component={MapScreen}
        options={{ title: "Cache Map" }}
      />

      <Tab.Screen
        name="Leaderboard"
        component={LeaderboardScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: "Player Profile" }}
      />
    </Tab.Navigator>
  );
}