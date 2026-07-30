// formValidation.js
// Centralized validation and input sanitization utilities for forms

export const sanitizeInput = (value) => {
  if (typeof value !== "string") return value;
  // Trim leading/trailing whitespace and strip dangerous HTML/script tags client-side
  return value
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<[^>]+>/g, "");
};

export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email || "").trim());
};

export const validateRequired = (value) => {
  return String(value || "").trim() !== "" ? "" : "This field is required";
};

export const validateEmail = (email) => {
  return isValidEmail(email) ? "" : "Invalid email format";
};

export const validatePassword = (password, minLength = 6) => {
  if (!password) return "Password cannot be blank.";
  if (password.length < minLength) return `Password must be at least ${minLength} characters.`;
  return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return "Confirm Password cannot be blank.";
  if (password !== confirmPassword) return "Passwords do not match.";
  return "";
};

export const validateNumeric = (value) => {
  return !isNaN(value) && Number(value) > 0 ? "" : "Must be a positive number";
};

export const validatePositiveNumber = (value) => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

export const validateDate = (value) => {
  if (!value) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
};

export const validateForm = (fields) => {
  const errors = {};
  Object.keys(fields).forEach((key) => {
    if (key.includes("email")) {
      errors[key] = validateEmail(fields[key]);
    } else if (key.includes("year") || key.includes("price")) {
      errors[key] = validateNumeric(fields[key]);
    } else {
      errors[key] = validateRequired(fields[key]);
    }
  });
  return errors;
};