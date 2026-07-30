import { extractErrorMessage } from "../services/apiError";
import { logger } from "./logger";

/**
 * Standardized Error Handling Utility
 * Extracts clean user-facing error messages and logs sanitized diagnostic details.
 */

export const handleError = (error, contextMessage = "An error occurred") => {
  const cleanMessage = extractErrorMessage(error, contextMessage);
  logger.error(`[${contextMessage}]`, cleanMessage, error?.stack ? { stack: error.stack } : {});
  return cleanMessage;
};

export default handleError;
