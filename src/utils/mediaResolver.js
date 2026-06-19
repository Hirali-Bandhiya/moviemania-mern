const DEAD_YOUTUBE_VIDEO_IDS = new Set([
  "pj15fJn5Bg4",
]);

const isHttpUrl = (value) => /^https?:\/\//i.test(String(value || "").trim());

export const extractYoutubeVideoId = (url) => {
  const value = String(url || "").trim();
  if (!value) return "";

  const match = value.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/i);
  return match ? match[1] : "";
};

export const buildYoutubeSearchUrl = (title, kind = "trailer") => {
  const safeTitle = String(title || "movie").trim() || "movie";
  const query = encodeURIComponent(`${safeTitle} official ${kind}`);
  return `https://www.youtube.com/results?search_query=${query}`;
};

export const resolveTrailerUrl = (content, kind = "trailer") => {
  const title = String(content?.title || "movie").trim();
  const rawTrailerUrl = String(content?.trailerUrl || content?.trailer || "").trim();

  if (!rawTrailerUrl) {
    return buildYoutubeSearchUrl(title, kind);
  }

  const youtubeId = extractYoutubeVideoId(rawTrailerUrl);
  if (youtubeId) {
    if (DEAD_YOUTUBE_VIDEO_IDS.has(youtubeId)) {
      return buildYoutubeSearchUrl(title, kind);
    }
    return `https://www.youtube.com/watch?v=${youtubeId}`;
  }

  if (isHttpUrl(rawTrailerUrl)) {
    return rawTrailerUrl;
  }

  return buildYoutubeSearchUrl(title, kind);
};

export const resolvePlaybackUrl = (content, localFallback = null) => {
  const candidates = [
    String(content?.videoUrl || "").trim(),
    String(localFallback?.videoUrl || "").trim(),
  ].filter((url) => isHttpUrl(url));

  return candidates[0] || "";
};
