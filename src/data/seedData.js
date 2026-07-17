export const seedUsers = [
  {
    UserID: 1,
    UserFirstname: "Stefan",
    UserLastname: "Bonteanu",
    UserPhone: "",
    UserUsername: "stefan",
    UserPassword: "",
    UserLatitude: 0,
    UserLongitude: 0,
    UserTimestamp: 0,
    UserImageURL: "",
  },
  {
    UserID: 2,
    UserFirstname: "Maya",
    UserLastname: "Chen",
    UserPhone: "",
    UserUsername: "maya",
    UserPassword: "",
    UserLatitude: 0,
    UserLongitude: 0,
    UserTimestamp: 0,
    UserImageURL: "",
  },
  {
    UserID: 3,
    UserFirstname: "Jordan",
    UserLastname: "Lee",
    UserPhone: "",
    UserUsername: "jordan",
    UserPassword: "",
    UserLatitude: 0,
    UserLongitude: 0,
    UserTimestamp: 0,
    UserImageURL: "",
  },
];

export const seedStatuses = [
  {
    StatusID: 1,
    StatusName: "Planned",
    StatusOrder: 1,
  },
  {
    StatusID: 2,
    StatusName: "Started",
    StatusOrder: 2,
  },
  {
    StatusID: 3,
    StatusName: "Completed",
    StatusOrder: 3,
  },
];

export const seedEvents = [
  {
    EventID: 1,
    EventName: "Kingston Campus Quest",
    EventDescription:
      "Discover virtual caches around Kingston and compete for points.",
    EventOwnerID: 1,
    EventIspublic: true,
    EventStart: "2026-07-17T09:00:00.000Z",
    EventFinish: "2026-12-31T18:00:00.000Z",
    EventStatusID: 2,
  },
];

export const seedPlayers = [
  {
    PlayerID: 1,
    PlayerUserID: 1,
    PlayerEventID: 1,
  },
  {
    PlayerID: 2,
    PlayerUserID: 2,
    PlayerEventID: 1,
  },
  {
    PlayerID: 3,
    PlayerUserID: 3,
    PlayerEventID: 1,
  },
];

export const seedCaches = [
  {
    CacheID: 1,
    CacheName: "Campus Entrance",
    CacheDescription:
      "A beginner cache near the main entrance of the campus.",
    CacheEventID: 1,
    CacheImageURL: "",
    CacheClue: "Look for the place where every campus journey begins.",
    CachePoints: 100,
    CacheLatitude: 51.4036,
    CacheLongitude: -0.3033,
  },
  {
    CacheID: 2,
    CacheName: "Riverside View",
    CacheDescription:
      "A virtual cache overlooking the River Thames.",
    CacheEventID: 1,
    CacheImageURL: "",
    CacheClue: "Follow the water until the town meets the river.",
    CachePoints: 150,
    CacheLatitude: 51.4079,
    CacheLongitude: -0.3072,
  },
  {
    CacheID: 3,
    CacheName: "Market Square Mystery",
    CacheDescription:
      "Explore the historic centre of Kingston to locate this cache.",
    CacheEventID: 1,
    CacheImageURL: "",
    CacheClue: "Merchants once gathered where this cache now waits.",
    CachePoints: 200,
    CacheLatitude: 51.4095,
    CacheLongitude: -0.3054,
  },
  {
    CacheID: 4,
    CacheName: "Bridge Explorer",
    CacheDescription:
      "A more challenging cache located close to Kingston Bridge.",
    CacheEventID: 1,
    CacheImageURL: "",
    CacheClue: "Find the crossing that connects both sides of the Thames.",
    CachePoints: 250,
    CacheLatitude: 51.4101,
    CacheLongitude: -0.3085,
  },
  {
    CacheID: 5,
    CacheName: "Library Trail",
    CacheDescription:
      "A hidden virtual cache for explorers who enjoy learning.",
    CacheEventID: 1,
    CacheImageURL: "",
    CacheClue: "Stories and knowledge surround your destination.",
    CachePoints: 300,
    CacheLatitude: 51.4018,
    CacheLongitude: -0.302,
  },
];

export const seedFinds = [
  {
    FindID: 1,
    FindPlayerID: 2,
    FindCacheID: 1,
    FindDatetime: "2026-07-17T10:00:00.000Z",
    FindImageURL: "",
  },
  {
    FindID: 2,
    FindPlayerID: 2,
    FindCacheID: 2,
    FindDatetime: "2026-07-17T10:30:00.000Z",
    FindImageURL: "",
  },
  {
    FindID: 3,
    FindPlayerID: 3,
    FindCacheID: 1,
    FindDatetime: "2026-07-17T11:00:00.000Z",
    FindImageURL: "",
  },
];