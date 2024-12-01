import usePlayer from "../../hooks/usePlayer";
import { ButtonType } from "../../types/ButtonType";
import ControlButton from "../ControlButton/ControlButton";

interface MiniPlayerProps {
  disabled?: boolean;
  streamUrl?: string;
}

const MiniPlayer = ({ disabled, streamUrl }: MiniPlayerProps) => {
  const { isPlaying, togglePlayPause } = usePlayer(streamUrl);

  return (
    <ControlButton
      buttonType={isPlaying ? ButtonType.Pause : ButtonType.Play}
      onClick={togglePlayPause}
      disabled={disabled}
    />
  );
};

export default MiniPlayer;
