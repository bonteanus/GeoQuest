import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGeoQuest } from "../context/GeoQuestContext";

const MAXIMUM_ACCEPTABLE_ACCURACY = 100;

export default function ProfileScreen() {
  const {
    currentUser,
    currentPlayer,
    caches,
    userFinds,
    totalPoints,
    loading,
    createTrainingCache,
  } = useGeoQuest();

  const [creatingCache, setCreatingCache] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const trainingCache = caches.find(
    (cache) => cache.CacheIsTraining === true
  );

  async function handleCreateTrainingCache() {
    try {
      setCreatingCache(true);
      setSuccessMessage("");
      setErrorMessage("");

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setErrorMessage(
          "Location permission is required to create a training cache."
        );
        return;
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

      const accuracy =
        currentLocation.coords.accuracy;

      if (
        accuracy !== null &&
        accuracy !== undefined &&
        accuracy > MAXIMUM_ACCEPTABLE_ACCURACY
      ) {
        setErrorMessage(
          "The GPS signal is not accurate enough. Move outdoors and try again."
        );
        return;
      }

      await createTrainingCache(
        currentLocation.coords.latitude,
        currentLocation.coords.longitude
      );

      setSuccessMessage(
        "Training cache created nearby. Open the map to find and unlock it."
      );
    } catch (error) {
      console.error(error);

      setErrorMessage(
        "GeoQuest could not create the training cache."
      );
    } finally {
      setCreatingCache(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.centredScreen}>
        <ActivityIndicator
          size="large"
          color="#236B4E"
        />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {currentUser?.UserFirstname?.charAt(0)}
              {currentUser?.UserLastname?.charAt(0)}
            </Text>
          </View>

          <Text style={styles.name}>
            {currentUser?.UserFirstname}{" "}
            {currentUser?.UserLastname}
          </Text>

          <Text style={styles.username}>
            @{currentUser?.UserUsername}
          </Text>

          <Text style={styles.role}>
            Event owner and player
          </Text>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, styles.firstStat]}>
            <Text style={styles.statNumber}>
              {userFinds.length}
            </Text>
            <Text style={styles.statLabel}>Finds</Text>
          </View>

          <View style={[styles.statCard, styles.firstStat]}>
            <Text style={styles.statNumber}>
              {totalPoints}
            </Text>
            <Text style={styles.statLabel}>Points</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              #{currentPlayer?.PlayerID ?? "-"}
            </Text>
            <Text style={styles.statLabel}>Player</Text>
          </View>
        </View>

        <View style={styles.trainingCard}>
          <Text style={styles.sectionLabel}>
            EVENT OWNER TOOL
          </Text>

          <Text style={styles.trainingTitle}>
            Training cache
          </Text>

          <Text style={styles.trainingDescription}>
            Create a practice cache approximately 15–20
            metres from your current GPS position. Its
            coordinates are stored only on this device.
          </Text>

          {trainingCache && (
            <View style={styles.readyBadge}>
              <Text style={styles.readyText}>
                Training cache is ready
              </Text>
            </View>
          )}

          {successMessage !== "" && (
            <Text style={styles.successMessage}>
              {successMessage}
            </Text>
          )}

          {errorMessage !== "" && (
            <Text style={styles.errorMessage}>
              {errorMessage}
            </Text>
          )}

          <Pressable
            style={[
              styles.createButton,
              creatingCache && styles.disabledButton,
            ]}
            onPress={handleCreateTrainingCache}
            disabled={creatingCache}
            accessibilityRole="button"
          >
            {creatingCache ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.createButtonText}>
                {trainingCache
                  ? "Move training cache here"
                  : "Create training cache nearby"}
              </Text>
            )}
          </Pressable>
        </View>

        <Text style={styles.safetyNote}>
          Only create and test caches in a safe location
          where you have permission to use your phone.
        </Text>
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
    paddingBottom: 36,
  },
  centredScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7F6",
  },
  profileCard: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  avatar: {
    width: 76,
    height: 76,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#236B4E",
    borderRadius: 38,
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "bold",
  },
  name: {
    color: "#1F2933",
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 14,
  },
  username: {
    color: "#667085",
    fontSize: 15,
    marginTop: 4,
  },
  role: {
    color: "#236B4E",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 8,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  firstStat: {
    marginRight: 10,
  },
  statNumber: {
    color: "#236B4E",
    fontSize: 21,
    fontWeight: "bold",
  },
  statLabel: {
    color: "#667085",
    fontSize: 12,
    marginTop: 4,
  },
  trainingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  sectionLabel: {
    color: "#B85C00",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  trainingTitle: {
    color: "#1F2933",
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 7,
  },
  trainingDescription: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  readyBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#EAF7F0",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 14,
  },
  readyText: {
    color: "#236B4E",
    fontSize: 13,
    fontWeight: "bold",
  },
  successMessage: {
    color: "#236B4E",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
  },
  errorMessage: {
    color: "#A63226",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 14,
  },
  createButton: {
    alignItems: "center",
    backgroundColor: "#236B4E",
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  disabledButton: {
    opacity: 0.7,
  },
  createButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  safetyNote: {
    color: "#667085",
    fontSize: 12,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 14,
  },
});