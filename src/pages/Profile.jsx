import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";
import PaymentHistory from "../features/PaymentHistory";
import { getRecentlyWatched } from "../utils/history";
import { getCurrentUser, logout, updateCurrentUser } from "../utils/auth";
import { normalizePlanSelection } from "../utils/planSelection";
import { getWishlist } from "../features/wishlist/utils/wishlistHelper";

const getCurrentPlanDisplayName = (plan) => {
  const rawName = String(plan?.name || plan?.planId || "").trim();
  if (!rawName) {
    return "";
  }

  if (rawName === "Family Pack") return "Family";
  if (rawName === "Basic Plan") return "Basic";
  if (rawName === "Premium Plan") return "Premium";
  if (rawName === "Standard Plan") return "Standard";
  if (rawName === "Yearly Offer") return "Yearly";
  if (rawName === "Free Trial") return "Trial";
  if (rawName === "Student Discount") return "Student";
  if (rawName === "Festival Offer") return "Festival";

  return rawName.replace(/\b(Plan|Pack|Offer|Discount)\b$/i, "").trim() || rawName;
};

function Profile() {

  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refCode, setRefCode] = useState("");
  const [message, setMessage] = useState("");

  const resolveCurrentPlan = (currentUser) => {
    const planInput =
      currentUser?.subscriptionPlan ||
      currentUser?.plan ||
      localStorage.getItem("subscriptionPlan") ||
      localStorage.getItem("selectedPlan") ||
      "";

    return normalizePlanSelection(planInput);
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        const { data } = await api.get("/users/me");
        const profile = { ...currentUser, ...data };

        if (!profile.referralCode) {
          profile.referralCode = "REF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
        }

        updateCurrentUser(profile);
        setUser(profile);
        setError("");
      } catch (err) {
        console.error("Failed to load profile", err);
        const fallbackUser = { ...currentUser };

        if (!fallbackUser.referralCode) {
          fallbackUser.referralCode = "REF-" + Math.random().toString(36).substring(2, 8).toUpperCase();
          updateCurrentUser({ referralCode: fallbackUser.referralCode });
        }

        setUser(fallbackUser);
        setError("");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [navigate]);

  useEffect(() => {
    const handleStorageChange = () => {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleApplyReferral = () => {
    if (!refCode.trim()) {
      setMessage({ type: "error", text: "Please enter a code" });
      return;
    }
    if (refCode === user.referralCode) {
      setMessage({ type: "error", text: "You cannot use your own code" });
      return;
    }
    
    // In a real app we would validate against backend. Here we simulate.
    setMessage({ type: "success", text: "Referral applied successfully! 🎉 You got 1 free month." });
    
    // Simulate updating subscription locally
    const updatedUser = { ...user, subscriptionPlan: "Premium" };
    setUser(updatedUser);
    updateCurrentUser({ subscriptionPlan: "Premium", plan: "Premium" });
  };

  if (loading) {
    return (
      <div className="bg-black text-white min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const currentPlan = resolveCurrentPlan(user);
  const currentPlanLabel = getCurrentPlanDisplayName(currentPlan);
  const wishlistCount = Math.max(
    getWishlist().length,
    Array.isArray(user.wishlist) ? user.wishlist.length : 0,
    user.wishlistCount || 0
  );

  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <div className="pt-28 px-6 lg:px-12 flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {error && (
          <div className="w-full text-sm text-red-400">{error}</div>
        )}
        
        {/* Profile Card */}
        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl w-full md:w-1/3 h-fit flex flex-col">
          <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
             <span className="bg-red-600 w-2 h-8 rounded-full"></span> Profile
          </h1>

          <div className="mb-6 pb-6 border-b border-gray-800">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Name</p>
            <p className="text-xl font-medium">{user.name}</p>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-800">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Email</p>
            <p className="text-xl font-medium">{user.email}</p>
          </div>

          <div className="mb-6 pb-6 border-b border-gray-800">
            <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-1">Current Plan</p>
            <p className="text-xl font-medium text-red-500">{currentPlanLabel || "No Subscription"}</p>
          </div>
          
          <div className="flex flex-col gap-3 mt-auto">
            <button
              onClick={() => navigate('/edit-profile')}
              className="bg-white text-black font-bold px-6 py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Edit Profile
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 transition px-6 py-3 rounded-xl font-bold text-white w-full"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Info & Referral */}
        <div className="flex-1 flex flex-col gap-8">
          
          {/* Stats */}
          <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl flex gap-12">
            <div>
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">Total Watched</p>
              <p className="text-4xl font-black">{getRecentlyWatched().length}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-2">My Wishlist</p>
              <p className="text-4xl font-black">{wishlistCount}</p>
            </div>
          </div>

          {/* Referral System */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 p-8 rounded-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              Referral Rewards
            </h2>
            
            <div className="bg-black/50 p-6 rounded-xl border border-gray-800 mb-8">
              <p className="text-gray-300 mb-2">Share your referral code and get a <strong className="text-white">Free Premium Month</strong>!</p>
              <div className="flex items-center gap-4 mt-4">
                <code className="bg-gray-800 px-6 py-3 rounded-lg text-2xl font-black tracking-widest text-red-500 flex-1 text-center select-all">
                  {user.referralCode}
                </code>
              </div>
            </div>

            <h3 className="text-lg font-bold mb-4">Have a friend's code?</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter referal code"
                value={refCode}
                onChange={(e) => setRefCode(e.target.value.toUpperCase())}
                className="flex-1 px-5 py-3 rounded-xl bg-white/5 text-white border border-gray-700 outline-none focus:border-red-500 focus:bg-white/10 transition"
              />
              <button 
                onClick={handleApplyReferral} 
                className="bg-white text-black font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition"
              >
                Apply
              </button>
            </div>
            
            {message && (
              <p className={`mt-4 font-medium p-4 rounded-lg flex items-center gap-2 ${message.type === 'error' ? 'bg-red-900/40 text-red-400' : 'bg-green-900/40 text-green-400'}`}>
                {message.text}
              </p>
            )}
          </div>

          {/* Payment History */}
          <PaymentHistory />

        </div>

      </div>
    </div>
  );
}

export default Profile;