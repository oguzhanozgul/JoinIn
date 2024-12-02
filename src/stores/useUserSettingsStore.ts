import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { MAX_STATIONS_IN_PREVIOUSLY_PLAYED_LIST } from "../constants/playerConstants";
import { SortDirection } from "../types/SortDirection";
import { SortField } from "../types/SortField";
import { Station } from "../types/Station";

export interface UserSettings {
  activeSortField: SortField;
  activeSortDirection: SortDirection;
  currentlyPlaying?: Station;
  previouslyPlayed: Station[];
  paused: boolean;
}

const initialUserSettings: UserSettings = {
  activeSortField: SortField.Name,
  activeSortDirection: SortDirection.Ascending,
  currentlyPlaying: undefined,
  previouslyPlayed: [],
  paused: false,
};

export interface UserSettingsActions {
  reset: () => void;
  setSortField: (sortField: SortField) => void;
  setSortDirection: (sortDirection: SortDirection) => void;
  toggleSortDirection: () => void;
  setCurrentlyPlaying: (station?: Station) => void;
  playPrevious: () => void;
  setPaused: (paused: boolean) => void;
  togglePaused: () => void;
}

const useUserSettingsStore = create<UserSettings & UserSettingsActions>()(
  devtools(
    (set, get) => ({
      ...initialUserSettings,
      reset: () => {
        set(() => ({ ...initialUserSettings }));
      },
      setSortField: sortField => {
        set(() => ({ activeSortField: sortField }));
      },
      setSortDirection: sortDirection => {
        set(() => ({ activeSortDirection: sortDirection }));
      },
      toggleSortDirection: () => {
        set(state => ({
          activeSortDirection:
            state.activeSortDirection === SortDirection.Ascending ? SortDirection.Descending : SortDirection.Ascending,
        }));
      },
      setCurrentlyPlaying: station => {
        const { currentlyPlaying } = get();
        // Move the currently playing station to the previously played list (or update it if it's already there by moving to the end)
        if (currentlyPlaying && currentlyPlaying.id !== station?.id) {
          set(state => ({
            previouslyPlayed: [...state.previouslyPlayed.filter(st => st.id !== currentlyPlaying.id), currentlyPlaying],
          }));
        }
        // Limit the length of the list
        if (get().previouslyPlayed.length > MAX_STATIONS_IN_PREVIOUSLY_PLAYED_LIST) {
          set(state => ({ previouslyPlayed: state.previouslyPlayed.slice(1) }));
        }

        set(() => ({
          currentlyPlaying: station,
          paused: false,
        }));
      },
      playPrevious: () => {
        const { previouslyPlayed } = get();
        if (previouslyPlayed.length === 0) {
          return;
        }
        const lastPlayed = previouslyPlayed.pop();
        set(() => ({
          currentlyPlaying: lastPlayed,
          paused: false,
        }));
      },
      setPaused: paused => {
        set(() => ({ paused }));
      },
      togglePaused: () => {
        set(state => ({ paused: !state.paused }));
      },
    }),
    { name: "userSettingsStore" },
  ),
);

export default useUserSettingsStore;
