import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { registerUser } from "../utils/auth";
import { readPendingPlanSelection } from "../utils/planSelection";

function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = readPendingPlanSelection(location.state?.plan);
  const movieId = location.state?.movieId;
  const redirectAfterPayment = location.state?.redirectAfterPayment;



  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name cannot be blank.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email cannot be blank.";
    } else if (!emailRegex.test(form.email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!form.password) {
      newErrors.password = "Password cannot be blank.";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password cannot be blank.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setRegisterError("");
    setRegisterSuccess("");

    if (validate()) {
      setLoading(true);

      const result = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      if (!result.success) {
        setRegisterError(result.message);
        setErrors({ email: result.message });
      } else {
        setRegisterSuccess("Registration successful. Redirecting to payment...");
        setForm({ name: "", email: "", password: "", confirmPassword: "" });
        navigate("/payment", { state: { plan: selectedPlan, movieId, redirectAfterPayment } });
      }

      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c')",
        }}
      ></div>

      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative flex items-center justify-center min-h-screen">
        <div className="bg-black/75 backdrop-blur-md border border-red-600 rounded-2xl p-10 w-[450px] shadow-2xl">

          <h1 className="text-red-600 text-3xl font-bold text-center mb-2">
            MovieMania
          </h1>

          <h2 className="text-white text-2xl font-semibold text-center mb-6">
            Create Account
          </h2>

          {registerError && (
            <p className="text-red-500 text-center mb-4">{registerError}</p>
          )}
          {registerSuccess && (
            <p className="text-green-400 text-center mb-4">{registerSuccess}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className={`w-full px-4 py-3 rounded bg-gray-900 text-white border ${
                  errors.name ? "border-red-500" : "border-gray-700"
                }`}
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name}
                </p>
              )}
            </div>

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

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                className={`w-full px-4 py-3 rounded bg-gray-900 text-white border ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-700"
                }`}
                value={form.confirmPassword}
                onChange={(e) =>
                  setForm({
                    ...form,
                    confirmPassword: e.target.value,
                  })
                }
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold text-white transition"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
            <div className="text-center mt-4">
              <span className="text-gray-400">Already have an account? </span>
              <button 
                type="button" 
                onClick={() => navigate("/login")} 
                className="text-white hover:text-red-500 hover:underline transition font-semibold"
              >
                Sign In
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;