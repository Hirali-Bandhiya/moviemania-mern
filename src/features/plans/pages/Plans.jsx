import { useEffect, useState } from "react";
import api from "../../../services/api";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import PlanCard from "../components/PlanCard";

const normalizePlan = (plan) => ({
  ...plan,
  amount: Number(plan?.amount ?? plan?.pricing?.monthly ?? 0),
  priceLabel: plan?.priceLabel || `₹${Number(plan?.amount ?? plan?.pricing?.monthly ?? 0)} / month`,
  isPopular: Boolean(plan?.isPopular ?? plan?.popular),
  features: Array.isArray(plan?.features) ? plan.features : [],
  active: plan?.active !== false,
});

function Plans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPlans = async () => {
      try {
        const { data } = await api.get("/plans");
        const plansData = Array.isArray(data)
          ? data.map(normalizePlan).filter((plan) => plan.active)
          : [];
        setPlans(plansData);
        setError("");
      } catch (error) {
        console.error("Failed to load plans", error);
        setPlans([]);
        setError("Failed to load subscription plans.");
      } finally {
        setLoading(false);
      }
    };

    loadPlans();
  }, []);

  return (
    <div className="bg-[#0f172a] min-h-screen text-white flex flex-col pt-20">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16 w-full max-w-7xl mx-auto">
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="text-5xl font-black mb-6 drop-shadow-lg tracking-tight">
            Choose the specific plan that's <span className="text-[#E50914]">right for you.</span>
          </h1>
          <p className="text-xl text-gray-300 font-medium leading-relaxed">
            Downgrade or upgrade at any time. No commitments, cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {loading ? (
            <div className="col-span-full flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
            </div>
          ) : error ? (
            <div className="col-span-full text-center py-16 text-red-400">
              {error}
            </div>
          ) : plans.length > 0 ? (
            plans.map((plan) => (
              <PlanCard key={plan._id || plan.planCode || plan.name} plan={plan} />
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-gray-400">
              No subscription plans found.
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Plans;