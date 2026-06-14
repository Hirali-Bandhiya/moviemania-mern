import { useState } from "react";
import { Link } from "react-router-dom";
import { forgotPasswordApi, resetPasswordWithOtpApi, verifyOtpApi } from "../services/authService";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState("email");
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await forgotPasswordApi({ email: email.trim() });
      setMessage(result?.message || "OTP sent to an email");
      setStep("otp");
    } catch (err) {
      setError(err.message || "Unable to send reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await verifyOtpApi({ email: email.trim(), otp: otp.trim() });
      setMessage(result?.message || "OTP verified successfully");
      setShowPasswordModal(true);
    } catch (err) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    if (!newPassword || newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const result = await resetPasswordWithOtpApi({ email: email.trim(), newPassword });
      setMessage(result?.message || "Password updated successfully");
      setShowPasswordModal(false);
      setEmail("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");
      setStep("email");
      setTimeout(() => window.location.assign("/login"), 1200);
    } catch (err) {
      setError(err.message || "Unable to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c')" }}>
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95"></div>
      <div className="relative bg-black/75 backdrop-blur-md border border-red-600 rounded-2xl p-10 w-[420px] shadow-2xl">
        <h1 className="text-red-600 text-3xl font-bold text-center mb-6">Forgot Password</h1>
        <p className="text-gray-300 text-center mb-6">Enter your email, verify the OTP, and then set a new password.</p>

        {message && <p className="text-green-400 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={step === "email" ? handleSendOtp : handleVerifyOtp} className="space-y-5">
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded bg-gray-900 text-white border border-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={step !== "email"}
            />
          </div>

          {step !== "email" && (
            <div>
              <input
                type="text"
                placeholder="Enter OTP"
                className="w-full px-4 py-3 rounded bg-gray-900 text-white border border-gray-700 tracking-[0.5em] text-center"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                maxLength={6}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold text-white transition"
          >
            {loading ? "Please wait..." : step === "email" ? "Send OTP" : "Verify OTP"}
          </button>

          <div className="text-center">
            <Link to="/login" className="text-sm text-gray-300 hover:text-red-400 hover:underline transition">
              Back to Login
            </Link>
          </div>
        </form>

        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
            <div className="w-full max-w-md rounded-2xl border border-red-600 bg-black/95 p-8 shadow-2xl">
              <h2 className="text-2xl font-bold text-red-600 text-center mb-4">Set New Password</h2>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <input
                  type="password"
                  placeholder="New Password"
                  className="w-full px-4 py-3 rounded bg-gray-900 text-white border border-gray-700"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 rounded bg-gray-900 text-white border border-gray-700"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold text-white transition"
                >
                  {loading ? "Updating..." : "Update Password"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="w-full text-sm text-gray-300 hover:text-white transition"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
