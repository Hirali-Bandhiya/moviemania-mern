import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser, updateCurrentUser } from "../utils/auth";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";

function AdminProfile() {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    role: currentUser?.role || "",
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name || !formData.name.trim()) {
      newErrors.name = "Full Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Full Name must be at least 2 characters";
    } else if (formData.name.trim().length > 50) {
      newErrors.name = "Full Name must not exceed 50 characters";
    }

    if (!formData.email || !formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.role || !formData.role.trim()) {
      newErrors.role = "Role is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = () => {
    if (!validateForm()) {
      setMessage("");
      return;
    }
    updateCurrentUser(formData);
    setMessage("Profile updated successfully!");
    setIsEditing(false);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleCancel = () => {
    setFormData({
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      role: currentUser?.role || "",
    });
    setErrors({});
    setIsEditing(false);
  };

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-gray-200 font-sans selection:bg-red-500/30">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-[30rem] h-[30rem] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <AdminNavbar />
        <div className="p-8 relative z-10">
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate("/admin")}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Admin Profile</h2>
          </div>

          {/* Profile Card */}
          <div className="max-w-2xl bg-[#1e293b]/50 backdrop-blur-md rounded-2xl shadow-xl shadow-black/20 p-8 border border-white/5">
            
            {message && (
              <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-xl text-green-400 text-sm">
                {message}
              </div>
            )}

            <div className="flex items-center gap-6 mb-8">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center font-bold text-white shadow-lg shadow-purple-500/20">
                {currentUser?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'AD'}
              </div>
              <div>
                <p className="text-xl font-bold text-white">{currentUser?.name || 'Admin User'}</p>
                <p className="text-red-500 font-medium">{currentUser?.role || 'Superadmin'}</p>
              </div>
            </div>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className={`w-full px-4 py-2 bg-[#0f172a]/50 border rounded-lg text-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition ${
                    errors.name
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-red-500/50"
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  disabled
                  className={`w-full px-4 py-2 bg-[#0f172a]/50 border rounded-lg text-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.email ? "border-red-500" : "border-white/10"
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.email}</p>
                )}
                {!errors.email && (
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  disabled
                  className={`w-full px-4 py-2 bg-[#0f172a]/50 border rounded-lg text-gray-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed ${
                    errors.role ? "border-red-500" : "border-white/10"
                  }`}
                />
                {errors.role && (
                  <p className="text-xs text-red-500 font-medium mt-1">{errors.role}</p>
                )}
                {!errors.role && (
                  <p className="text-xs text-gray-400 mt-1">Role cannot be changed</p>
                )}
              </div>
            </form>

            <div className="mt-8 flex gap-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminProfile;
