# GeoQuest Manual Testing Report

## Project Information

- **Application:** GeoQuest
- **Developer:** Stefan Bonteanu
- **Module:** CI6330 Mobile Application Development
- **Gameplay mode:** Global Mode
- **Framework:** React Native with Expo
- **Testing method:** Manual functional testing using Expo Go
- **Test platform:** Physical mobile device

## Testing Approach

GeoQuest was tested incrementally after each feature was implemented. Completed feature branches were tested before being merged into `main`.

Testing focused on:

- Application startup
- Screen navigation
- GPS and map behaviour
- Cache proximity unlocking
- Camera evidence
- Discovery persistence
- Points and leaderboard calculations
- Permission and error handling
- External walking directions

## Functional Test Results

| ID | Area | Test steps | Expected result | Status |
|---|---|---|---|---|
| T01 | Application | Start GeoQuest using Expo Go | The application loads without a runtime error | Passed |
| T02 | Navigation | Select every bottom-navigation tab | Home, Map, Leaderboard and Profile screens open correctly | Passed |
| T03 | Stack navigation | Open a cache from the map | The Cache Details screen opens with the selected cache | Passed |
| T04 | Data loading | Restart the application | Seeded users, players, caches and finds load correctly | Passed |
| T05 | Map | Open the Map tab | The interactive map and cache markers appear | Passed |
| T06 | Location | Allow foreground location permission | The player’s current location appears on the map | Passed |
| T07 | Map controls | Press the centre-location button | The map moves to the player’s current position | Passed |
| T08 | Map controls | Press the show-all-caches button | The map adjusts to display the cache locations | Passed |
| T09 | Marker status | View available and discovered caches | Available caches are orange and discovered caches are green | Passed |
| T10 | Cache callout | Select a cache marker | Name, points, distance and discovery status are shown | Passed |
| T11 | Cache details | Open a cache | Description, clue, points and live distance are displayed | Passed |
| T12 | Locked cache | Open a cache more than 50 metres away | The cache remains locked and logging is disabled | Passed |
| T13 | Training cache | Create a training cache from the Profile screen | A new cache is created near the current GPS location | Passed |
| T14 | Proximity | Open the nearby training cache | The cache unlocks at 50 metres or closer | Passed |
| T15 | GPS feedback | View the nearby cache details | Current distance and approximate GPS accuracy are displayed | Passed |
| T16 | Directions | Press Open walking directions | Apple Maps or Google Maps opens using the cache coordinates | Final verification required |
| T17 | Camera | Continue from an unlocked cache and allow camera access | The device camera opens | Passed |
| T18 | Photo evidence | Take a photograph | A preview of the captured photograph appears | Passed |
| T19 | Discovery | Press Log discovery | A new Find record is saved and a success message appears | Passed |
| T20 | Points | Log a new cache discovery | The cache points are added to the player’s total | Passed |
| T21 | History | Open the Profile screen after logging a cache | The new discovery appears in the player’s history | Passed |
| T22 | Marker update | Return to the map after logging a cache | The discovered cache marker changes to green | Passed |
| T23 | Duplicate protection | Reopen an already discovered cache | The cache cannot be logged for points again | Passed |
| T24 | Leaderboard | Open the Leaderboard screen | Players are ordered by their calculated points | Passed |
| T25 | Current player | View the leaderboard | The current player has a visible YOU badge | Passed |
| T26 | Seed players | View the leaderboard | Maya Chen and Jordan Lee appear in the rankings | Passed |
| T27 | Leaderboard refresh | Pull down on the leaderboard | The saved data and rankings refresh | Final verification required |
| T28 | Persistence | Close and reopen GeoQuest after logging a find | Discoveries, points and training caches remain saved | Final verification required |
| T29 | Location denied | Deny location permission and open the map | A clear location-permission message and retry option appear | Final verification required |
| T30 | Camera denied | Deny camera permission when logging a find | A clear camera-permission message appears | Final verification required |
| T31 | Offline data | Disconnect from the internet and restart GeoQuest | Locally stored application data still loads | Final verification required |
| T32 | Final regression | Test every tab after merging all branches into `main` | All completed features continue to work together | Final verification required |

## Sensor Testing

### GPS and Location Services

GPS was tested through:

- Displaying the current user location
- Updating the player’s position
- Calculating distance to caches
- Checking GPS accuracy
- Locking caches outside the required radius
- Unlocking caches within 50 metres
- Creating a training cache near the current position

### Camera

The camera was tested through:

- Requesting camera permission
- Opening the device camera
- Capturing a photograph
- Previewing the photograph
- Replacing the photograph using the retake option
- Saving the local photograph URI with the Find record

## Persistence Testing

AsyncStorage was used to persist:

- Users
- Events
- Statuses
- Players
- Caches
- Finds
- Training caches
- Current-user information

Persistence testing checks that:

- Discoveries remain after restarting the application
- Points are recalculated from saved Find records
- Training caches remain available
- Discovered markers remain green
- Duplicate discoveries remain blocked

## User Interface Testing

The interface was checked for:

- Consistent green, white and orange styling
- Readable cache descriptions and clues
- Clear status indicators
- Loading indicators
- Disabled-button feedback
- Permission-error messages
- Safe-area handling
- Scrollable content
- Bottom-tab conventions
- Current-player leaderboard highlighting

## Requirement Coverage

| Coursework requirement | GeoQuest implementation | Result |
|---|---|---|
| Multiple screens | Home, Map, Cache Details, Log Find, Leaderboard and Profile | Met |
| Clear navigation | Bottom tabs and native stack navigation | Met |
| GPS/location sensor | Map position, distance calculation and proximity unlocking | Met |
| Second meaningful sensor | Camera discovery evidence | Met |
| Persistent data | AsyncStorage | Met |
| Map integration | Cache markers, user location and map controls | Met |
| Navigation support | Walking directions using Apple Maps or Google Maps | Met |
| Cache discovery | 50-metre unlocking and Find records | Met |
| Scoring | Cache points and player totals | Met |
| Leaderboard | Ranked global player list | Met |
| User feedback | Loading, error, permission, locked and unlocked states | Met |
| Agile evidence | Backlog, feature branches and meaningful commits | Met |

## Known Limitations

- The supplied GeoQuest API was not reliably accessible during development.
- Application data is stored locally rather than synchronised between devices.
- Photographs are stored as local device URIs rather than uploaded to cloud storage.
- GPS accuracy can vary depending on the device and environment.
- Walking directions require an external maps application.
- A physical device is required for the most reliable GPS and camera testing.

## Final Verification Checklist

Before submission:

- [ ] Test walking directions
- [ ] Test leaderboard pull-to-refresh
- [ ] Restart the application and verify persistence
- [ ] Test denied location permission
- [ ] Test denied camera permission
- [ ] Test locally stored data without internet
- [ ] Complete one final regression test from `main`
- [ ] Change all successful “Final verification required” statuses to “Passed”
- [ ] Confirm the Expo terminal contains no runtime errors

## Overall Result

The core Global Mode gameplay flow has passed manual testing:

**Map → Cache Details → GPS Unlock → Camera Evidence → Log Discovery → Points → Profile History → Leaderboard**

No blocking application defect has been identified in the completed gameplay flow.