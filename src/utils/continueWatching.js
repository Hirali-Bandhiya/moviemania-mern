// continueWatching.js
// The stored format is an array of objects: { movieId, progress }
// progress is in seconds. We also maintain order with most recent first.

export const getContinueWatching = () => {
  const list = localStorage.getItem("continueWatching");
  const parsed = list ? JSON.parse(list) : [];
  // migrate old format (movie objects) to {movieId,progress}
  if (parsed.length > 0 && (parsed[0].id || parsed[0]._id)) {
    const migrated = parsed.map((m) => ({ movieId: m._id || m.id, progress: m.progress || 0 }));
    localStorage.setItem("continueWatching", JSON.stringify(migrated));
    return migrated;
  }
  return parsed;
};

export const updateContinueWatching = (movieId, progress = 0) => {
  const list = getContinueWatching();
  // remove existing entry for movie
  const filtered = list.filter((item) => item.movieId !== movieId);
  // add at beginning with updated progress
  filtered.unshift({ movieId, progress });
  // limit to 10 entries
  const limited = filtered.slice(0, 10);
  localStorage.setItem("continueWatching", JSON.stringify(limited));
};

// utility to convert stored entries into full movie objects (caller must import movies array)
export const mapContinueMovies = (movies) => {
  const list = getContinueWatching();
  return list
    .map((entry) => {
      const m = movies.find((mv) => mv._id === entry.movieId || mv.id === entry.movieId);
      if (!m) return null;
      return { ...m, progress: entry.progress };
    })
    .filter(Boolean);
};

// Remove a movie from continue watching list
export const removeContinueWatching = (movieId) => {
  const list = getContinueWatching();
  const filtered = list.filter((item) => item.movieId !== movieId);
  localStorage.setItem("continueWatching", JSON.stringify(filtered));
};

