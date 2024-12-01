class AudioPlayer {
  static instance = null;

  constructor() {
    if (AudioPlayer.instance) {
      return AudioPlayer.instance;
    }

    this.audio = new Audio();
    this.isPlaying = false;
    this.currentStream = null;
    this.errorCallback = null;
    this.listeners = new Set();

    AudioPlayer.instance = this;

    this.audio.onerror = () => {
      this.isPlaying = false;
      this.notifyListeners();
    };

    this.audio.onpause = () => {
      this.isPlaying = false;
      this.notifyListeners();
    };

    this.audio.onplaying = () => {
      this.isPlaying = true;
      this.notifyListeners();
    };
  }

  addListener(callback) {
    this.listeners.add(callback);
  }

  removeListener(callback) {
    this.listeners.delete(callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback({ isPlaying: this.isPlaying, currentStream: this.currentStream })); // Can add more state inside this object as needed
  }

  async play(streamUrl) {
    await this.retry(
      async () => {
        if (this.currentStream !== streamUrl) {
          this.notifyListeners();
          await this.setSource(streamUrl);
        }
        await this.audio.play();
      },
      3,
      1000,
    );
  }

  async setSource(streamUrl) {
    if (this.currentStream !== streamUrl) {
      await this.retry(
        async () => {
          this.audio.src = streamUrl;
          this.audio.load();
          this.currentStream = streamUrl;
        },
        3,
        1000,
      );
    }
  }

  pause() {
    this.audio.pause();
  }

  togglePlay(streamUrl) {
    if (this.isPlaying && this.currentStream === streamUrl) {
      this.pause();
    } else {
      this.play(streamUrl);
    }
  }

  // Simple linear retry mechanism
  async retry(action, maxAttempts, delay) {
    let attempt = 0;
    while (attempt < maxAttempts) {
      try {
        await action();
        return; // Return if successful
      } catch (error) {
        attempt++;
        if (attempt >= maxAttempts) {
          const errorMessage = `Failed after ${maxAttempts} attempts: ${error.message}`;
          this.errorCallback?.(new Error(errorMessage));
          throw error; // Rethrow after max attempts
        }
        await this.delay(delay);
      }
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  onError(callback) {
    this.errorCallback = callback;
  }

  cleanup() {
    this.audio.pause();
    this.audio.src = "";
    this.audio = null;
    this.listeners.clear();
    AudioPlayer.instance = null;
  }
}

const audioPlayerInstance = new AudioPlayer();
export default audioPlayerInstance;
