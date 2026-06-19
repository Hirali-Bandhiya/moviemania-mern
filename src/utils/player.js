import { updateContinueWatching } from "./continueWatching";
import { addToRecentlyWatched } from "./history";

// helper to wire up video element events for progress tracking and history
export const attachPlayerHandlers = (videoEl, movie, onEndedSuggestion) => {
  if (!videoEl) return;

  const movieId = movie._id;

  videoEl.onplay = () => {
    // initialize continue watch entry
    updateContinueWatching(movieId, 0);
  };

  videoEl.ontimeupdate = (e) => {
    const current = Math.floor(e.target.currentTime);
    updateContinueWatching(movieId, current);
  };

  videoEl.onended = () => {
    addToRecentlyWatched(movieId);
    if (onEndedSuggestion) onEndedSuggestion();
  };
};

// simple helpers
export const setPlaybackRate = (videoEl, rate) => {
  if (videoEl) videoEl.playbackRate = rate;
};
export const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
};
