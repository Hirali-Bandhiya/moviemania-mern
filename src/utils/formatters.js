/**
 * General-purpose formatting utility functions
 */

export const formatDate = (dateInput, fallback = "N/A") => {
  if (!dateInput) return fallback;
  try {
    const d = new Date(dateInput);
    if (isNaN(d.getTime())) return fallback;
    return d.toLocaleDateString();
  } catch {
    return fallback;
  }
};

export const formatPrice = (amount, currency = "$", decimals = 2) => {
  const num = Number(amount || 0);
  if (isNaN(num)) return `${currency}0.00`;
  return `${currency}${num.toFixed(decimals)}`;
};

export const truncateText = (text, maxLength = 100) => {
  const str = String(text || "").trim();
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}...`;
};

export const capitalize = (str) => {
  if (!str) return "";
  const text = String(str);
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const normalizeText = (value) => {
  return String(value || "").trim().toLowerCase();
};

export const getCountdown = (validTill) => {
  if (!validTill) return "EXPIRED";

  const now = new Date();
  const expiry = new Date(validTill);
  const diff = expiry - now;

  if (diff <= 0) return "EXPIRED";

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  if (days > 0) return `${days}d ${hours}h left`;
  if (hours > 0) return `${hours}h ${minutes}m left`;
  return `${minutes}m ${seconds}s left`;
};
