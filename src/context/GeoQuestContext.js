import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getAllData,
  initialiseStorage,
  saveFind,
  saveTrainingCache,
} from "../services/storageService";

const GeoQuestContext = createContext(undefined);

export function GeoQuestProvider({ children }) {
  const [data, setData] = useState({
    users: [],
    statuses: [],
    events: [],
    players: [],
    caches: [],
    finds: [],
    currentUser: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      await initialiseStorage();

      const storedData = await getAllData();

      setData(storedData);
    } catch (storageError) {
      console.error(storageError);

      setError(
        "GeoQuest could not load the saved application data."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const currentPlayer = useMemo(() => {
    if (!data.currentUser) {
      return null;
    }

    return (
      data.players.find(
        (player) =>
          player.PlayerUserID === data.currentUser.UserID
      ) ?? null
    );
  }, [data.currentUser, data.players]);

  const userFinds = useMemo(() => {
    if (!currentPlayer) {
      return [];
    }

    return data.finds.filter(
      (find) =>
        find.FindPlayerID === currentPlayer.PlayerID
    );
  }, [currentPlayer, data.finds]);

  const totalPoints = useMemo(() => {
    return userFinds.reduce((total, find) => {
      const cache = data.caches.find(
        (item) => item.CacheID === find.FindCacheID
      );

      return total + (cache?.CachePoints ?? 0);
    }, 0);
  }, [data.caches, userFinds]);

  const availableCaches = useMemo(() => {
    const foundCacheIDs = userFinds.map(
      (find) => find.FindCacheID
    );

    return data.caches.filter(
      (cache) =>
        !foundCacheIDs.includes(cache.CacheID)
    );
  }, [data.caches, userFinds]);

  async function recordFind(cacheID, imageURL = "") {
    if (!currentPlayer) {
      throw new Error("No active player could be found.");
    }

    await saveFind({
      FindPlayerID: currentPlayer.PlayerID,
      FindCacheID: cacheID,
      FindImageURL: imageURL,
    });

    await refreshData();
  }

  async function createTrainingCache(
    latitude,
    longitude
  ) {
    const trainingCache = await saveTrainingCache(
      latitude,
      longitude
    );

    await refreshData();

    return trainingCache;
  }

  const contextValue = {
    ...data,
    currentPlayer,
    userFinds,
    totalPoints,
    availableCaches,
    loading,
    error,
    refreshData,
    recordFind,
    createTrainingCache,
  };

  return (
    <GeoQuestContext.Provider value={contextValue}>
      {children}
    </GeoQuestContext.Provider>
  );
}

export function useGeoQuest() {
  const context = useContext(GeoQuestContext);

  if (context === undefined) {
    throw new Error(
      "useGeoQuest must be used inside GeoQuestProvider."
    );
  }

  return context;
}