# GeoQuest Agile Backlog

## Project Information

- **Project:** GeoQuest
- **Module:** CI6330 Mobile Application Development
- **Developer:** Stefan Bonteanu
- **Gameplay mode:** Global Mode
- **Development approach:** Iterative individual development
- **Priority method:** MoSCoW
- **Version control:** Git and GitHub Desktop

## Development Approach

GeoQuest was developed incrementally. The application was divided into smaller features that could be implemented, tested and committed separately.

The general workflow was:

1. Select the next requirement from the backlog.
2. Create a focused feature branch.
3. Implement the feature.
4. Test it using Expo Go.
5. Fix any runtime or integration problems.
6. Commit and push the working checkpoint.
7. Merge the completed feature into `main`.
8. Retest the application before beginning another feature.

This approach provided a traceable Git history and reduced the risk of unfinished code affecting already completed features.

## Product Backlog

| ID | User story or task | Priority | Status | Evidence |
|---|---|---:|---|---|
| GQ-01 | As a developer, I want a structured Expo project so the application is maintainable. | Must | Completed | Project folders and Expo configuration |
| GQ-02 | As a player, I want clear bottom-tab navigation so I can access the main features. | Must | Completed | `feature/navigation` |
| GQ-03 | As a player, I want to view a dashboard containing my progress and available caches. | Should | Completed | Home screen |
| GQ-04 | As a developer, I want User, Event, Status, Player, Cache and Find entities that follow the supplied API specification. | Must | Completed | Seed-data files |
| GQ-05 | As a player, I want my data saved locally so discoveries remain after restarting the application. | Must | Completed | AsyncStorage service |
| GQ-06 | As a player, I want to view caches and my current location on a map. | Must | Completed | Map screen and Expo Location |
| GQ-07 | As a player, I want cache markers to show whether caches are available or discovered. | Must | Completed | Orange and green map markers |
| GQ-08 | As a player, I want to see a cache’s description, clue, points and distance. | Must | Completed | Cache details screen |
| GQ-09 | As a player, I want a cache to unlock only when I am physically nearby. | Must | Completed | 50-metre proximity calculation |
| GQ-10 | As a player, I want GPS accuracy feedback so I understand why a cache may remain locked. | Should | Completed | Accuracy status and retry controls |
| GQ-11 | As a player, I want to capture photographic evidence when discovering a cache. | Must | Completed | `feature/cache-discovery` |
| GQ-12 | As a player, I want a discovery saved as a Find record so it appears in my history. | Must | Completed | `recordFind` and AsyncStorage |
| GQ-13 | As a player, I want to earn the points assigned to each discovered cache. | Must | Completed | Points calculation |
| GQ-14 | As a player, I want duplicate discoveries prevented so the same points cannot be earned twice. | Must | Completed | Existing-find checks |
| GQ-15 | As a player, I want a leaderboard so I can compare my score with other players. | Must | Completed | `feature/leaderboard` |
| GQ-16 | As a player, I want my own leaderboard entry highlighted. | Should | Completed | Current-player badge |
| GQ-17 | As a player, I want walking directions so I can navigate to a selected cache. | Must | Completed | `feature/cache-directions` |
| GQ-18 | As a developer, I want a training cache near my location so the complete flow can be tested. | Should | Completed | Training-cache functionality |
| GQ-19 | As a player, I want clear permission and error messages when GPS or camera access is unavailable. | Must | Completed | Permission handling and retry controls |
| GQ-20 | As a developer, I want project documentation so another person can install and understand the application. | Must | Completed | `README.md` |
| GQ-21 | As a developer, I want a recorded backlog to demonstrate the agile development process. | Must | Completed | `PROJECT_BACKLOG.md` |
| GQ-22 | As a developer, I want a documented test plan so the application can be verified before submission. | Must | In progress | `TESTING.md` |
| GQ-23 | As a student, I need a reflective report explaining my technical decisions and learning. | Must | To do | Individual report |
| GQ-24 | As a student, I need a demonstration video showing my application and technical understanding. | Must | To do | Individual video |
| GQ-25 | As a student, I need to share the private repository with the module team. | Must | To do | GitHub collaborator access |
| GQ-26 | As a student, I need to submit every required deliverable through Canvas. | Must | To do | Final submission |

