const PENDING_PLAN_KEY = "pendingPlanSelection";
const SELECTED_PLAN_KEY = "selectedPlan";

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

const parseAmount = (value) => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const rawValue = String(value || "").replace(/,/g, "");
  const match = rawValue.match(/(\d+(?:\.\d+)?)/);
  return match ? Number(match[1]) : 0;
};

const defaultPlanCatalog = {
  Basic: { planId: "Basic", name: "Basic Plan", amount: 199, priceLabel: "₹199 / month", billingCycle: "monthly" },
  Standard: { planId: "Standard", name: "Standard Plan", amount: 399, priceLabel: "₹399 / month", billingCycle: "monthly" },
  Premium: { planId: "Premium", name: "Premium Plan", amount: 699, priceLabel: "₹699 / month", billingCycle: "monthly" },
  Family: { planId: "Family", name: "Family Pack", amount: 1499, priceLabel: "₹1499 / month", billingCycle: "monthly" },
  Student: { planId: "Student", name: "Student Discount", amount: 199, priceLabel: "₹199 / month", billingCycle: "monthly" },
  Yearly: { planId: "Yearly", name: "Yearly Offer", amount: 2999, priceLabel: "₹2999 / year", billingCycle: "yearly" },
  Trial: { planId: "Trial", name: "Free Trial", amount: 0, priceLabel: "FREE for 7 Days", billingCycle: "trial" },
  festival: { planId: "festival", name: "Festival Offer", amount: 149, priceLabel: "₹149 / month", billingCycle: "monthly" },
};

export const normalizePlanSelection = (planInput) => {
  if (!planInput) {
    return null;
  }

  if (typeof planInput === "string") {
    return defaultPlanCatalog[planInput] || {
      planId: planInput,
      name: planInput,
      amount: parseAmount(planInput),
      priceLabel: planInput,
      billingCycle: "monthly",
    };
  }

  const planId = String(
    planInput.planId || planInput.id || planInput.code || planInput.type || planInput.name || planInput.title || "Basic"
  ).trim();
  const amount = Number.isFinite(planInput.amount)
    ? planInput.amount
    : parseAmount(planInput.priceLabel || planInput.price || planInput.amountText || planInput.priceText);
  const priceLabel = planInput.priceLabel || planInput.priceText || planInput.price || (amount > 0 ? `₹${amount}` : "FREE");

  return {
    planId,
    name: planInput.name || planInput.title || planId,
    amount,
    priceLabel,
    billingCycle: planInput.billingCycle || planInput.period || planInput.type || "monthly",
    description: planInput.description || "",
  };
};

export const storePendingPlanSelection = (planInput) => {
  const normalizedPlan = normalizePlanSelection(planInput);

  if (!normalizedPlan) {
    return null;
  }

  localStorage.setItem(SELECTED_PLAN_KEY, normalizedPlan.planId || normalizedPlan.name || "");
  localStorage.setItem(PENDING_PLAN_KEY, JSON.stringify(normalizedPlan));

  return normalizedPlan;
};

export const readPendingPlanSelection = (fallback = null) => {
  const storedPlan = safeParse(localStorage.getItem(PENDING_PLAN_KEY));
  return normalizePlanSelection(fallback || storedPlan || localStorage.getItem(SELECTED_PLAN_KEY));
};

export const clearPendingPlanSelection = () => {
  localStorage.removeItem(PENDING_PLAN_KEY);
  localStorage.removeItem(SELECTED_PLAN_KEY);
};

export const parsePlanAmount = parseAmount;