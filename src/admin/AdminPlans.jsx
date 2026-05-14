import { useState, useEffect } from "react";
import api from "../services/api";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";
import FormModal from "./components/FormModal";
import AdminForm from "./components/AdminForm";

const defaultPlans = [
  {
    name: "Basic",
    amount: 499,
    priceLabel: "₹499 / month",
    description: "Good video quality in 720p. Watch on any phone, tablet, computer or TV.",
    isPopular: false,
    features: [
      "Access to unlimited movies and TV shows",
      "Watch on 1 supported device at a time",
      "Watch in HD (720p)",
      "Downloads on 1 supported device"
    ]
  },
  {
    name: "Family",
    amount: 1499,
    priceLabel: "₹1499 / month",
    description: "Great video quality in 1080p. Best for small screens and laptops.",
    isPopular: true,
    features: [
      "Access to unlimited movies and TV shows",
      "Watch on 2 supported devices at a time",
      "Watch in Full HD (1080p)",
      "Downloads on 2 supported devices",
      "Ad-free experience"
    ]
  },
  {
    name: "Premium",
    amount: 999,
    priceLabel: "₹999 / month",
    description: "Our best video quality in 4K+HDR. The ultimate experience.",
    isPopular: false,
    features: [
      "Access to unlimited movies and TV shows",
      "Watch on 4 supported devices at a time",
      "Watch in Ultra HD (4K) and HDR",
      "Downloads on 6 supported devices",
      "Ad-free experience",
      "Spatial audio"
    ]
  }
];

const normalizePlan = (plan) => ({
  ...plan,
  amount: Number(plan?.amount ?? plan?.pricing?.monthly ?? 0),
  priceLabel: plan?.priceLabel || `₹${Number(plan?.amount ?? plan?.pricing?.monthly ?? 0)} / month`,
  isPopular: Boolean(plan?.isPopular ?? plan?.popular),
  features: Array.isArray(plan?.features) ? plan.features : [],
});

function AdminPlans() {
  const [plansList, setPlans] = useState([]);
  const [filteredPlans, setFilteredPlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    priceLabel: "",
    amount: "",
    description: "",
    features: [],
    isPopular: false
  });

  const [errors, setErrors] = useState({});

  const itemsPerPage = 10;

  // Load plans from backend
  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data } = await api.get("/plans");
      const plansData = Array.isArray(data) && data.length > 0 ? data.map(normalizePlan) : defaultPlans;
      setPlans(plansData);
      setFilteredPlans(plansData);
    } catch (error) {
      console.error("Failed to load plans", error);
      setPlans(defaultPlans);
      setFilteredPlans(defaultPlans);
    }
  };

  // SEARCH
  useEffect(() => {
    const filtered = plansList.filter((plan) =>
      plan.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPlans(filtered);
    setCurrentPage(1);
  }, [searchTerm, plansList]);

  // VALIDATION
  const validate = () => {
    let newErrors = {};

    if (!formData.name?.trim()) newErrors.name = "Plan name is required.";
    if (!formData.priceLabel?.trim()) newErrors.priceLabel = "Price label is required.";
    if (!formData.amount) newErrors.amount = "Amount is required.";
    if (!formData.description?.trim()) newErrors.description = "Description is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // ADD BUTTON CLICK
  const handleAdd = () => {
    setEditingPlan(null);
    setFormData({
      name: "",
      priceLabel: "",
      amount: "",
      description: "",
      features: [],
      isPopular: false
    });
    setIsModalOpen(true);
  };

  // EDIT BUTTON CLICK
  const handleEdit = (plan) => {
    setEditingPlan(plan);
    setFormData({
      name: plan.name,
      priceLabel: plan.priceLabel,
      amount: plan.amount,
      description: plan.description,
      features: plan.features || [],
      isPopular: plan.isPopular || false
    });
    setIsModalOpen(true);
  };

  // DELETE BUTTON CLICK
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this plan?")) return;

    try {
      await api.delete(`/plans/${id}`);
      await loadPlans();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete plan");
    }
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...formData,
      amount: formData.amount ? Number(formData.amount) : undefined,
    };

    try {
      if (editingPlan?._id) {
        await api.put(`/plans/${editingPlan._id}`, payload);
      } else {
        await api.post("/plans", payload);
      }

      await loadPlans();
      setIsModalOpen(false);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to save plan");
    }
  };

  // PAGINATION
  const totalPages = Math.ceil(filteredPlans.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlans = filteredPlans.slice(startIndex, startIndex + itemsPerPage);

  const planFormFields = [
    { name: "name", label: "Plan Name", type: "text", required: true, placeholder: "Enter plan name" },
    { name: "priceLabel", label: "Price Label", type: "text", required: true, placeholder: "e.g., ₹499 / month" },
    { name: "amount", label: "Amount", type: "number", required: true, placeholder: "Enter amount" },
    { name: "description", label: "Description", type: "textarea", required: true, placeholder: "Enter plan description" },
  ];

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-gray-200 font-sans selection:bg-red-500/30">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <AdminNavbar />

        <div className="p-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Plans Management</h2>

            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-[1.02]"
            >
              Create Plan
            </button>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search plans..."
            className="mb-8 p-3 w-full bg-[#1e293b]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-white backdrop-blur-md transition-all placeholder-gray-500 shadow-inner shadow-black/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* TABLE */}
          <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-xs tracking-wider">
                  <th className="p-4 font-semibold">Name</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Amount</th>
                  <th className="p-4 font-semibold">Popular</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {paginatedPlans.map((plan) => (
                  <tr key={plan._id || plan.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4 font-medium text-white">{plan.name}</td>
                    <td className="p-4 text-gray-400">{plan.priceLabel}</td>
                    <td className="p-4 text-gray-400">₹{plan.amount}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        plan.isPopular
                          ? "bg-red-500/20 text-red-300 border border-red-500/20"
                          : "bg-gray-500/20 text-gray-300 border border-gray-500/20"
                      }`}>
                        {plan.isPopular ? "Yes" : "No"}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-4">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(plan._id)}
                        className="text-red-400 hover:text-red-300 transition-colors font-medium hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 mx-1 rounded ${
                    currentPage === page
                      ? "bg-red-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 mx-1 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingPlan ? "Edit Plan" : "Create Plan"}
      >
        <AdminForm
          fields={planFormFields}
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          submitLabel={editingPlan ? "Update" : "Create"}
          onCancel={() => setIsModalOpen(false)}
        />
        
        <div className="mt-4">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-300 mb-1 tracking-wide cursor-pointer">
            <input
              type="checkbox"
              name="isPopular"
              checked={formData.isPopular}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-gray-400 cursor-pointer"
            />
            Mark as Popular/Featured
          </label>
        </div>
      </FormModal>
    </div>
  );
}

export default AdminPlans;
