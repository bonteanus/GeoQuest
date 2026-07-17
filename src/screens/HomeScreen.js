import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen} edges={["left", "right", "bottom"]}>
      <View style={styles.hero}>
        <Text style={styles.title}>Welcome to GeoQuest</Text>

        <Text style={styles.subtitle}>
          Explore real locations, discover caches and earn points.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.firstCard]}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Caches found</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>0</Text>
          <Text style={styles.statLabel}>Total points</Text>
        </View>
      </View>

      <View style={styles.messageCard}>
        <Text style={styles.messageTitle}>Project setup complete</Text>

        <Text style={styles.messageText}>
          Navigation is working. The map and cache-discovery features will be
          added next.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7F6",
    padding: 20,
  },
  hero: {
    backgroundColor: "#236B4E",
    borderRadius: 18,
    padding: 24,
    marginTop: 16,
  },
  title: {
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