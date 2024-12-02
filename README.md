# JoinIn - Mini Online Radio Player

## Overview

This single-page application is an online radio player built using React. It utilizes the Mini TuneIn station API to display a list of stations, provide station details, and enable playback through a custom audio player. The focus of this project is on functionality, maintainable architecture, and code quality.

### Hosted version

The application is already being hosted at <https://joininradio.netlify.app/>.

## User Interface

### Homepage

- Displays a list of available radio stations fetched from the provided API.
- Displays a search box for filtering stations by name.
- Displays a sorting dropdown for sorting stations by name, popularity and reliability in ascending or descending order.
- The logos and the names of the stations are shown in a grid layout.
- Upon hovering over a station logo, a play button appears. Upon clicking a station logo, the station starts streaming in the sticky player.

### Sticky player

- Clicking on a station logo brings the the sticky player from the bottom of the window, if it is not already visible.
- In the sticky player, the station logo, name, and description are shown on the left, and playback controls are displayed on the right.
- There are currently two playback controls:
  - Play/Pause button: Toggles between playing and pausing the station stream.
  - Previous station button: Starts streaming the previous stations in the previously played stations list.

## Architecture

- The application is written in TypeScript using React. It's build using vite.

- It uses Mantine UI for basic and layout components. It uses css modules for styling, in addition to the Mantine style API.

- The global state is managed using Zustand and async state is managed using React Query.

- Remote data is fetched using axios.

- Front end routing, although not very useful at this point, is implemented using React Router.

### Components

Extendability, reusability and maintainability are the main focus of the components. The components are designed to be as modular as possible, with each component having a single responsibility.

**AudioPlayer**

A custom audio player component that manages stream loading, playing and pausing. This component uses the standard `HTMLAudioElement` API for playback.

The component features the following:

- Play/Pause functionality, including a toggle function.
  - Uses the standard methods + toggle function.
- Load stream from a URL.
  - Uses the standard methods.
- Single instance of the player.
  - The player is implemented as a singleton, meaning only one instance of the player is present during the session/application lifetime. Since it's the same/single instance, we are able to use it in different UI players without breaking the playback.
- Subscription system for outside components to listen to player state changes.
  - Outside components can subscribe to player state changes. This allows components to act as observers to the player state, which is currently the play state and stream url.
  - Components can unsubscribe from the player state changes when they are unmounted.
  - When a publish is done, the subscribed components are notified of the state one by one, in the order they subscribed.
  - The same component can subscribe multiple times using different callback functions, but the same callback function can only subscribe once.
- Automatic retry before fail functionality.
  - The player will automatically retry loading the stream if it fails to load, and retry playing the streams if it fails to play.
  - The player will retry 3 times with an interval of 2 seconds before failing. These values can be changed per function.
- Error handling and onError callbacks.
  - The player will throw an error if it fails to load the stream or play the stream after 3 retries.
  - On the above errors and on any other errors, the player will call the onError callback function if it is provided. See **Example Technical Debt** section on an improvement to this.
- The `AudioPlayer` is written in plain JavaScript, without any TypeScript. This is because we want it to be able to be used in different projects regardless of front end library and super-sets used such as TypeScript. Nevertheless, to improve the code quality and maintainability, a type definition file is also supplied.

**SearchBox**

