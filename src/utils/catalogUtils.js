/**
 * Utility functions for catalog item industry classification and sorting
 */

export const BOLLYWOOD_MOVIE_TITLES = new Set([
  "pathaan",
  "war",
  "kgf chapter 2",
  "3 idiots",
  "gol maal",
  "golmaal",
  "welcome",
  "dhamaal",
  "rrr",
  "mirzapur",
  "sacred games",
]);

export const BOLLYWOOD_SERIES_TITLES = new Set([
  "mirzapur",
  "sacred games",
  "the family man",
  "panchayat",
  "asur",
  "farzi",
  "scam 1992",
  "kota factory",
  "delhi crime",
]);

export const BOLLYWOOD_IMAGE_HINTS = new Set([
  "mirzapur",
  "sacredgames",
  "golmaal",
  "welcome",
  "dhamaal",
  "3idiots",
  "idiots",
  "pathaan",
  "war",
  "kgf",
  "rrr",
]);

export const resolveMovieIndustry = (movie) => {
  if (!movie) return "hollywood";
  const directIndustry = String(movie.industry || movie.category || "").trim().toLowerCase();

  if (directIndustry === "hollywood" || directIndustry === "bollywood") {
    return directIndustry;
  }

  const title = String(movie.title || "").trim().toLowerCase();
  if (BOLLYWOOD_MOVIE_TITLES.has(title)) {
    return "bollywood";
  }

  return "hollywood";
};

export const resolveSeriesIndustry = (item) => {
  if (!item) return "hollywood";
  const title = String(item.title || "").trim().toLowerCase();
  const directCategory = String(item.category || "").trim().toLowerCase();
  const directIndustry = String(item.industry || "").trim().toLowerCase();
  const imageName = String(item.image || "")
    .trim()
    .toLowerCase()
    .replace(/\.[a-z0-9]+$/i, "");

  if (directCategory === "bollywood" || directIndustry === "bollywood") {
    return "bollywood";
  }

  if (BOLLYWOOD_SERIES_TITLES.has(title)) {
    return "bollywood";
  }

  if (BOLLYWOOD_IMAGE_HINTS.has(imageName)) {
    return "bollywood";
  }

  return "hollywood";
};

export const sortCatalogItems = (items = [], sortBy = "featured") => {
  const result = [...items];

  if (sortBy === "rating-desc") {
    return result.sort((a, b) => Number(b.rating || 0) - Number(a.rating || 0));
  }

  if (sortBy === "year-desc") {
    return result.sort((a, b) => Number(b.year || 0) - Number(a.year || 0));
  }

  if (sortBy === "year-asc") {
    return result.sort((a, b) => Number(a.year || 0) - Number(b.year || 0));
  }

  return result;
};
