import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";

function SubscriptionPlans() {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await api.get("/plans");
        setPlans(Array.isArray(data) && data.length > 0 ? data : []);
      } catch (error) {
        console.error("Failed to load plans", error);
        setPlans([]);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = (planId) => {
    navigate(`/payment?plan=${planId}`);
  };

  return (
    <div className="bg-black min-h-screen text-white px-6 py-14">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Choose your plan</h1>
        <p className="text-gray-300 mb-10">
          Pick a subscription that fits your viewing style.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan._id || plan.name}
              className="rounded-3xl border border-white/10 p-8 shadow-xl bg-gradient-to-br from-gray-900 to-red-900 bg-opacity-50 hover:shadow-2xl transition"
            >
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-gray-200 mb-6">₹{plan.amount}/month</p>

              <ul className="mb-8 space-y-2">
                {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-200">✅ {feature}</li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.name)}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition"
              >
                Subscribe
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SubscriptionPlans;