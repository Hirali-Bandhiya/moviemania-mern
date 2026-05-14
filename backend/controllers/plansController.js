const Plan = require("../models/Plan");

const currentPlans = [
  {
    planCode: "basic",
    name: "Basic",
    description: "Good video quality in 720p. Watch on any phone, tablet, computer or TV.",
    pricing: { monthly: 499, yearly: null, currency: "INR" },
    features: [
      "Access to unlimited movies and TV shows",
      "Watch on 1 supported device at a time",
      "Watch in HD (720p)",
      "Downloads on 1 supported device",
    ],
    limits: { quality: "HD", screens: 1, downloads: 1 },
    active: true,
    popular: false,
    sortOrder: 1,
  },
  {
    planCode: "family",
    name: "Family",
    description: "Great video quality in 1080p. Best for small screens and laptops.",
    pricing: { monthly: 1499, yearly: null, currency: "INR" },
    features: [
      "Access to unlimited movies and TV shows",
      "Watch on 2 supported devices at a time",
      "Watch in Full HD (1080p)",
      "Downloads on 2 supported devices",
      "Ad-free experience",
    ],
    limits: { quality: "Full HD", screens: 2, downloads: 2 },
    active: true,
    popular: true,
    sortOrder: 2,
  },
  {
    planCode: "premium",
    name: "Premium",
    description: "Our best video quality in 4K+HDR. The ultimate experience.",
    pricing: { monthly: 999, yearly: null, currency: "INR" },
    features: [
      "Access to unlimited movies and TV shows",
      "Watch on 4 supported devices at a time",
      "Watch in Ultra HD (4K) and HDR",
      "Downloads on 6 supported devices",
      "Ad-free experience",
      "Spatial audio",
    ],
    limits: { quality: "4K", screens: 4, downloads: 6 },
    active: true,
    popular: false,
    sortOrder: 3,
  },
];

const parseNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const slugifyPlanCode = (name) =>
  String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const normalizePlanResponse = (plan) => {
  const monthly = parseNumber(plan?.pricing?.monthly, 0);
  const yearly = plan?.pricing?.yearly ?? null;

  return {
    _id: plan._id,
    planCode: plan.planCode,
    name: plan.name,
    description: plan.description || "",
    pricing: {
      monthly,
      yearly,
      currency: plan?.pricing?.currency || "INR",
    },
    features: Array.isArray(plan.features) ? plan.features : [],
    limits: plan.limits || {},
    active: Boolean(plan.active),
    popular: Boolean(plan.popular),
    sortOrder: parseNumber(plan.sortOrder, 0),
    amount: monthly,
    priceLabel: `₹${monthly} / month`,
    isPopular: Boolean(plan.popular),
    billingCycle: "monthly",
  };
};

const buildPlanPayload = (body = {}, existingPlan = null) => {
  const name = String(body.name || existingPlan?.name || "").trim();
  const planCode = String(body.planCode || existingPlan?.planCode || slugifyPlanCode(name)).trim();
  const monthlyFromAmount = parseNumber(body.amount, existingPlan?.pricing?.monthly || 0);
  const monthlyFromPriceLabel = parseNumber(String(body.priceLabel || "").replace(/[^0-9.]/g, ""), monthlyFromAmount);
  const monthly = monthlyFromAmount || monthlyFromPriceLabel;

  return {
    planCode,
    name,
    description: String(body.description || existingPlan?.description || "").trim(),
    pricing: {
      monthly,
      yearly: existingPlan?.pricing?.yearly ?? null,
      currency: body.currency || existingPlan?.pricing?.currency || "INR",
    },
    features: Array.isArray(body.features)
      ? body.features
      : typeof body.features === "string"
        ? body.features.split("\n").map((feature) => feature.trim()).filter(Boolean)
        : existingPlan?.features || [],
    limits: existingPlan?.limits || {
      quality: "HD",
      screens: 1,
      downloads: 0,
    },
    active: typeof body.active === "boolean" ? body.active : existingPlan?.active ?? true,
    popular: typeof body.isPopular === "boolean" ? body.isPopular : existingPlan?.popular ?? false,
    sortOrder: parseNumber(body.sortOrder, existingPlan?.sortOrder || 0),
  };
};

exports.getAllPlans = async (req, res) => {
  try {
    const plans = await Plan.find({}).sort({ sortOrder: 1, createdAt: 1 });
    const sourcePlans = plans.length > 0 ? plans : currentPlans;
    res.json(sourcePlans.map(normalizePlanResponse));
  } catch (error) {
    res.status(500).json({ message: "Failed to load plans", error: error.message });
  }
};

exports.getPlanById = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json(normalizePlanResponse(plan));
  } catch (error) {
    res.status(500).json({ message: "Failed to load plan", error: error.message });
  }
};

exports.createPlan = async (req, res) => {
  try {
    const payload = buildPlanPayload(req.body);

    if (!payload.name) {
      return res.status(400).json({ message: "Plan name is required" });
    }

    if (!payload.planCode) {
      return res.status(400).json({ message: "Plan code is required" });
    }

    const created = await Plan.create(payload);
    res.status(201).json(normalizePlanResponse(created));
  } catch (error) {
    res.status(500).json({ message: "Failed to create plan", error: error.message });
  }
};

exports.updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    const payload = buildPlanPayload(req.body, plan);
    Object.assign(plan, payload);
    await plan.save();

    res.json(normalizePlanResponse(plan));
  } catch (error) {
    res.status(500).json({ message: "Failed to update plan", error: error.message });
  }
};

exports.deletePlan = async (req, res) => {
  try {
    const deleted = await Plan.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Plan not found" });
    }

    res.json({ message: "Plan deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete plan", error: error.message });
  }
};