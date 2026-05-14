import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { resetPasswordApi } from "../services/authService";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const result = await resetPasswordApi({ token, password });
      setMessage(result?.message || "Password updated successfully");
      setTimeout(() => navigate("/login"), 1200);
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
        <h1 className="text-red-600 text-3xl font-bold text-center mb-6">Reset Password</h1>
        <p className="text-gray-300 text-center mb-6">Create a new password for your account.</p>

        {message && <p className="text-green-400 text-center mb-4">{message}</p>}
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-3 rounded bg-gray-900 text-white border border-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <input
              type="password"
              placeholder="Confirm New Password"
              className="w-full px-4 py-3 rounded bg-gray-900 text-white border border-gray-700"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold text-white transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
