import { ENV_CONFIG } from "./env.config";

/**
 * Centralized Application Settings & Constants
 */
export const APP_CONFIG = {
  NAME: ENV_CONFIG.APP_TITLE,
  ENV: ENV_CONFIG.APP_ENV,
  IS_PROD: ENV_CONFIG.IS_PROD,
  IS_DEV: ENV_CONFIG.IS_DEV,
  STORAGE_PREFIX: "moviemania_",
  PROGRESS_SAVE_INTERVAL: 5000,
};

export default APP_CONFIG;
