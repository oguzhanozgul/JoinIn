import { useCallback } from "react";
import { Box, Group, Loader, Text } from "@mantine/core";

import useStationListQuery from "../../api/queries/useStationListQuery";
import useUserSettingsStore from "../../stores/useUserSettingsStore";
import { SortDirection } from "../../types/SortDirection";
import { Station } from "../../types/Station";
import { sortFieldToAccessor } from "../../utils/sortUtils";
import StationCard from "../StationCard/StationCard";

export interface StationCardListProps {
  searchQuery?: string;
}

const StationCardList = ({ searchQuery }: StationCardListProps) => {
  const activeSortField = useUserSettingsStore(state => state.activeSortField);
  const activeSortDirection = useUserSettingsStore(state => state.activeSortDirection);

  const setCurrentlyPlaying = useUserSettingsStore(state => state.setCurrentlyPlaying);

  const { data: stationListQueryResponse, isError: isQueryError, isFetching: isQueryFetching } = useStationListQuery();

  const handlePlay = useCallback(
    (station: Station) => {
      setCurrentlyPlaying(station);
    },
    [setCurrentlyPlaying],
  );

  if (!stationListQueryResponse) {
    return null;
  }

  if (isQueryFetching) {
    return <Loader color="var(--ji-color-text-subdued)" />;
  }

  if (isQueryError) {
    return (
      <Box p="32px" ta="center">
        <Text c="var(--ji-color-text-subdued)">We are having trouble loading stations, please try again later.</Text>
      </Box>
    );
  }

  // Below filtering/sorting/(and pagination) logic should be moved to the backend.
  const filteredStations = stationListQueryResponse.data.filter(station => {
    if (!searchQuery) return true;
    return station.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const filteredAndSortedStations = filteredStations.sort((a: Station, b: Station) => {
    const valueA = a[sortFieldToAccessor(activeSortField)];
    const valueB = b[sortFieldToAccessor(activeSortField)];

    // Null comes first in ascending order sort and last in descending order sort. Alternative: we can always display nulls at the end.
    if (valueA == null && valueB == null) return 0;
    if (valueA == null) return activeSortDirection === SortDirection.Ascending ? 1 : -1; // Last in ascending
    if (valueB == null) return activeSortDirection === SortDirection.Ascending ? -1 : 1; // First in descending

    if (typeof valueA === "string" && typeof valueB === "string") {
      return activeSortDirection === SortDirection.Ascending
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    if (typeof valueA === "number" && typeof valueB === "number") {
      return activeSortDirection === SortDirection.Ascending ? valueA - valueB : valueB - valueA;
    }

    return 0;
  });

  if (!filteredAndSortedStations.length) {
    return (
      <Box p="32px" ta="center">
        <Text c="var(--ji-color-text-subdued)">No stations found according to your search criteria.</Text>
      </Box>
    );
  }

  return (
    <Group gap="32px" maw="1024px" justify="center">
      {filteredAndSortedStations.map(station => (
        <StationCard key={station.id} station={station} size="playable" isPlayable onClick={handlePlay} />
      ))}
    </Group>
  );
};

export default StationCardList;
