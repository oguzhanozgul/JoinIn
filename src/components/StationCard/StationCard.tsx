import { useCallback } from "react";
import { Box, Group, Stack, Text } from "@mantine/core";
import classNames from "classnames";

import useUserSettingsStore from "../../stores/useUserSettingsStore";
import { ButtonType } from "../../types/ButtonType";
import { Station } from "../../types/Station";
import ControlButton from "../ControlButton/ControlButton";
import StationLogo from "../StationLogo/StationLogo";

import classes from "./StationCard.module.css";

interface StationCardProps {
  isPlayable?: boolean;
  isPaused?: boolean;
  station: Station;
  size: "playable" | "details";
  onClick?: (station: Station) => void;
}

const StationCard = ({ isPlayable, station, size, onClick }: StationCardProps) => {
  const currentlyPlaying = useUserSettingsStore(state => state.currentlyPlaying);

  const onCardClick = useCallback(() => {
    onClick?.(station);
  }, [onClick, station]);

  if (size === "playable") {
    return (
      <Stack gap="8px">
        <Box
          className={classNames(classes.root, {
            [classes.playable]: isPlayable,
          })}
          onClick={onCardClick}
        >
          <StationLogo name={station.name} imgUrl={station.imgUrl} />
          {isPlayable && (
            <ControlButton buttonType={ButtonType.Play} className={classNames(classes.playButton)} active />
          )}
        </Box>
        <Text
          className={classes.stationName}
          size="sm"
          c={station.id === currentlyPlaying?.id ? "var(--ji-color-text-default)" : "var(--ji-color-text-subdued)"}
          lineClamp={1}
          ta="center"
        >
          {station.name}
        </Text>
      </Stack>
    );
  }

  if (size === "details") {
    return (
      <Group gap="16px" p="16px" onClick={onCardClick} wrap="nowrap">
        <StationLogo name={station.name} imgUrl={station.imgUrl} size="sm" />
        <Stack gap="8px">
          <Text size="sm" c="var(--ji-color-text-default)" lineClamp={1}>
            {station.name}
          </Text>
          <Text size="xs" c="var(--ji-color-text-subdued)" lineClamp={3}>
            {station.description || "No description available"}
          </Text>
        </Stack>
      </Group>
    );
  }
};

export default StationCard;
