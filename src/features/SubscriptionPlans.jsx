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
          Pick a subscription that fits your viewing style. You can change or cancel anytime.
        </p>

        <div className="grid gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan._id || plan.name}
              className="rounded-3xl border border-white/10 p-8 shadow-xl bg-gradient-to-br from-gray-900 via-red-600 to-red-500 bg-opacity-50 hover:shadow-2xl transition"
            >
              <h2 className="text-2xl font-semibold mb-2">{plan.name}</h2>
              <p className="text-gray-200 mb-6">{plan.description}</p>

              <div className="mb-6">
                <p className="text-5xl font-bold">
                  ₹{plan.amount}
                  <span className="text-lg font-normal text-gray-200">/month</span>
                </p>
              </div>

              <div className="space-y-2 mb-8">
                {Array.isArray(plan.features) && plan.features.map((feature, index) => (
                  <p key={index} className="text-sm text-gray-200">✅ {feature}</p>
                ))}
              </div>

              <button
                onClick={() => handleSubscribe(plan.name)}
                className="w-full py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-100 transition"
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
