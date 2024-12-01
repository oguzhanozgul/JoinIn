import { useState } from "react";
import { Group, Stack } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";

import { SearchBox } from "../SearchBox/SearchBox";
import { SortButton } from "../SortButton/SortButton";
import StationCardList from "../StationCardList/StationCardList";

const StationSelector = () => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery] = useDebouncedValue(searchQuery, 400);
  return (
    <Stack gap="32px" align="center">
      <Group align="center">
        <SearchBox onSearch={setSearchQuery} />
        <SortButton />
      </Group>
      <StationCardList searchQuery={debouncedSearchQuery} />
    </Stack>
  );
};

export default StationSelector;
