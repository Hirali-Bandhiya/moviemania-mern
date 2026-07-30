/**
 * Safe Browser Storage Wrapper Utility
 * Provides try-catch guarded access to localStorage and sessionStorage
 * to prevent crashes in restricted or private browsing environments.
 */

const getStorage = (type = "localStorage") => {
  try {
    const storage = window[type];
    const testKey = "__storage_test__";
    storage.setItem(testKey, testKey);
    storage.removeItem(testKey);
    return storage;
  } catch {
    return null;
  }
};

const lStorage = getStorage("localStorage");
const sStorage = getStorage("sessionStorage");

export const secureStorage = {
  getItem: (key) => {
    try {
      return lStorage ? lStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (lStorage) {
        lStorage.setItem(key, value);
      }
    } catch {
      // Ignore quota or security write errors safely
    }
  },
  removeItem: (key) => {
    try {
      if (lStorage) {
        lStorage.removeItem(key);
      }
    } catch {
      // Ignore removal errors
    }
  },
  getItemJSON: (key, fallback = null) => {
    try {
      const value = secureStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  setItemJSON: (key, value) => {
    try {
      secureStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore JSON serialization or write errors
    }
  },
};

export const secureSessionStorage = {
  getItem: (key) => {
    try {
      return sStorage ? sStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (sStorage) {
        sStorage.setItem(key, value);
      }
    } catch {
      // Ignore write errors
    }
  },
  removeItem: (key) => {
    try {
      if (sStorage) {
        sStorage.removeItem(key);
      }
    } catch {
      // Ignore removal errors
    }
  },
  getItemJSON: (key, fallback = null) => {
    try {
      const value = secureSessionStorage.getItem(key);
      return value ? JSON.parse(value) : fallback;
    } catch {
      return fallback;
    }
  },
  setItemJSON: (key, value) => {
    try {
      secureSessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore errors
    }
  },
};

export default secureStorage;
