import { loginApi, paymentSuccessApi, registerApi } from "../services/authService";
import { STORAGE_KEYS } from "../constants/storageKeys";
import { secureStorage } from "./secureStorage";
import { isAdminUser as checkIsAdmin } from "./accessControl";

const TOKEN_KEY = STORAGE_KEYS.TOKEN;
const USER_KEY = STORAGE_KEYS.CURRENT_USER;
const CHECKOUT_PENDING_KEY = STORAGE_KEYS.CHECKOUT_PENDING;

export const safeParse = (value) => {
  try {
    return value ? (typeof value === "object" ? value : JSON.parse(value)) : null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token) => {
  if (!token || typeof token !== "string") return false;
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return false;
    const payload = JSON.parse(atob(parts[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload && typeof payload.exp === "number") {
      return payload.exp * 1000 < Date.now();
    }
  } catch {
    return false;
  }
  return false;
};

export const getAuthToken = () => secureStorage.getItem(TOKEN_KEY);

const sanitizeUserForStorage = (userData) => {
  if (!userData || typeof userData !== "object") return {};
  const { password, confirmPassword, ...safeUser } = userData;
  return safeUser;
};

export const setAuthSession = (userData) => {
  if (!userData) return;

  const { token, ...user } = userData;

  if (token) {
    secureStorage.setItem(TOKEN_KEY, token);
  }

  const safeUser = sanitizeUserForStorage(user);
  if (Object.keys(safeUser).length > 0) {
    secureStorage.setItemJSON(USER_KEY, safeUser);
  }
};

export const updateCurrentUser = (partial) => {
  const current = getCurrentUser();
  if (!current) return null;

  const updated = sanitizeUserForStorage({ ...current, ...partial });
  secureStorage.setItemJSON(USER_KEY, updated);
  return updated;
};

export const logout = () => {
  secureStorage.removeItem(USER_KEY);
  secureStorage.removeItem(TOKEN_KEY);
  secureStorage.removeItem(CHECKOUT_PENDING_KEY);
};

export const markCheckoutPending = () => {
  secureStorage.setItem(CHECKOUT_PENDING_KEY, "true");
};

export const clearCheckoutPending = () => {
  secureStorage.removeItem(CHECKOUT_PENDING_KEY);
};

export const isCheckoutPending = () => secureStorage.getItem(CHECKOUT_PENDING_KEY) === "true";

export const getCurrentUser = () => {
  const data = secureStorage.getItemJSON(USER_KEY);
  return safeParse(data);
};

export const isAdminUser = (user = getCurrentUser()) => {
  return checkIsAdmin(user);
};

export const isLoggedIn = () => {
  if (isCheckoutPending()) {
    return false;
  }

  const token = getAuthToken();
  if (token && isTokenExpired(token)) {
    logout();
    return false;
  }

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
    secureStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_END_DATE) ||
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
  const savedPlan = secureStorage.getItem(STORAGE_KEYS.SUBSCRIPTION_PLAN);
  const paymentStatus = secureStorage.getItem(STORAGE_KEYS.PAYMENT_STATUS);
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