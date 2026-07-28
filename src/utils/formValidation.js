// formValidation.js
// Validation utilities for forms

export const validateRequired = (value) => {
  return String(value || "").trim() !== "" ? "" : "This field is required";
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? "" : "Invalid email format";
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