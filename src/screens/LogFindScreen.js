import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { SafeAreaView } from "react-native-safe-area-context";

import { useGeoQuest } from "../context/GeoQuestContext";

export default function LogFindScreen({ route, navigation }) {
  const cacheID = Number(route.params?.cacheID);

  const {
    caches,
    userFinds,
    recordFind,
  } = useGeoQuest();

  const cache = caches.find(
    (item) => item.CacheID === cacheID
  );

  const existingFind = userFinds.find(
    (find) => find.FindCacheID === cacheID
  );

  const [imageURI, setImageURI] = useState("");
  const [cameraError, setCameraError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function takePhoto() {
    try {
      setCameraError("");

      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        setCameraError(
          "Camera permission is required to record photo evidence."
        );
        return;
      }

      const result =
        await ImagePicker.launchCameraAsync({
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.7,
        });

      if (!result.canceled && result.assets?.length > 0) {
        setImageURI(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);

      setCameraError(
        "GeoQuest could not open the camera. Please try again."
      );
    }
  }

  async function confirmDiscovery() {
    if (!cache) {
      return;
    }

    if (existingFind) {
      Alert.alert(
        "Already discovered",
        "You have already earned the points for this cache."
      );

      return;
    }

    if (!imageURI) {
      Alert.alert(
        "Photo required",
        "Take a photograph as evidence before logging this discovery."
      );

      return;
    }

    try {
      setSubmitting(true);

      await recordFind(cache.CacheID, imageURI);

      Alert.alert(
        "Discovery logged!",
        `You earned ${cache.CachePoints} points for finding ${cache.CacheName}.`,
        [
          {
            text: "Back to map",
            onPress: () =>
              navigation.navigate("MainTabs", {
                screen: "Map",
              }),
          },
          {
            text: "View profile",
            onPress: () =>
              navigation.navigate("MainTabs", {
                screen: "Profile",
              }),
          },
        ]
      );
    } catch (error) {
      console.error(error);

      Alert.alert(
        "Could not log discovery",
        error.message ||
          "GeoQuest could not save this discovery."
      );
    } finally {
      setSubmitting(false);
    }
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

  if (existingFind) {
    return (
      <SafeAreaView
        style={styles.screen}
        edges={["left", "right", "bottom"]}
      >
        <View style={styles.centredScreen}>
          <View style={styles.successIcon}>
            <Text style={styles.successIconText}>✓</Text>
          </View>

          <Text style={styles.completedTitle}>
            Discovery completed
          </Text>

          <Text style={styles.completedMessage}>
            You have already discovered {cache.CacheName} and
            earned {cache.CachePoints} points.
          </Text>

          {existingFind.FindImageURL !== "" && (
            <Image
              source={{
                uri: existingFind.FindImageURL,
              }}
              style={styles.completedImage}
              resizeMode="cover"
            />
          )}

          <Pressable
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate("MainTabs", {
                screen: "Map",
              })
            }
            accessibilityRole="button"
          >
            <Text style={styles.primaryButtonText}>
              Return to map
            </Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={styles.screen}
      edges={["left", "right", "bottom"]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.cacheCard}>
          <View style={styles.cacheHeading}>
            <View style={styles.cacheText}>
              <Text style={styles.cacheName}>
                {cache.CacheName}
              </Text>

              <Text style={styles.unlockedLabel}>
                CACHE UNLOCKED
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

          <Text style={styles.cacheDescription}>
            You are close enough to this cache. Take a
            photograph as evidence of your discovery.
          </Text>
        </View>

        <View style={styles.photoCard}>
          <Text style={styles.sectionTitle}>
            Photo evidence
          </Text>

          <Text style={styles.sectionDescription}>
            The photograph will be stored with your discovery
            record.
          </Text>

          {imageURI ? (
            <Image
              source={{ uri: imageURI }}
              style={styles.photo}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Text style={styles.cameraIcon}>📷</Text>

              <Text style={styles.placeholderTitle}>
                No photograph taken
              </Text>

              <Text style={styles.placeholderMessage}>
                Use your device camera to capture evidence.
              </Text>
            </View>
          )}

          {cameraError !== "" && (
            <View style={styles.errorCard}>
              <Text style={styles.cameraErrorText}>
                {cameraError}
              </Text>
            </View>
          )}

          <Pressable
            style={styles.cameraButton}
            onPress={takePhoto}
            disabled={submitting}
            accessibilityRole="button"
          >
            <Text style={styles.cameraButtonText}>
              {imageURI
                ? "Retake photograph"
                : "Open camera"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.confirmationCard}>
          <Text style={styles.sectionTitle}>
            Confirm discovery
          </Text>

          <Text style={styles.sectionDescription}>
            Once confirmed, this cache will be added to your
            discovery history and its points will be added to
            your score.
          </Text>

          <Pressable
            style={[
              styles.primaryButton,
              (!imageURI || submitting) &&
                styles.disabledButton,
            ]}
            onPress={confirmDiscovery}
            disabled={!imageURI || submitting}
            accessibilityRole="button"
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.primaryButtonText}>
                Log discovery
              </Text>
            )}
          </Pressable>
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
    paddingBottom: 40,
  },
  centredScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7F6",
    padding: 24,
  },
  errorTitle: {
    color: "#1F2933",
    fontSize: 22,
    fontWeight: "bold",
  },
  errorMessage: {
    color: "#667085",
    fontSize: 15,
    textAlign: "center",
    marginTop: 8,
  },
  cacheCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  cacheHeading: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  cacheText: {
    flex: 1,
    marginRight: 14,
  },
  cacheName: {
    color: "#1F2933",
    fontSize: 24,
    fontWeight: "bold",
  },
  unlockedLabel: {
    color: "#236B4E",
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1.2,
    marginTop: 7,
  },
  cacheDescription: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 14,
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
  photoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  sectionTitle: {
    color: "#1F2933",
    fontSize: 19,
    fontWeight: "bold",
  },
  sectionDescription: {
    color: "#667085",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  photoPlaceholder: {
    height: 230,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7F6",
    borderRadius: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#B9C3BE",
    marginTop: 16,
    padding: 20,
  },
  cameraIcon: {
    fontSize: 44,
  },
  placeholderTitle: {
    color: "#1F2933",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  placeholderMessage: {
    color: "#667085",
    fontSize: 14,
    textAlign: "center",
    marginTop: 5,
  },
  photo: {
    width: "100%",
    height: 260,
    borderRadius: 14,
    backgroundColor: "#E4E9E6",
    marginTop: 16,
  },
  errorCard: {
    backgroundColor: "#FFF1F0",
    borderColor: "#E6B8B3",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  cameraErrorText: {
    color: "#9F2D20",
    fontSize: 14,
    lineHeight: 20,
  },
  cameraButton: {
    alignItems: "center",
    backgroundColor: "#EAF7F0",
    borderColor: "#9FD3B5",
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
    marginTop: 16,
  },
  cameraButtonText: {
    color: "#236B4E",
    fontSize: 15,
    fontWeight: "bold",
  },
  confirmationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  primaryButton: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#236B4E",
    borderRadius: 14,
    padding: 17,
    marginTop: 18,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#9AA3A0",
  },
  successIcon: {
    width: 72,
    height: 72,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#EAF7F0",
    borderRadius: 36,
  },
  successIconText: {
    color: "#236B4E",
    fontSize: 40,
    fontWeight: "bold",
  },
  completedTitle: {
    color: "#1F2933",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 18,
  },
  completedMessage: {
    color: "#667085",
    fontSize: 15,
    lineHeight: 22,
    textAlign: "center",
    marginTop: 8,
  },
  completedImage: {
    width: "100%",
    height: 250,
    borderRadius: 16,
    backgroundColor: "#E4E9E6",
    marginTop: 20,
  },
});