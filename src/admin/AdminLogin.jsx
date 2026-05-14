import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, logout } from "../utils/auth";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!form.email) {
      newErrors.email = "Email cannot be blank";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter valid email";
    }
    if (!form.password) {
      newErrors.password = "Password cannot be blank";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const result = await loginUser(form.email.trim(), form.password);

    if (!result.success) {
      setLoginError(result.message || "Invalid admin credentials");
      return;
    }
    if (result.user?.isAdmin === true || result.user?.role === "Admin") {
      navigate("/admin");
    } else {
      logout();
      setLoginError("Invalid admin credentials");
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
      <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/95"></div>

      <div className="relative bg-black/75 backdrop-blur-md border border-red-600 rounded-2xl p-10 w-[420px] shadow-2xl">
        <h1 className="text-red-600 text-3xl font-bold text-center mb-6">
          MovieMania Admin
        </h1>

        {loginError && (
          <p className="text-red-500 text-center mb-4">{loginError}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

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
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 py-3 rounded font-semibold text-white transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;