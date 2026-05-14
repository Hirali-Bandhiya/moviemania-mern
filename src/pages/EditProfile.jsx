import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getCurrentUser, updateCurrentUser } from "../utils/auth";
import { updateProfileApi } from "../services/authService";

function EditProfile() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate("/login");
      return;
    }

    setName(user.name || "");
    setEmail(user.email || "");
  }, [navigate]);

  const handleCancel = () => {
    navigate("/profile");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const payload = { name: name.trim(), email: email.trim() };
      if (password) payload.password = password;

      const updated = await updateProfileApi(payload);

      // Update local storage user
      updateCurrentUser({ name: updated.name, email: updated.email });

      setMessage({ type: "success", text: "Profile updated successfully" });
      setTimeout(() => navigate("/profile"), 900);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Update failed" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="pt-28 px-6 lg:px-12 flex justify-center max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="w-full bg-gray-900 border border-gray-800 p-8 rounded-2xl">
          <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>

          <label className="block mb-4">
            <span className="text-gray-400 text-sm">Name</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-gray-700 outline-none focus:border-red-500"
              required
            />
          </label>

          <label className="block mb-4">
            <span className="text-gray-400 text-sm">Email</span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-gray-700 outline-none focus:border-red-500"
              required
              type="email"
            />
          </label>

          <label className="block mb-6">
            <span className="text-gray-400 text-sm">Password (leave blank to keep current)</span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-2 w-full px-4 py-3 rounded-xl bg-white/5 text-white border border-gray-700 outline-none focus:border-red-500"
              type="password"
            />
          </label>

          {message && (
            <p className={`mb-4 p-3 rounded ${message.type === 'error' ? 'bg-red-900/40 text-red-400' : 'bg-green-900/40 text-green-400'}`}>
              {message.text}
            </p>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-bold text-white"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
