// history.js
// Keeps track of recently watched movies (most recent first).
// Stored format: [{ movieId, watchedAt }]
// Limited to last 5 entries.

export const getRecentlyWatched = () => {
  const list = localStorage.getItem("recentlyWatched");
  return list ? JSON.parse(list) : [];
};

export const addToRecentlyWatched = (movieId) => {
  const list = getRecentlyWatched();
  // remove if exists
  const filtered = list.filter((item) => item.movieId !== movieId);
  filtered.unshift({ movieId, watchedAt: Date.now() });
  const limited = filtered.slice(0, 5);
  localStorage.setItem("recentlyWatched", JSON.stringify(limited));
};

// helper to map to movie objects given movies array
export const mapRecentlyWatched = (movies) => {
  const list = getRecentlyWatched();
  return list
    .map((entry) => movies.find((m) => m._id === entry.movieId || m.id === entry.movieId))
    .filter(Boolean);
};
