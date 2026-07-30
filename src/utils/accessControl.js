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

export const isAdminUser = (user) => {
  if (!user || typeof user !== "object") return false;
  return user.isAdmin === true || user.role === "Admin" || user.role === "admin";
};

export const requiresSubscriptionForContent = (content = {}) => {
  if (content.requirePlanForAccess === true) {
    return true;
  }

  return PREMIUM_CONTENT_TITLES.has(normalizeTitle(content.title));
};

export const hasContentAccess = (user, content, hasActivePlan = false) => {
  if (!requiresSubscriptionForContent(content)) {
    return true;
  }
  return hasActivePlan;
};

