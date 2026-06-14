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

const decorateContentAccess = (content) => ({
  ...(typeof content?.toObject === "function" ? content.toObject() : content),
  requirePlanForAccess:
    content?.requirePlanForAccess === true || PREMIUM_CONTENT_TITLES.has(normalizeTitle(content?.title)),
});

module.exports = {
  decorateContentAccess,
  requiresSubscriptionForContent: (content = {}) =>
    content.requirePlanForAccess === true || PREMIUM_CONTENT_TITLES.has(normalizeTitle(content.title)),
};