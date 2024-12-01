import { useCallback, useMemo } from "react";
import { Button, Menu } from "@mantine/core";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";

import NullIcon from "../../assets/null_icon.svg?react";
import useUserSettingsStore from "../../stores/useUserSettingsStore";
import { SortDirection } from "../../types/SortDirection";
import { SortField } from "../../types/SortField";
import { sortFieldToLabel } from "../../utils/sortUtils";

export const SortButton = () => {
  const activeSortField = useUserSettingsStore(state => state.activeSortField);
  const activeSortDirection = useUserSettingsStore(state => state.activeSortDirection);
  const setSortField = useUserSettingsStore(state => state.setSortField);
  const toggleSortDirection = useUserSettingsStore(state => state.toggleSortDirection);

  const handleSortChange = useCallback(
    (sortField: SortField) => {
      if (sortField === activeSortField) {
        toggleSortDirection();
      } else {
        setSortField(sortField);
      }
    },
    [activeSortField, setSortField, toggleSortDirection],
  );

  const buttonTitle = useMemo(() => {
    return sortFieldToLabel(activeSortField);
  }, [activeSortField]);

  return (
    <Menu>
      <Menu.Target>
        <Button
          variant="default"
          leftSection={activeSortDirection === SortDirection.Ascending ? <IconSortAscending /> : <IconSortDescending />}
          w="160px"
        >
          {buttonTitle}
        </Button>
      </Menu.Target>
      <Menu.Dropdown>
        {Object.values(SortField).map(sortField => (
          <Menu.Item
            key={sortField}
            onClick={() => handleSortChange(sortField)}
            leftSection={
              activeSortField === sortField ? (
                activeSortDirection === SortDirection.Ascending ? (
                  <IconSortAscending />
                ) : (
                  <IconSortDescending />
                )
              ) : (
                <NullIcon />
              )
            }
          >
            {sortFieldToLabel(sortField)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>{" "}
    </Menu>
  );
};
