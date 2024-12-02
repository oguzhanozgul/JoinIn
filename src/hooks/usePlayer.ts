import { useCallback, useEffect, useState } from "react";

import audioPlayerInstance from "../components/AudioPlayer/AudioPlayer";
import { AudioPlayerState } from "../components/AudioPlayer/AudioPlayerState";
import useUserSettingsStore from "../stores/useUserSettingsStore";

const usePlayer = (streamUrl?: string) => {
  const [isPlaying, setIsPlaying] = useState(audioPlayerInstance.isPlaying);
  const [currentStreamUrl, setCurrentStreamUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const setPaused = useUserSettingsStore(state => state.setPaused);

  // Handle errors
  useEffect(() => {
    const handleError = (errorToLog: Error) => {
      setError(errorToLog);
    };

    audioPlayerInstance.onError(handleError);

    return () => {
      audioPlayerInstance.onError(null);
    };
  }, []);

  // Subscribe to playing state changes and sync with the global state
  useEffect(() => {
    const handleIsPlayingChange = (instanceState: AudioPlayerState) => {
      setIsPlaying(instanceState.isPlaying);
      setPaused(!instanceState.isPlaying);
      setCurrentStreamUrl(instanceState.currentStream);

      if (instanceState.isPlaying) {
        setError(null);
      }
    };

    audioPlayerInstance.addListener(handleIsPlayingChange);

    return () => {
      audioPlayerInstance.removeListener(handleIsPlayingChange);
    };
  }, [setPaused]);

  // Set the source and start playing
  useEffect(() => {
    if (!streamUrl) return;

    const initializeStream = async () => {
      await audioPlayerInstance.setSource(streamUrl);
      await audioPlayerInstance.play(streamUrl);
      setError(null);
    };

    initializeStream();
  }, [streamUrl]);

  const togglePlayPause = useCallback(async () => {
    if (!streamUrl) {
      return;
    }
    audioPlayerInstance.togglePlay(streamUrl);
  }, [streamUrl]);

  return { isPlaying, currentStreamUrl, togglePlayPause, error };
};

export default usePlayer;
