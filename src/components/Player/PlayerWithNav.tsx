import { useCallback } from "react";
import { Group } from "@mantine/core";

import usePlayer from "../../hooks/usePlayer";
import useUserSettingsStore from "../../stores/useUserSettingsStore";
import { ButtonType } from "../../types/ButtonType";
import ControlButton from "../ControlButton/ControlButton";

// See comment on alternative approach below
// import MiniPlayer from "./MiniPlayer";

interface PlayerWithNavProps {
  disabled?: boolean;
  streamUrl?: string;
  showPrev?: boolean;
  showNext?: boolean;
  onPrevious?: () => void;
  onNext?: () => void;
}

const PlayerWithNav = ({ disabled, streamUrl, showPrev, showNext, onPrevious, onNext }: PlayerWithNavProps) => {
  const { isPlaying, togglePlayPause } = usePlayer(streamUrl);

  const previouslyPlayed = useUserSettingsStore(state => state.previouslyPlayed);
  const playPrevious = useUserSettingsStore(state => state.playPrevious);

  const handlePrevious = useCallback(() => {
    playPrevious();
    onPrevious?.();
  }, [onPrevious, playPrevious]);

  const handleNext = useCallback(() => {
    onNext?.();
  }, [onNext]);

  return (
    <Group gap="16px" p="16px" justify="space-between" h="100%" wrap="nowrap">
      {showPrev && (
        <ControlButton
          buttonType={ButtonType.Previous}
          onClick={handlePrevious}
          disabled={disabled || previouslyPlayed.length === 0}
          size="sm"
        />
      )}
      <ControlButton
        buttonType={isPlaying ? ButtonType.Pause : ButtonType.Play}
        onClick={togglePlayPause}
        disabled={disabled}
      />
      {/* Alternative approach is to use the MiniPlayer component, if we want to reuse the customizations made in that component (if any) */}
      {/* <MiniPlayer disabled={disabled} streamUrl={streamUrl} /> */}
      {showNext && <ControlButton buttonType={ButtonType.Next} onClick={handleNext} disabled={disabled} size="sm" />}
    </Group>
  );
};

export default PlayerWithNav;
