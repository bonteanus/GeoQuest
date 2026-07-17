import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  seedCaches,
  seedEvents,
  seedFinds,
  seedPlayers,
  seedStatuses,
  seedUsers,
} from "../data/seedData";

const STORAGE_VERSION = "1";

const STORAGE_KEYS = {
  version: "@geoquest/version",
  currentUserID: "@geoquest/current-user-id",
  users: "@geoquest/users",
  statuses: "@geoquest/statuses",
  events: "@geoquest/events",
  players: "@geoquest/players",
  caches: "@geoquest/caches",
  finds: "@geoquest/finds",
};

async function readJSON(key, fallbackValue = []) {
  const storedValue = await AsyncStorage.getItem(key);

  if (storedValue === null) {
    return fallbackValue;
  }

  return JSON.parse(storedValue);
}

async function writeJSON(key, value) {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function initialiseStorage() {
  const existingVersion = await AsyncStorage.getItem(STORAGE_KEYS.version);

  if (existingVersion === STORAGE_VERSION) {
    return;
  }

  await AsyncStorage.multiSet([
    [STORAGE_KEYS.version, STORAGE_VERSION],
    [STORAGE_KEYS.currentUserID, "1"],
    [STORAGE_KEYS.users, JSON.stringify(seedUsers)],
    [STORAGE_KEYS.statuses, JSON.stringify(seedStatuses)],
    [STORAGE_KEYS.events, JSON.stringify(seedEvents)],
    [STORAGE_KEYS.players, JSON.stringify(seedPlayers)],
    [STORAGE_KEYS.caches, JSON.stringify(seedCaches)],
    [STORAGE_KEYS.finds, JSON.stringify(seedFinds)],
  ]);
}

export async function getUsers() {
  return readJSON(STORAGE_KEYS.users);
}

export async function getStatuses() {
  return readJSON(STORAGE_KEYS.statuses);
}

export async function getEvents() {
  return readJSON(STORAGE_KEYS.events);
}

export async function getPlayers() {
  return readJSON(STORAGE_KEYS.players);
}

export async function getCaches() {
  return readJSON(STORAGE_KEYS.caches);
}

export async function getFinds() {
  return readJSON(STORAGE_KEYS.finds);
}

export async function getCurrentUser() {
  const users = await getUsers();
  const storedUserID = await AsyncStorage.getItem(STORAGE_KEYS.currentUserID);
  const currentUserID = Number(storedUserID ?? 1);

  return users.find((user) => user.UserID === currentUserID) ?? users[0];
}

export async function getAllData() {
  const [
    users,
    statuses,
    events,
    players,
    caches,
    finds,
    currentUser,
  ] = await Promise.all([
    getUsers(),
    getStatuses(),
    getEvents(),
    getPlayers(),
    getCaches(),
    getFinds(),
    getCurrentUser(),
  ]);

  return {
    users,
    statuses,
    events,
    players,
    caches,
    finds,
    currentUser,
  };
}

export async function saveFind(findDetails) {
  const finds = await getFinds();

  const alreadyFound = finds.some(
    (find) =>
      find.FindPlayerID === findDetails.FindPlayerID &&
      find.FindCacheID === findDetails.FindCacheID
  );

  if (alreadyFound) {
    throw new Error("This cache has already been logged.");
  }

  const nextFindID =
    finds.reduce(
      (largestID, find) => Math.max(largestID, Number(find.FindID)),
      0
    ) + 1;

  const newFind = {
    FindID: nextFindID,
    FindPlayerID: findDetails.FindPlayerID,
    FindCacheID: findDetails.FindCacheID,
    FindDatetime: new Date().toISOString(),
    FindImageURL: findDetails.FindImageURL ?? "",
  };

  const updatedFinds = [...finds, newFind];

  await writeJSON(STORAGE_KEYS.finds, updatedFinds);

  return newFind;
}