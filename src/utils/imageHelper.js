/**
 * Utility to normalize image paths for both local and remote images
 */

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "https://via.placeholder.com/300x400?text=No+Image";

  const normalizedPath = String(imagePath).trim();

  // Keep already-resolved runtime URLs intact, including Vite asset URLs like /assets/*.jpg.
  if (/^(https?:|data:|blob:)/i.test(normalizedPath) || normalizedPath.startsWith("/")) {
    return normalizedPath;
  }

  // Database records usually store just the filename, and public/images is available at runtime.
  const filename = normalizedPath.split(/[\\/]/).pop();
  return `/images/${filename}`;
};

export default getImageUrl;
