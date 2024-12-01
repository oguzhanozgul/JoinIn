import { useCallback, useEffect, useState } from "react";

import audioPlayerInstance from "../components/AudioPlayer/AudioPlayer";
import { AudioPlayerState } from "../components/AudioPlayer/AudioPlayerState";
import useUserSettingsStore from "../stores/useUserSettingsStore";

const usePlayer = (streamUrl?: string) => {
  const [isPlaying, setIsPlaying] = useState(audioPlayerInstance.isPlaying);
  const setPaused = useUserSettingsStore(state => state.setPaused);

  // Handle errors
  useEffect(() => {
    const logError = (error: Error) => {
      console.error(error.message);
    };

    audioPlayerInstance.onError(logError);

    return () => {
      audioPlayerInstance.onError(null);
    };
  }, []);

  // Subscribe to playing state changes and sync with the global state
  useEffect(() => {
    const handlePlayingChange = (instanceState: AudioPlayerState) => {
      setIsPlaying(instanceState.isPlaying);
      setPaused(!instanceState.isPlaying);
    };

    audioPlayerInstance.addListener(handlePlayingChange);

    return () => {
      audioPlayerInstance.removeListener(handlePlayingChange);
    };
  }, [setPaused]);

  // Set the source and start playing
  useEffect(() => {
    if (!streamUrl) return;

    const initializeStream = async () => {
      await audioPlayerInstance.setSource(streamUrl);
      await audioPlayerInstance.play(streamUrl);
    };

    initializeStream();
  }, [streamUrl]);

  const togglePlayPause = useCallback(async () => {
    if (!streamUrl) {
      return;
    }
    audioPlayerInstance.togglePlay(streamUrl);
  }, [streamUrl]);

  return { isPlaying, togglePlayPause };
};

export default usePlayer;
