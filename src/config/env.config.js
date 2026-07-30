/**
 * Centralized Environment Configuration Access
 * Validates and provides fallback values for environment variables.
 */
export const ENV_CONFIG = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
  APP_ENV: import.meta.env.VITE_APP_ENV || import.meta.env.MODE || "development",
  APP_TITLE: import.meta.env.VITE_APP_TITLE || "MovieMania",
  IS_DEV: import.meta.env.DEV ?? (import.meta.env.MODE === "development"),
  IS_PROD: import.meta.env.PROD ?? (import.meta.env.MODE === "production"),
};

export default ENV_CONFIG;
