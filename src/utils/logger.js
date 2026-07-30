import { APP_CONFIG } from "../config/app.config";

/**
 * Secure Logger Utility
 * Sanitizes sensitive keys (tokens, passwords, secrets, card data) before logging
 * and suppresses verbose debug logs in production mode.
 */

const SENSITIVE_KEYS = new Set([
  "token",
  "password",
  "confirmpassword",
  "secret",
  "jwt",
  "authorization",
  "creditcard",
  "cardnumber",
  "cvv",
]);

const sanitizeLogData = (data) => {
  if (data === null || data === undefined) return data;

  if (typeof data === "string") {
    if (/bearer\s+[a-zA-Z0-9._-]+/i.test(data)) {
      return data.replace(/bearer\s+[a-zA-Z0-9._-]+/gi, "Bearer [REDACTED]");
    }
    return data;
  }

  if (typeof data === "object") {
    if (Array.isArray(data)) {
      return data.map(sanitizeLogData);
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(data)) {
      const lowerKey = key.toLowerCase();
      if (SENSITIVE_KEYS.has(lowerKey)) {
        sanitized[key] = "[REDACTED]";
      } else if (typeof value === "object" && value !== null) {
        sanitized[key] = sanitizeLogData(value);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  }

  return data;
};

export const logger = {
  log: (...args) => {
    if (!APP_CONFIG.IS_PROD) {
      console.log(...args.map(sanitizeLogData));
    }
  },
  info: (...args) => {
    if (!APP_CONFIG.IS_PROD) {
      console.info(...args.map(sanitizeLogData));
    }
  },
  warn: (...args) => {
    console.warn(...args.map(sanitizeLogData));
  },
  error: (...args) => {
    console.error(...args.map(sanitizeLogData));
  },
  debug: (...args) => {
    if (!APP_CONFIG.IS_PROD) {
      console.debug(...args.map(sanitizeLogData));
    }
  },
};

export default logger;
