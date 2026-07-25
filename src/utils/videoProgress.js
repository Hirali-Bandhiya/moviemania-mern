import { STORAGE_KEYS } from "../constants/storageKeys";

// videoProgress.js
// Save video progress every 5 seconds to localStorage

export const saveProgress = (movieId, currentTime) => {
  const progress = { movieId, currentTime };
  localStorage.setItem(`${STORAGE_KEYS.MOVIE_PROGRESS_PREFIX}${movieId}`, JSON.stringify(progress));
};

export const getProgress = (movieId) => {
  const stored = localStorage.getItem(`${STORAGE_KEYS.MOVIE_PROGRESS_PREFIX}${movieId}`);
  return stored ? JSON.parse(stored).currentTime : 0;
};

// Hook to attach to video element
export const useVideoProgress = (videoEl, movieId) => {
  useEffect(() => {
    if (!videoEl) return;

    let interval;
    const startSaving = () => {
      interval = setInterval(() => {
        saveProgress(movieId, Math.floor(videoEl.currentTime));
      }, 5000);
    };

    const stopSaving = () => {
      if (interval) clearInterval(interval);
    };

    videoEl.addEventListener('play', startSaving);
    videoEl.addEventListener('pause', stopSaving);
    videoEl.addEventListener('ended', stopSaving);

    // Set initial time
    videoEl.currentTime = getProgress(movieId);

    return () => {
      stopSaving();
      videoEl.removeEventListener('play', startSaving);
      videoEl.removeEventListener('pause', stopSaving);
      videoEl.removeEventListener('ended', stopSaving);
    };
  }, [videoEl, movieId]);
};