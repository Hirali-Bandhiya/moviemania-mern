const PREMIUM_CONTENT_TITLES = new Set([
  "pathaan",
  "avengers",
  "the dark knight",
  "interstellar",
  "stranger things",
  "money heist",
  "the boys",
  "narcos",
  "mirzapur",
]);

const normalizeTitle = (value) => String(value || "").trim().toLowerCase();

export const requiresSubscriptionForContent = (content = {}) => {
  if (content.requirePlanForAccess === true) {
    return true;
  }

  return PREMIUM_CONTENT_TITLES.has(normalizeTitle(content.title));
};
