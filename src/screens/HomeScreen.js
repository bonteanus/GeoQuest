import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGeoQuest } from "../context/GeoQuestContext";

export default function HomeScreen() {
  const {
    currentUser,
    userFinds,
    totalPoints,
    availableCaches,
    loading,
    error,
  } = useGeoQuest();

  if (loading) {
    return (
      <View style={styles.centredScreen}>
        <ActivityIndicator size="large" color="#236B4E" />
        <Text style={styles.loadingText}>Loading GeoQuest...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centredScreen}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen} edges={["left", "right", "bottom"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.welcomeText}>
            Welcome, {currentUser?.UserFirstname}
          </Text>

          <Text style={styles.subtitle}>
            Explore real locations, discover caches and earn points.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.firstCard]}>
            <Text style={styles.statNumber}>{userFinds.length}</Text>
            <Text style={styles.statLabel}>Caches found</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{totalPoints}</Text>
            <Text style={styles.statLabel}>Total points</Text>
          </View>
        </View>

        <View style={styles.availableCard}>
          <Text style={styles.availableNumber}>{availableCaches.length}</Text>

          <View style={styles.availableTextContainer}>
            <Text style={styles.availableTitle}>Caches available</Text>
            <Text style={styles.availableDescription}>
              Open the map to begin your next GeoQuest adventure.
            </Text>
          </View>
        </View>

        <View style={styles.messageCard}>
          <Text style={styles.messageTitle}>Kingston Campus Quest</Text>

          <Text style={styles.messageText}>
            Discover virtual caches around Kingston. Reach each location,
            unlock the cache and record your find to earn points.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7F6",
  },
  content: {
    padding: 20,
  },
  centredScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7F6",
    padding: 20,
  },
  loadingText: {
    color: "#667085",
    fontSize: 15,
    marginTop: 12,
  },
  errorText: {
    color: "#C0392B",
    fontSize: 16,
    textAlign: "center",
  },
  hero: {
    backgroundColor: "#236B4E",
    borderRadius: 18,
    padding: 24,
    marginTop: 16,
  },
  welcomeText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
  },
  subtitle: {
    color: "#E6F2EC",
    fontSize: 16,
    lineHeight: 23,
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  firstCard: {
    marginRight: 12,
  },
  statNumber: {
    color: "#236B4E",
    fontSize: 28,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#667085",
    fontSize: 14,
    marginTop: 4,
  },
  availableCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF4E8",
    borderRadius: 14,
    padding: 18,
    marginTop: 20,
  },
  availableNumber: {
    color: "#B85C00",
    fontSize: 32,
    fontWeight: "bold",
    marginRight: 16,
  },
  availableTextContainer: {
    flex: 1,
  },
  availableTitle: {
    color: "#1F2933",
    fontSize: 17,
    fontWeight: "bold",
  },
  availableDescription: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  messageCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  messageTitle: {
    color: "#1F2933",
    fontSize: 18,
    fontWeight: "bold",
  },
  messageText: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
});