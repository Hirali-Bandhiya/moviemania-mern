/**
 * Standardized API Error Extraction Utility
 * Safely extracts user-friendly error messages from Axios network and response errors.
 */

export const extractErrorMessage = (error, fallbackMessage = "An error occurred. Please try again.") => {
  if (!error) {
    return fallbackMessage;
  }

  if (error.code === "ERR_NETWORK" || error.code === "ECONNABORTED") {
    return "Unable to reach server. Start backend with: npm run dev (root) or npm --prefix backend run dev";
  }

  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    fallbackMessage
  );
};

export default extractErrorMessage;
