import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import * as Location from "expo-location";
import MapView, { Callout, Marker } from "react-native-maps";

import { useGeoQuest } from "../context/GeoQuestContext";
import {
  calculateDistance,
  formatDistance,
} from "../utils/locationUtils";

const DEFAULT_REGION = {
  latitude: 51.406,
  longitude: -0.305,
  latitudeDelta: 0.025,
  longitudeDelta: 0.025,
};

export default function MapScreen({ navigation }) {
  const { caches, userFinds } = useGeoQuest();

  const mapReference = useRef(null);
  const locationSubscription = useRef(null);
  const hasFittedMap = useRef(false);

  const [location, setLocation] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
  const [locationError, setLocationError] = useState("");

  async function startLocationTracking() {
    try {
      setLocationLoading(true);
      setLocationError("");

      const permission =
        await Location.requestForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        setLocationPermissionGranted(false);
        setLocationError(
          "Location permission is required to show your position and unlock caches."
        );
        return;
      }

      setLocationPermissionGranted(true);

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

      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }

      locationSubscription.current =
        await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.High,
            timeInterval: 5000,
            distanceInterval: 5,
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
    } finally {
      setLocationLoading(false);
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

  useEffect(() => {
    if (
      !mapReady ||
      !location ||
      hasFittedMap.current ||
      caches.length === 0
    ) {
      return;
    }

    const coordinates = [
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
      ...caches.map((cache) => ({
        latitude: cache.CacheLatitude,
        longitude: cache.CacheLongitude,
      })),
    ];

    mapReference.current?.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 80,
        right: 60,
        bottom: 120,
        left: 60,
      },
      animated: true,
    });

    hasFittedMap.current = true;
  }, [caches, location, mapReady]);

  function centreOnUser() {
    if (!location) {
      return;
    }

    mapReference.current?.animateToRegion(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      600
    );
  }

  function showAllCaches() {
    if (caches.length === 0) {
      return;
    }

    const coordinates = caches.map((cache) => ({
      latitude: cache.CacheLatitude,
      longitude: cache.CacheLongitude,
    }));

    mapReference.current?.fitToCoordinates(coordinates, {
      edgePadding: {
        top: 80,
        right: 60,
        bottom: 120,
        left: 60,
      },
      animated: true,
    });
  }

  function cacheHasBeenFound(cacheID) {
    return userFinds.some(
      (find) => find.FindCacheID === cacheID
    );
  }

  function getDistanceToCache(cache) {
    if (!location) {
      return null;
    }

    return calculateDistance(
      location.coords.latitude,
      location.coords.longitude,
      cache.CacheLatitude,
      cache.CacheLongitude
    );
  }

  function openCacheDetails(cacheID) {
    navigation.navigate("CacheDetails", {
      cacheID,
    });
  }

  return (
    <View style={styles.screen}>
      <MapView
        ref={mapReference}
        style={styles.map}
        initialRegion={DEFAULT_REGION}
        onMapReady={() => setMapReady(true)}
        showsUserLocation={locationPermissionGranted}
        showsMyLocationButton={false}
        showsCompass
        showsScale
      >
        {caches.map((cache) => {
          const found = cacheHasBeenFound(cache.CacheID);
          const distance = getDistanceToCache(cache);

          return (
            <Marker
              key={cache.CacheID}
              coordinate={{
                latitude: cache.CacheLatitude,
                longitude: cache.CacheLongitude,
              }}
              pinColor={found ? "#236B4E" : "#F28C28"}
            >
              <Callout
                onPress={() =>
                  openCacheDetails(cache.CacheID)
                }
              >
                <View style={styles.callout}>
                  <Text style={styles.calloutTitle}>
                    {cache.CacheName}
                  </Text>

                  <Text style={styles.calloutPoints}>
                    {cache.CachePoints} points
                  </Text>

                  <Text style={styles.calloutDistance}>
                    {formatDistance(distance)}
                  </Text>

                  <Text style={styles.calloutStatus}>
                    {found
                      ? "Already discovered"
                      : "Not yet discovered"}
                  </Text>

                  <Text style={styles.calloutAction}>
                    Tap to view cache details
                  </Text>
                </View>
              </Callout>
            </Marker>
          );
        })}
      </MapView>

      <View style={styles.mapButtons}>
        <Pressable
          style={styles.mapButton}
          onPress={showAllCaches}
          accessibilityRole="button"
          accessibilityLabel="Show all caches"
        >
          <Ionicons
            name="map"
            size={22}
            color="#236B4E"
          />
        </Pressable>

        <Pressable
          style={[
            styles.mapButton,
            !location && styles.disabledButton,
          ]}
          onPress={centreOnUser}
          disabled={!location}
          accessibilityRole="button"
          accessibilityLabel="Centre map on my location"
        >
          <Ionicons
            name="locate"
            size={22}
            color={location ? "#236B4E" : "#9AA3A0"}
          />
        </Pressable>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              styles.availableDot,
            ]}
          />

          <Text style={styles.legendText}>Available</Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendDot,
              styles.foundDot,
            ]}
          />

          <Text style={styles.legendText}>Found</Text>
        </View>
      </View>

      {locationLoading && (
        <View style={styles.statusBanner}>
          <ActivityIndicator
            size="small"
            color="#236B4E"
          />

          <Text style={styles.statusText}>
            Finding your location...
          </Text>
        </View>
      )}

      {!locationLoading && locationError !== "" && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>
            {locationError}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={startLocationTracking}
            accessibilityRole="button"
          >
            <Text style={styles.retryText}>
              Try again
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7F6",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapButtons: {
    position: "absolute",
    top: 16,
    right: 16,
  },
  mapButton: {
    width: 48,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#DDE3E0",
    elevation: 4,
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.18,
    shadowRadius: 4,
  },
  disabledButton: {
    opacity: 0.7,
  },
  legend: {
    position: "absolute",
    left: 16,
    bottom: 18,
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 14,
  },
  legendDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    marginRight: 6,
  },
  availableDot: {
    backgroundColor: "#F28C28",
  },
  foundDot: {
    backgroundColor: "#236B4E",
  },
  legendText: {
    color: "#475467",
    fontSize: 13,
    fontWeight: "600",
  },
  statusBanner: {
    position: "absolute",
    top: 16,
    left: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "#DDE3E0",
  },
  statusText: {
    color: "#475467",
    fontSize: 14,
    marginLeft: 8,
  },
  errorBanner: {
    position: "absolute",
    left: 16,
    right: 76,
    top: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E6B8B3",
  },
  errorText: {
    color: "#9F2D20",
    fontSize: 13,
    lineHeight: 18,
  },
  retryButton: {
    alignSelf: "flex-start",
    marginTop: 8,
  },
  retryText: {
    color: "#236B4E",
    fontSize: 14,
    fontWeight: "bold",
  },
  callout: {
    width: 210,
    padding: 4,
  },
  calloutTitle: {
    color: "#1F2933",
    fontSize: 16,
    fontWeight: "bold",
  },
  calloutPoints: {
    color: "#236B4E",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 5,
  },
  calloutDistance: {
    color: "#667085",
    fontSize: 13,
    marginTop: 4,
  },
  calloutStatus: {
    color: "#667085",
    fontSize: 13,
    marginTop: 4,
  },
  calloutAction: {
    color: "#236B4E",
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 8,
  },
});