- Pretty basic text input customized by Mantine style API.
- No debouncing is implemented in this component to make it more generic (it's debounced in the parent component).

**SortButton**

- Simple dropdown button to sort the stations by name, popularity or reliability in ascending or descending order.

**StationLogo**

- A simple component that displays the logo of a station in various given sizes. Shows a fallback image if the logo is not available.

**StationCard**

- A card component that displays the logo, name and description of a station.
- Can display two sizes:
  - `playable` size, with a big logo and the station name, which displays a play button on hover
  - `details` size, with a small logo and the station name and description, without any hover effects.

**StationCardList**

- A component to fetch the list of stations and display a grid of `StationCard` components. Since there is only one component that needs the station list, we can fetch the list in this component and pass it down to the `StationCard` components. Furthermore, using the builtin caching strategies of React Query helps us to use only one instance of the list in the whole application.
- It displays a loading spinner while fetching, and an error message if the fetch fails. Retry strategy is implemented in the query hook explained below.
- It also handles searching and sorting of the stations.
  - The search is debounced to avoid unnecessary API calls.
  - Search filtering is done over the fetched list of stations at the frontend rather than backend (because we don't have one implemented as such).
  - The sorting is also done over the fetched list of stations, at the frontend rather than backend (because we don't have one implemented as such).
  - Once we have the fully implemented backend, we should move the searching, sorting and possible pagination to the backend.
  - Considering that we are trying to sort by fields which can contain null values, a basic strategy is implemented to handle the null values. This can be improved by adding a more complex strategy to handle the null values. (example of null values: `popularity` for station id `s21606`)

**StationSelector**

- Parent component which lays out the `SearchBox`, `SortButton` and `StationCardList` components.

**ControlButton**

- A simple button component that displays a simple icon from a given set of icons.
- Can display two sizes.
- Can be in active or disabled state.
- See Potential Improvements for more details.

**MiniPlayer**

- A single button (play/pause) player that displays a red error icon on error.
- It's a very basic implementation using the `usePlayer` hook.

**PlayerWithNav**

- A player with a play/pause button and a previous station button.
- Currently uses the MiniPlayer component for the play/pause button. Alternative is to use the `usePlayer` hook directly, but then we'll need to re-implement the error icon.
- It has the ability to go back and play the previous station in the previously played stations list using the Previous Station button (up to 5 previous stations, no duplicates).

**StickyPlayerContainer**

- A container for the `PlayerWithNav` component that sticks to the bottom of the window when the player is visible.
- Also displays the station logo, name and description on the left side of the player.

### Hooks

**usePlayer**

- A custom hook that provides the player state and control functions to the components.
- Subscribes tot he player state changes and updates the components that are subscribed to the player state changes and errors.
- Abstracts away the connection to the `AudioPlayer` component and simplifies the usage of the `AudioPayer` in different components.

**useStationListQuery**

- A custom hook that fetches the list of stations from the API.
- Has very basic error handling just as an example.
- Retries on error with exponential backoff strategy.

**useUserSettingsStore**

- This is the global state store to keep state values such as current sort direction, sort field, currently playing stations, previously played stations, etc.
- Since the application is small, I used one store for everything, but in a larger application, it would be better to split the store into multiple stores for better maintainability.

**Providers**

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

### Assets

- There is only one custom asset, the null_icon.svg, which is used a placeholder. It's there to because it was quick to implement, but I agree this is not proper.

### State Management

**Component level state**

- Component level simple state is managed locally in the components.

**Global state**

- Global state is managed using Zustand, which provides a simple and efficient way to manage state in React applications.
- It's also compatible with Redux dev tools.
- Some functions are provided but not used, such as the reset() function, as an example of resetting the state to the initial state.

**Async state**

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

## Potential Improvements

Given more time, I would:

- Add unit tests for the utility functions, custom hooks, components, and integration tests.
- Add persistence to some elements of the state, such as the previously played stations list, currently playing station and play state, search query, and sort settings.
- Use the proper `ActionIcon` component for the `ControlButton`, taking it's customization overhead. This would be much better in terms of accessibility standards and possibly consistency in the application UI/UX.
- I would definitely add a volume control. It could use the same usePlayer hook but only for the volume control, without the play/pause functionality, thus making it more modular.
- I would add a *add to/remove from favorites* functionality.
- Add *play next* functionality. Such that, when the user has a list of previously played stations and they go back to play one of them using the play previous button, then the play next button would play the last station that was played before the user went back to play the previous station.
- Previously search for keywords list. This would be a list of keywords that the user has searched for in the past.
- Also search in station description and station tags
- Display station tags in the `StationCard` component.
- A station suggestion when the selected station is not available.
- Audio level normalization.
- Making use of more events fired by the `HTMLAudioElement` API and using them to provide more feedback to the user.
- Backend search filtering, sorting and pagination.
- The logo fallback image is fetched online, which is not a good practice. It should be stored locally which will enable it to be shown even when the client is offline.

## Example Technical Debt

- `onError` callback of the `AudioPlayer` is implemented in the beginning, before the decision of making `AudioPlayer` a singleton. Now that many components have the ability to using the same audio player, the `onError` callback should be implemented as a `Set` of callbacks, which are called one by one in the order they are defined, much like the subscription system.

## Setup Instructions

1. Clone the repository:

```bash
git clone https://github.com/oguzhanozgul/JoinIn.git
cd <repository-folder>
```

1. Install dependencies

```bash
npm install
```

1. Start the application

```bash
npm run dev
```

4. Access the app at <http://localhost:3000>.

## Hosted version

The application is already being hosted at <https://joininradio.netlify.app/> for easy access to the app's functionality.
