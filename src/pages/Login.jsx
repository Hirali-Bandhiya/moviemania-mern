import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginUser, hasActivePlan } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const movieId = location.state?.movieId;
  const redirectAfterPayment = location.state?.redirectAfterPayment;



  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let newErrors = {};

    if (!form.email) newErrors.email = "Email cannot be blank.";
    if (!form.password) newErrors.password = "Password cannot be blank.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      setLoading(true);
      setLoginError("");

      const result = await loginUser(form.email.trim(), form.password);

      if (!result.success) {
        setLoginError(result.message);
      } else {
        // ✅ If coming from guest flow after payment, redirect to movie
        if (redirectAfterPayment && movieId) {
          navigate(`/movie/${movieId}`);
        } else if (hasActivePlan()) {
          navigate("/movies");
        } else {
          navigate("/plans");
        }
      }

      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95"></div>

      <div className="relative bg-black/75 backdrop-blur-md border border-red-600 rounded-2xl p-10 w-[420px] shadow-2xl">

        <h1 className="text-red-600 text-3xl font-bold text-center mb-6">
          MovieMania
        </h1>

        <h2 className="text-white text-2xl font-semibold text-center mb-6">
          Sign In
        </h2>

        {loginError && (
          <p className="text-red-500 text-center mb-4">
            {loginError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Email Address"
              className={`w-full px-4 py-3 rounded bg-gray-900 text-white border ${
                errors.email ? "border-red-500" : "border-gray-700"
              }`}
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
            />

            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Password"
              className={`w-full px-4 py-3 rounded bg-gray-900 text-white border ${
                errors.password ? "border-red-500" : "border-gray-700"
              }`}
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold text-white transition"
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-sm text-gray-300 hover:text-red-400 hover:underline transition"
            >
              Forgot Password?
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Login;
