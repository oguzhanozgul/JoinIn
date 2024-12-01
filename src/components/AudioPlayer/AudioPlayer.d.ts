import { AudioPlayerState } from "./AudioPlayerState";

declare class AudioPlayer {
  static instance: AudioPlayer | null;

  private audio: HTMLAudioElement;
  private currentStream: string | null;
  private errorCallback: ((error: Error) => void) | null;
  private listeners: Set<(state: AudioPlayerState) => void>;

  public isPlaying: boolean;
  public isLoading: boolean;

  constructor();

  // Adds a listener to the set
  public addListener(callback: (state: AudioPlayerState) => void): void;

  // Removes a listener from the set
  public removeListener(callback: (state: AudioPlayerState) => void): void;

  // Notifies all listeners about the current state
  public notifyListeners(): void;

  // Plays the audio stream
  public play(streamUrl: string): Promise<void>;

  // Sets the source of the audio stream
  public setSource(streamUrl: string): Promise<void>;

  // Pauses the audio
  public pause(): void;

  // Toggles play/pause of the audio
  public togglePlay(streamUrl: string): void;

  // Simple retry mechanism for actions with retries
  private retry(action: () => Promise<void>, maxAttempts: number, delay: number): Promise<void>;

  // Delays execution for a specified amount of time
  private delay(ms: number): Promise<void>;

  // Sets a callback for error handling
  public onError(callback: ((error: Error) => void) | null): void;

  // Cleans up the audio player instance
  public cleanup(): void;
}

// Default instance of AudioPlayer
declare const audioPlayerInstance: AudioPlayer;

export default audioPlayerInstance;