## MoSCoW Priorities

### Must Have

- React Native application written in JavaScript
- Multiple screens and clear navigation
- Global Mode gameplay
- GPS location services
- Camera integration
- Cache map
- Proximity-based unlocking
- Discovery logging
- Persistent data
- Points
- Leaderboard
- Walking navigation
- Error and permission feedback
- GitHub repository
- Report and demonstration video

### Should Have

- Training cache
- GPS accuracy feedback
- Current-player leaderboard highlighting
- Discovery history
- Clear cache-status colours
- Pull-to-refresh leaderboard

### Could Have

- Achievements and badges
- Push notifications
- Additional cache categories
- Advanced route guidance
- Profile editing
- Dark mode

### Will Not Have in This Version

- Private Event Mode
- Cloud authentication
- Cloud image upload
- Live multi-device synchronisation
- Offline map downloads

These features were excluded to keep the project achievable while prioritising the mandatory requirements.

## Development Iterations

### Iteration 1: Project Foundation

Completed:

- Created the Expo project
- Added the folder structure
- Configured GitHub Desktop
- Created the private repository
- Added stack and bottom-tab navigation
- Created the main screens

### Iteration 2: Data and Persistence

Completed:

- Modelled the supplied GeoQuest entities
- Added realistic seed data
- Added users including Maya Chen and Jordan Lee
- Added players, caches and existing finds
- Integrated AsyncStorage
- Created the shared GeoQuest context
- Added data refreshing and calculated values

### Iteration 3: Map and Location

Completed:

- Added React Native Maps
- Requested foreground location permission
- Displayed the player’s position
- Displayed cache markers
- Calculated cache distances
- Added map centring and fitting controls
- Added available and discovered marker states

### Iteration 4: Discovery Gameplay

Completed:

- Added cache details
- Displayed descriptions, clues and points
- Added continuous GPS tracking
- Added the 50-metre unlock requirement
- Added GPS accuracy checking
- Prevented duplicate discoveries
- Added training-cache creation

### Iteration 5: Camera and Scoring

Completed:

- Added camera permission handling
- Added photo capture and preview
- Saved photo evidence with Find records
- Added discovery confirmation
- Updated player points
- Updated profile history
- Updated map-marker states

### Iteration 6: Leaderboard and Navigation

Completed:

- Created the global leaderboard
- Ranked players by points
- Added discovery-count tie-breaking
- Highlighted the current player
- Added pull-to-refresh
- Added Apple Maps and Google Maps walking directions

### Iteration 7: Documentation and Submission

In progress:

- Complete README
- Complete backlog
- Perform full system testing
- Complete reflection report
- Record demonstration video
- Verify repository access
- Submit through Canvas

## Technical Adaptation

The provided GeoQuest API was not reliably accessible during development.

Rather than leaving the application without persistence, the project was adapted to use AsyncStorage, which was permitted by the coursework requirements.

The locally stored objects retained the same User, Event, Status, Player, Cache and Find structure described in the API specification. This reduced the work required to connect a reliable API in a future version.

## Definition of Done

A feature was considered complete when:

- The code saved without syntax errors
- Expo bundled successfully
- The feature appeared correctly on the mobile device
- Its main success path worked
- Relevant error or permission states were handled
- Existing navigation still worked
- Existing saved data remained available
- The change was committed with a meaningful message
- The feature branch was pushed and merged into `main`

## Project Retrospective

### What Worked Well

- Dividing the project into focused features made development manageable.
- Feature branches protected completed work.
- The training cache made real GPS testing practical.
- Shared context avoided repeatedly passing data through screen properties.
- AsyncStorage provided a reliable alternative to the unavailable API.
- Testing after every feature helped identify integration problems early.

### Challenges

- The supplied API endpoint was not reliably accessible.
- Initial theme values caused undefined-property errors.
- The context provider was initially positioned incorrectly.
- GPS testing depended on permission and device accuracy.
- Camera functionality required testing on a physical device.
- Some VS Code warnings originated from dependencies rather than application code.

### Improvements for Future Development

With more development time, the project could include:

- A reliable cloud backend
- Secure authentication
- Cloud photograph storage
- Private events and invitation codes
- Automated component and integration tests
- Notifications and achievements
- More extensive accessibility testing