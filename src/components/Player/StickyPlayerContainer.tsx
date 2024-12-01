import { useMemo } from "react";
import { Group } from "@mantine/core";
import classNames from "classnames";

import useUserSettingsStore from "../../stores/useUserSettingsStore.ts";
import StationCard from "../StationCard/StationCard.tsx";

import PlayerWithNav from "./PlayerWithNav.tsx";

import classes from "./StickyPlayer.module.css";

export interface StickyPlayerContainerProps {
  invisible?: boolean;
  inactive?: boolean;
}

const StickyPlayerContainer = ({ invisible, inactive }: StickyPlayerContainerProps) => {
  const currentlyPlaying = useUserSettingsStore(state => state.currentlyPlaying);
  const previouslyPlayed = useUserSettingsStore(state => state.previouslyPlayed);

  const isVisible = useMemo(() => {
    return !invisible && (currentlyPlaying || previouslyPlayed.length > 0);
  }, [invisible, currentlyPlaying, previouslyPlayed.length]);

  return (
    <Group
      gap="32px"
      justify="space-between"
      wrap="nowrap"
      className={classNames(classes.root, { [classes.visible]: isVisible })}
    >
      {currentlyPlaying ? <StationCard size="details" station={currentlyPlaying} /> : <div />}
      <PlayerWithNav disabled={inactive} streamUrl={currentlyPlaying?.streamUrl} showPrev />
    </Group>
  );
};

export default StickyPlayerContainer;
