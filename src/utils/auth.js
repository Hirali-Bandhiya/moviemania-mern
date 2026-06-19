import { loginApi, paymentSuccessApi, registerApi } from "../services/authService";

const TOKEN_KEY = "token";
const USER_KEY = "currentUser";
const CHECKOUT_PENDING_KEY = "checkoutPending";

const safeParse = (value) => {
  try {
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
};

export const getAuthToken = () => localStorage.getItem(TOKEN_KEY);

export const setAuthSession = (userData) => {
  if (!userData) return;

  const { token, ...user } = userData;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  }

  if (Object.keys(user).length > 0) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const updateCurrentUser = (partial) => {
  const current = getCurrentUser();
  if (!current) return null;

  const updated = { ...current, ...partial };
  localStorage.setItem(USER_KEY, JSON.stringify(updated));
  return updated;
};

export const logout = () => {
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(CHECKOUT_PENDING_KEY);
};

export const markCheckoutPending = () => {
  localStorage.setItem(CHECKOUT_PENDING_KEY, "true");
};

export const clearCheckoutPending = () => {
  localStorage.removeItem(CHECKOUT_PENDING_KEY);
};

export const isCheckoutPending = () => localStorage.getItem(CHECKOUT_PENDING_KEY) === "true";

export const getCurrentUser = () => {
  return safeParse(localStorage.getItem(USER_KEY));
};

export const isLoggedIn = () => {
  if (isCheckoutPending()) {
    return false;
  }

  const token = getAuthToken();
  const currentUser = getCurrentUser();
  // Backward compatibility: older sessions may store token on currentUser.
  return Boolean(token || currentUser?.token || currentUser?._id || currentUser?.email);
};

export const registerUser = async ({ name, email, password, referredBy }) => {
  try {
    const data = await registerApi({ name, email, password, referredBy });
    setAuthSession(data);
    return { success: true, user: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const loginUser = async (email, password) => {
  try {
    const data = await loginApi({ email, password });
    setAuthSession(data);
    return { success: true, user: data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const savePaymentStatus = async (plan) => {
  try {
    const data = await paymentSuccessApi({ plan });
    updateCurrentUser({
      isPaid: data?.isPaid,
      plan: data?.plan,
      subscriptionPlan: data?.plan,
      subscriptionActive: data?.subscriptionActive ?? true,
      subscriptionExpiry: data?.subscriptionExpiry || data?.subscriptionExpiryDate || data?.subscriptionEndDate || null,
      subscriptionExpiryDate: data?.subscriptionExpiryDate || data?.subscriptionExpiry || data?.subscriptionEndDate || null,
    });
    return { success: true, data };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

const getSubscriptionExpiry = (user) => {
  return (
    user?.subscriptionExpiryDate ||
    user?.subscriptionExpiry ||
    user?.subscriptionEndDate ||
    user?.currentSubscription?.expiresAt ||
    localStorage.getItem("subscriptionEndDate") ||
    null
  );
};

const isFutureDate = (value) => {
  if (!value) {
    return false;
  }

  const expiryDate = new Date(value);
  return !Number.isNaN(expiryDate.getTime()) && expiryDate.getTime() > Date.now();
};

export const hasSubscription = () => {
  const user = getCurrentUser();
  return Boolean(user?.subscriptionPlan || user?.plan);
};

export const hasActivePlan = () => {
  const user = getCurrentUser();
  const savedPlan = localStorage.getItem("subscriptionPlan");
  const paymentStatus = localStorage.getItem("paymentStatus");
  const expiryDate = getSubscriptionExpiry(user);

  // Honor the backend subscription flag, but still expire access when the date is in the past.
  if (user?.subscriptionActive === true && (isFutureDate(expiryDate) || !expiryDate)) {
    return Boolean(user?.subscriptionPlan || user?.plan || savedPlan);
  }

  if (isFutureDate(expiryDate)) {
    return Boolean(user?.subscriptionPlan || user?.plan || savedPlan);
  }

  if (user) {
    return Boolean(user.isPaid && (user.subscriptionPlan || user.plan));
  }

  return Boolean(
    savedPlan && paymentStatus === "success"
  );
};

export const hasPayment = () => {
  return hasActivePlan();
};