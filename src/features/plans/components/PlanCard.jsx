import { useNavigate } from "react-router-dom";
import { storePendingPlanSelection } from "../../../utils/planSelection";

function PlanCard({ plan }) {
  const navigate = useNavigate();

  const handleChoosePlan = () => {
    const selectedPlan = storePendingPlanSelection({
      planId: plan.name,
      name: plan.name,
      amount: plan.amount,
      priceLabel: plan.priceLabel,
      billingCycle: plan.billingCycle || "monthly",
      description: plan.description,
    });

    navigate(`/register`, { state: { plan: selectedPlan } });
  };

  return (
    <div className={`flex flex-col rounded-2xl p-8 relative overflow-hidden transition-all duration-300 hover:scale-105 shadow-2xl ${
      plan.isPopular ? "border-2 border-[#E50914] bg-gradient-to-b from-red-900/30 to-[#0f172a]/90" : "bg-[#1e293b]/70 border border-white/10"
    }`}>
      {plan.isPopular && (
        <div className="absolute top-0 right-0 bg-[#E50914] font-bold text-xs uppercase tracking-wider py-1 px-8 translate-x-6 translate-y-4 rotate-45 shadow-lg">
          Most Popular
        </div>
      )}

      <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
      <p className="text-gray-400 text-sm h-12">{plan.description}</p>

      <div className="my-6">
        <span className="text-5xl font-extrabold text-white">{plan.priceLabel}</span>
      </div>

      <div className="flex-1 space-y-4 mb-8">
        {plan.features.map((feature, i) => (
          <div key={i} className="flex items-start gap-3 text-gray-300">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span className="font-medium text-sm leading-tight">{feature}</span>
          </div>
        ))}
      </div>

      <button
        onClick={handleChoosePlan}
        className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg ${
          plan.isPopular 
            ? "bg-[#E50914] hover:bg-red-700 text-white shadow-red-500/30 hover:scale-[1.02]" 
            : "bg-white/10 hover:bg-white/20 text-white hover:scale-[1.02]"
        }`}
      >
        Choose Plan
      </button>
    </div>
  );
}

export default PlanCard;
