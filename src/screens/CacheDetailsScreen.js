import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGeoQuest } from "../context/GeoQuestContext";
import {
  calculateDistance,
  formatDistance,
} from "../utils/locationUtils";

const UNLOCK_DISTANCE_METRES = 50;
const MAXIMUM_ACCEPTABLE_ACCURACY = 100;

export default function CacheDetailsScreen({
  route,
  navigation,
}) {
  const cacheID = Number(route.params?.cacheID);

  const { caches, userFinds, loading } = useGeoQuest();

  const locationSubscription = useRef(null);

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  const cache = caches.find(
    (item) => item.CacheID === cacheID
  );

  const existingFind = userFinds.find(
    (find) => find.FindCacheID === cacheID
  );

  async function startLocationTracking() {
    try {
      setLocationError("");

      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setLocationError(
          "Location permission is required to unlock this cache."
        );

        return;
      }

      const lastKnownLocation =
        await Location.getLastKnownPositionAsync({
          maxAge: 60000,
          requiredAccuracy: 1000,
        });

      if (lastKnownLocation) {
        setLocation(lastKnownLocation);
      }

      const currentLocation =
        await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

      setLocation(currentLocation);

      locationSubscription.current =
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 3000,
            distanceInterval: 3,
          },
          (updatedLocation) => {
            setLocation(updatedLocation);
          },
          (reason) => {
            setLocationError(reason);
          }
        );
    } catch (error) {
      console.error(error);

      setLocationError(
        "GeoQuest could not retrieve your current location."
      );
    }
  }

  useEffect(() => {
    startLocationTracking();

    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.centredScreen}>
        <ActivityIndicator
          size="large"
          color="#236B4E"
        />

        <Text style={styles.loadingText}>
          Loading cache...
        </Text>
      </View>
    );
  }

  if (!cache) {
    return (
      <View style={styles.centredScreen}>
        <Text style={styles.errorTitle}>
          Cache not found
        </Text>

        <Text style={styles.errorMessage}>
          This cache is no longer available.
        </Text>
      </View>
    );
  }

  const distance = location
    ? calculateDistance(
        location.coords.latitude,
        location.coords.longitude,
        cache.CacheLatitude,
        cache.CacheLongitude
      )
    : null;

  const accuracy = location?.coords?.accuracy;

  const hasAcceptableAccuracy =
    accuracy === null ||
    accuracy === undefined ||
    accuracy <= MAXIMUM_ACCEPTABLE_ACCURACY;

  const cacheIsUnlocked =
    distance !== null &&
    distance <= UNLOCK_DISTANCE_METRES &&
    hasAcceptableAccuracy;

  async function openWalkingDirections() {
    const destination =
      `${cache.CacheLatitude},${cache.CacheLongitude}`;

    const directionsURL = Platform.select({
      ios:
        `https://maps.apple.com/?daddr=${destination}` +
        "&dirflg=w",

      android:
        "https://www.google.com/maps/dir/?api=1" +
        `&destination=${destination}` +
        "&travelmode=walking",

      default:
        "https://www.google.com/maps/dir/?api=1" +
        `&destination=${destination}` +
        "&travelmode=walking",
    });

    try {
      const canOpenDirections =
        await Linking.canOpenURL(directionsURL);

      if (!canOpenDirections) {
        throw new Error(
          "No maps application is available."
        );
      }

      await Linking.openURL(directionsURL);
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Directions unavailable",
        "GeoQuest could not open walking directions on this device."
      );
    }
  }

  function continueToLogFind() {
    navigation.navigate("LogFind", {
      cacheID: cache.CacheID,
    });
  }

  function getStatusTitle() {
    if (existingFind) {
      return "Cache already discovered";
    }

    if (!location) {
      return "Finding your location";
    }

    if (!hasAcceptableAccuracy) {
      return "Waiting for a better GPS signal";
    }

    if (cacheIsUnlocked) {
      return "Cache unlocked!";
    }

    return "Cache is locked";
  }

  function getStatusMessage() {
    if (existingFind) {
      return "You have already earned the points for this cache.";
    }

    if (!location) {
      return "GeoQuest is checking your distance from the cache.";
    }

    if (!hasAcceptableAccuracy) {
      return "Move outdoors or enable precise location for a more accurate reading.";
    }

    if (cacheIsUnlocked) {
      return "You are close enough to record this discovery.";
    }

    return `Move within ${UNLOCK_DISTANCE_METRES} metres to unlock this cache.`;
  }

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headingRow}>
          <View style={styles.headingText}>
            <Text style={styles.cacheName}>
              {cache.CacheName}
            </Text>

            <Text style={styles.cacheDescription}>
              {cache.CacheDescription}
            </Text>
          </View>

          <View style={styles.pointsBadge}>
            <Text style={styles.pointsNumber}>
              {cache.CachePoints}
            </Text>

            <Text style={styles.pointsLabel}>
              points
            </Text>
          </View>
        </View>

        <View style={styles.clueCard}>
          <Text style={styles.sectionLabel}>
            CLUE
          </Text>

          <Text style={styles.clueText}>
            {cache.CacheClue}
          </Text>
        </View>

        <View
          style={[
            styles.statusCard,
            existingFind
              ? styles.foundCard
              : cacheIsUnlocked
                ? styles.unlockedCard
                : styles.lockedCard,
          ]}
        >
          <Text style={styles.statusTitle}>
            {getStatusTitle()}
          </Text>

          <Text style={styles.statusMessage}>
            {getStatusMessage()}
          </Text>

          {location && (
            <>
              <Text style={styles.distanceText}>
                {formatDistance(distance)}
              </Text>

              {accuracy !== null &&
                accuracy !== undefined && (
                  <Text style={styles.accuracyText}>
                    GPS accuracy: approximately{" "}
                    {Math.round(accuracy)} metres
                  </Text>
                )}
            </>
          )}

          {!location && locationError === "" && (
            <ActivityIndicator
              style={styles.locationLoader}
              color="#236B4E"
            />
          )}
        </View>

        {locationError !== "" && (
          <View style={styles.locationErrorCard}>
            <Text style={styles.locationErrorText}>
              {locationError}
            </Text>

            <Pressable
              style={styles.retryButton}
              onPress={startLocationTracking}
              accessibilityRole="button"
            >
              <Text style={styles.retryButtonText}>
                Try again
              </Text>
            </Pressable>
          </View>
        )}

        <Pressable
          style={styles.directionsButton}
          onPress={openWalkingDirections}
          accessibilityRole="button"
          accessibilityLabel={`Open walking directions to ${cache.CacheName}`}
        >
          <Text style={styles.directionsButtonText}>
            Open walking directions
          </Text>
        </Pressable>

        <Pressable
          style={[
            styles.actionButton,
            (!cacheIsUnlocked || existingFind) &&
              styles.disabledActionButton,
          ]}
          onPress={continueToLogFind}
          disabled={
            !cacheIsUnlocked || Boolean(existingFind)
          }
          accessibilityRole="button"
        >
          <Text style={styles.actionButtonText}>
            {existingFind
              ? "Cache already logged"
              : cacheIsUnlocked
                ? "Continue to log find"
                : "Move closer to unlock"}
          </Text>
        </Pressable>

        <Text style={styles.proximityNote}>
          GeoQuest continuously checks your foreground GPS
          position. The cache unlocks at{" "}
          {UNLOCK_DISTANCE_METRES} metres or closer.
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
  errorTitle: {
    color: "#1F2933",
    fontSize: 22,
    fontWeight: "bold",
  },
  errorMessage: {
    color: "#667085",
    fontSize: 15,
    marginTop: 8,
  },
  headingRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  headingText: {
    flex: 1,
    marginRight: 14,
  },
  cacheName: {
    color: "#1F2933",
    fontSize: 24,
    fontWeight: "bold",
  },
  cacheDescription: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  pointsBadge: {
    minWidth: 74,
    alignItems: "center",
    backgroundColor: "#FFF4E8",
    borderRadius: 14,
    padding: 12,
  },
  pointsNumber: {
    color: "#B85C00",
    fontSize: 22,
    fontWeight: "bold",
  },
  pointsLabel: {
    color: "#8A4B0F",
    fontSize: 12,
    marginTop: 2,
  },
  clueCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  sectionLabel: {
    color: "#236B4E",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.2,
  },
  clueText: {
    color: "#1F2933",
    fontSize: 17,
    lineHeight: 25,
    marginTop: 8,
    fontStyle: "italic",
  },
  statusCard: {
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
  },
  lockedCard: {
    backgroundColor: "#FFF7ED",
    borderColor: "#F3C892",
  },
  unlockedCard: {
    backgroundColor: "#EAF7F0",
    borderColor: "#9FD3B5",
  },
  foundCard: {
    backgroundColor: "#EEF4FF",
    borderColor: "#B5C9F3",
  },
  statusTitle: {
    color: "#1F2933",
    fontSize: 20,
    fontWeight: "bold",
  },
  statusMessage: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  distanceText: {
    color: "#236B4E",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
  },
  accuracyText: {
    color: "#667085",
    fontSize: 13,
    marginTop: 5,
  },
  locationLoader: {
    alignSelf: "flex-start",
    marginTop: 16,
  },
  locationErrorCard: {
    backgroundColor: "#FFF1F0",
    borderColor: "#E6B8B3",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
  },
  locationErrorText: {
    color: "#9F2D20",
    fontSize: 14,
    lineHeight: 20,
  },
  retryButton: {
    alignSelf: "flex-start",
    marginTop: 10,
  },
  retryButtonText: {
    color: "#236B4E",
    fontSize: 14,
    fontWeight: "bold",
  },
  directionsButton: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#236B4E",
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    marginTop: 20,
  },
  directionsButtonText: {
    color: "#236B4E",
    fontSize: 16,
    fontWeight: "bold",
  },
  actionButton: {
    alignItems: "center",
    backgroundColor: "#236B4E",
    borderRadius: 14,
    padding: 17,
    marginTop: 12,
  },
  disabledActionButton: {
    backgroundColor: "#9AA3A0",
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  proximityNote: {
    color: "#667085",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 14,
    marginBottom: 20,
  },
});