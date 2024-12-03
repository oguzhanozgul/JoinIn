# JoinIn - Mini Online Radio Player

## Overview

This single-page application is an online radio player built using React. It utilizes the Mini TuneIn station API to display a list of stations, provide station details, and enable playback through a custom audio player. The focus of this project is on functionality, maintainable architecture, and code quality.

### Hosted version

The application is live and accessible at [JoinIn Radio](https://joininradio.netlify.app/).

## User Interface

### Homepage

- Displays a grid of available radio stations fetched via the Mini TuneIn API.
- Includes:
  - A search bar for filtering stations by name.
  - A sorting dropdown to order stations by name, popularity, or reliability in ascending/descending order.
- Each station card showcases the station's logo and name.
- Hovering over a station logo reveals a play button. Clicking the logo starts streaming the station via the sticky player.

### Sticky player

- Automatically appears at the bottom of the window when a station is selected for playback.
- Displays station details (logo, name, description) on the left and playback controls on the right.
- Playback controls include:
  - Play/Pause Button: Toggles playback of the selected stream.
  - Previous Station Button: Streams the last-played station from the session history.

## Architecture

### Key Technologies

- **Frontend Framework:** React with TypeScript, built using Vite for fast development.

- **Styling:** Mantine UI for layout and components, combined with CSS Modules for customization.

- **State Management:**
  - Zustand for global state.
  - React Query for asynchronous data handling and caching.

- **Networking:** Axios for API requests.

- **Routing:** React Router, included for potential future expansion.

### Components

Components are designed with a focus on modularity, reusability, and single responsibility, ensuring maintainability and scalability.

#### AudioPlayer

A custom audio player component for playback management using the standard `HTMLAudioElement` API for playback.

- **Core Features:**

  - Play/Pause functionality and a toggle method.
  - Stream loading via URL
  - Singleton architecture ensures a single player instance throughout the session.
  - Observer pattern for state updates, enabling external components to subscribe/unsubscribe to state changes.
  - Error handling with retry logic (configurable number of attempts, configurable intervals) and customizable error callback.

- **Technical Note:** Written in plain JavaScript for cross-framework compatibility, supplemented with TypeScript type definitions for maintainability.
- See **Example Technical Debt** section regarding this component.

#### SearchBox

- Basic text input customized by Mantine style API.
- No debouncing is implemented to make it more generic (it's debounced in the parent component).

#### SortButton

- Dropdown button to sort the stations by name, popularity or reliability in ascending or descending order.

#### StationLogo

- Component that displays the logo of a station in various sizes with a fallback image.

#### StationCard

- Displays station logo, name, and description.
- Supports two layouts:
  - **Playable**: Larger logo with hover effects and a play button.
  - **Detailed**: Compact view with a focus on text content.

#### StationCardList

- Fetches the list of stations and displays a grid of `StationCard` components.
- Displays a loading spinner while fetching, or an error message if it fails.
- Handles searching and sorting of the stations.
  - The search is debounced.
  - Search filtering and sorting is done over the fetched list of stations at the frontend rather than backend (because we don't have one implemented as such). Should move to the backend once backend is capable.

#### StationSelector

- Parent component integrating the search bar, sorting dropdown, and station grid.

#### ControlButton

- A reusable button component with customizable icons, active/disabled states, and size options.
- See Potential Improvements for more details.

#### MiniPlayer

- A single button (play/pause) player that displays a red error icon on error.
- It's a very basic implementation using the `usePlayer` hook.

#### PlayerWithNav

- A player with a play/pause button and a previous station button.
- Currently uses the MiniPlayer component for the play/pause button. Alternative is to use the `usePlayer` hook directly, but then we'll need to re-implement the error icon.
- It has the ability to go back and play the previous station in the previously played stations list using the Previous Station button (up to 5 previous stations, no duplicates).

#### StickyPlayerContainer

- A container for the `PlayerWithNav` component that sticks to the bottom of the window when the player is visible.
- Also displays the station logo, name and description on the left side of the player.

### Custom Hooks

#### usePlayer

- Connects UI components to the player state and control functions.
- Simplifies access to playback controls and state updates.
- Manages subscriptions to playback events for efficient reactivity.
- Abstracts away the connection to the `AudioPlayer` component.

#### useStationListQuery

- Handles fetching and caching station data using React Query.
- Implements error handling with exponential backoff retries.

#### useUserSettingsStore

- Stores global application settings, including sorting preferences and playback history.
- Currently there is one store with all states. In a larger application, it would be better to split the store into multiple stores for better maintainability.

### Providers

- A top level component that only acts as the wrapper for the various providers in the application. Used to keep the `App` component clean.

### Client configurations

Client configurations for axios and React Query can be found in the `src/client` folder in `apiClient.ts` and `queryClient.ts` respectively.

### Utility functions

- There are 2 utility functions to translate between enums, text labels and accessors for the sorting functionality. These are stored in the `src/utils` folder.

### Constants

- Example constants such as maximum number of stations in the previously played list and logo border radius coefficient are stored in the `src/constants` folder.

### Environment variables

- The environment variables are stored in the `.env` file at the root of the project.
- There is only one environment variable, `VITE_API_URL`, which is the base URL for the API.
- There is only one .env file for now. Normally we separate development and production environment variables into separate .env files.

### State Management

#### Component level state

Managed within components for isolated logic.

#### Global state

- Zustand simplifies state management and integrates with Redux DevTools for debugging.
- Some functions are provided but not used (i.e. the reset() function) provided as examples.

#### Async state

- Async state (we only have one async state in this application which is the station list from the API) is managed using React Query, which provides a powerful and flexible way to fetch, cache, and update data in React applications. React Query also provides a way to manage loading, error, and data states in a clean and efficient way.
- Via the `useStationListQuery` hook, we can fetch the station list from the API and handle loading, error, and data states in a clean and efficient way.
- The same hook can be used in multiple components, and the data is cached and shared between the components. (we don't have this use case in this application).

## Key Decisions and Trade-offs

### User interface

- In such an application with not many components it may be an overkill to use a style library like Mantine UI. But it was used to speed up the development and to make it easier to extend the application in the future.
- Decision to use Mantine UI, especially for layout components speeds up the development.
- But we don't want to use a style library mixed with standard html elements, so it brings in the overhead of styling (and learning how to style) other provided components like `Menu`, `Button`, etc.
- In the long run, given that an application UI and UX should be consistent throughout the application, using a style library will speed up things significantly, making it easier to maintain and update the application.

### State Management

- Zustand was chosen for global state management because it's simple and efficient, and it's compatible with Redux dev tools. It doesn't have the same boilerplate overhead as Redux.
- The trade-off is that it's not as popular as Redux, so it may be harder to find developers who are familiar with it. Nevertheless, it's easy to learn and use.
- React Query was chosen for async state management because it provides a powerful and flexible way to fetch, cache, and update data in React applications. It's also easy to implement and to make sense of. While in this application we only have one API call, it's still a valuable tool with it's failure management and caching strategies.

## Potential Enhancements

Given additional time and resources, the following features could be implemented to improve functionality:

1. User Interaction Features:

    - Add persistence to some elements of the state, such as the previously played stations list, currently playing station and play state, search query, and sort settings.
    - Add a volume control. It could use the same usePlayer hook but only for the volume control, without the play/pause functionality, thus making it more modular.
    - Add a *add to/remove from favorites* functionality.
    - Add *play next* functionality.
    - Search persistence with search history.
    - Search in station description and station tags

1. UI/UX enhancements:

    - Use the `ActionIcon` component for the `ControlButton` for improved accessibility and consistent design.
    - Station tags in the `StationCard` component.
    - Station suggestion when the selected station is not available.
    - Offline logo fallback image as opposed to the current online image.

1. Audio enhancements:

    - Audio level normalization.
    - Expanded event handling for `HTMLAudioElement` events to provide more feedback to the user.

1. Backend integration:

    - Backend search filtering, sorting and pagination.

1. Testing:

    - Add unit tests for the utility functions, custom hooks, components, and integration tests.
  
## Example Technical Debt

- `onError` callback of the `AudioPlayer` is implemented in the beginning, before the decision of making `AudioPlayer` a singleton. Now that many components have the ability to using the same audio player, the `onError` callback should be implemented as a `Set` of callbacks, which are called one by one in the order they are defined, much like the subscription system.

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/oguzhanozgul/JoinIn.git
cd <repository-folder>
```

2. Install dependencies

```bash
npm install
```

3. Start the application

```bash
npm run dev
```

4. Access the app at <http://localhost:3000>.
