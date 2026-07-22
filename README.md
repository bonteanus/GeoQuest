# GeoQuest

GeoQuest is a location-based treasure hunt mobile application developed for the CI6330 Mobile Application Development module at Kingston University.

The application allows players to discover virtual caches placed at real-world GPS coordinates. Players can view caches on a map, follow walking directions, unlock caches when they are physically nearby, capture photographic evidence and earn points.

## Developer

**Stefan Bonteanu**

BSc (Hons) Computer Science  
Kingston University  
CI6330 Mobile Application Development

## Gameplay Mode

GeoQuest implements **Global Mode**.

Players can:

- View public caches on an interactive map
- See their current GPS location
- view their distance from each cache
- Open walking directions
- Unlock caches within 50 metres
- View cache clues and point values
- Take photographic evidence
- Log discoveries
- Earn points
- View their discovery history
- Compare scores on a global leaderboard

## Main Features

### Interactive Cache Map

The map displays:

- The player’s current location
- Available caches using orange markers
- Discovered caches using green markers
- Cache names and point values
- Distance from the player
- Cache discovery status
- Controls for centring the map and viewing every cache

### GPS Proximity Unlocking

GeoQuest continuously monitors the player’s foreground location.

A cache can only be logged when:

- The player is within 50 metres of the cache
- The GPS reading has acceptable accuracy
- The cache has not already been discovered

The cache details screen provides live distance, GPS accuracy and unlocking feedback.

### Walking Directions

Players can open walking directions from the cache details screen.

GeoQuest uses:

- Apple Maps on iOS
- Google Maps on Android

The selected cache coordinates are passed directly to the maps application.

### Camera Evidence

After unlocking a cache, the player must take a photograph before confirming the discovery.

The camera is used meaningfully as part of the treasure-hunt gameplay rather than as a decorative feature.

### Points and Leaderboard

Each cache has a points value.

When a cache is discovered:

- A Find record is created
- The cache is added to the player’s history
- Its points are added to the player’s score
- The leaderboard ranking is recalculated
- The cache marker changes to the discovered colour

The leaderboard includes seeded players such as Maya Chen and Jordan Lee to demonstrate competitive ranking.

### Training Cache

The current user can create a training cache near their present GPS position.

This allows the complete discovery process to be tested safely without travelling to one of the seeded cache locations.

### Local Data Persistence

GeoQuest uses AsyncStorage to persist:

- Users
- Players
- Events
- Statuses
- Caches
- Finds
- Training caches
- Current-user information

Discoveries, scores and training caches remain available after the application is restarted.

## Sensors and Platform Features

GeoQuest uses two meaningful mobile sensors and services:

### GPS and Location Services

Used for:

- Displaying the player’s position
- Calculating distance to caches
- Monitoring movement
- Checking GPS accuracy
- Unlocking nearby caches
- Creating training caches

### Camera

Used for:

- Capturing photographic discovery evidence
- Previewing evidence before submission
- Associating a photograph with a Find record

The application also integrates native map links for walking directions.

## Technology

GeoQuest was developed using:

- React Native
- JavaScript
- Expo
- Expo Location
- Expo Image Picker
- React Native Maps
- React Navigation
- AsyncStorage
- React Native Safe Area Context
- Expo Vector Icons

## Project Structure

```text
GeoQuest
├── assets
├── src
│   ├── components
│   ├── constants
│   ├── context
│   ├── data
│   ├── hooks
│   ├── navigation
│   ├── screens
│   ├── services
│   └── utils
├── App.js
├── app.json
├── index.js
├── package.json
└── README.md
```

### Important Files

- `App.js` – application entry component and provider setup
- `src/navigation/AppNavigator.js` – root stack navigation
- `src/navigation/MainTabNavigator.js` – bottom-tab navigation
- `src/context/GeoQuestContext.js` – shared application state
- `src/services/storageService.js` – AsyncStorage operations
- `src/screens/MapScreen.js` – interactive cache map
- `src/screens/CacheDetailsScreen.js` – proximity unlocking and directions
- `src/screens/LogFindScreen.js` – camera evidence and discovery confirmation
- `src/screens/LeaderboardScreen.js` – player rankings
- `src/screens/ProfileScreen.js` – player statistics and training-cache creation
- `src/utils/locationUtils.js` – distance calculations and formatting

## Installation

### Requirements

- Node.js
- npm
- Expo Go on a physical mobile device
- Camera and location permissions

### Setup

Clone the repository:

```bash
git clone https://github.com/bonteanus/GeoQuest.git
```

Enter the project directory:

```bash
cd GeoQuest
```

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npx expo start
```

Scan the displayed QR code using Expo Go.

## Permissions

GeoQuest requests the following permissions:

### Foreground Location

Required for:

- Displaying the player’s position
- Calculating distance
- Unlocking caches
- Creating a training cache

### Camera

Required for:

- Capturing evidence when logging a discovery

Permission-denial messages and retry controls are displayed when access is unavailable.

## Testing the Main Gameplay Flow

1. Start GeoQuest using Expo Go.
2. Allow foreground location access.
3. Open the Profile tab.
4. Create a training cache at the current location.
5. Open the Map tab.
6. Select the training-cache marker.
7. Open the cache details.
8. Confirm that the cache unlocks within 50 metres.
9. Open walking directions.
10. Return to GeoQuest.
11. Continue to the discovery screen.
12. Allow camera permission.
13. Take a photograph.
14. Log the discovery.
15. Confirm that the points increase.
16. Confirm that the cache appears in the discovery history.
17. Confirm that the leaderboard updates.
18. Confirm that the map marker changes to green.
19. Restart the application.
20. Confirm that the discovery remains saved.

## Agile Development

The project was developed iteratively using Git and GitHub Desktop.

The development process included:

- Breaking the application into individual features
- Creating separate feature branches
- Implementing and testing one feature at a time
- Making meaningful commits after working checkpoints
- Merging completed features into `main`
- Retesting the application after each merge

Feature branches were used for areas including:

- Navigation
- Map and location functionality
- Local data persistence
- Training caches
- Cache discovery
- Camera evidence
- Leaderboard functionality
- Walking directions
- Project documentation

This approach reduced the risk of damaging completed functionality and provided a traceable development history.

## API and Data Decision

The coursework supplied a GeoQuest API specification. However, the provided API endpoint was not reliably accessible during development.

The coursework allowed local storage as a valid persistence approach. Therefore, GeoQuest uses seeded entity data and AsyncStorage.

The local data model follows the supplied API entities:

- User
- Event
- Status
- Player
- Cache
- Find

This allowed the application to remain functional while preserving a structure that could later be connected to a REST API.

## Known Limitations

- Data is stored locally and is not synchronised between different devices.
- The provided university API is not currently integrated because it was unavailable during development.
- Photo evidence is stored as a local device URI rather than uploaded to cloud storage.
- GPS accuracy depends on the device, environment and permission settings.
- A physical mobile device provides the best camera and location testing experience.
- Walking directions require an external maps application and an internet connection.

## Future Improvements

Possible future improvements include:

- Connecting to a reliable REST or cloud database
- User registration and authentication
- Cloud image storage
- Private event mode and invite codes
- Event creation and management
- Push notifications
- Achievements and badges
- More advanced route guidance
- Offline map support

## Assessment Status

The application currently demonstrates:

- A functional React Native mobile application
- Global Mode gameplay
- Multiple screens and clear navigation
- GPS and camera sensor integration
- Interactive map functionality
- Proximity-based cache unlocking
- Discovery logging
- Persistent local data
- Points and leaderboards
- Platform-specific walking directions
- User feedback and status indicators
- Git branches and iterative development