import { useState, useEffect } from "react";
import api from "../services/api";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";
import FormModal from "./components/FormModal";
import AdminForm from "./components/AdminForm";
import { getImageUrl } from "../utils/imageHelper";

function AdminOffers() {
  const [offers, setOffers] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    movieId: "",
    discountType: "percentage",
    discountValue: "",
    validTill: "",
    isActive: true
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadOffers();
    loadMovies();
  }, []);

  const loadOffers = async () => {
    try {
      const { data } = await api.get("/offers/admin/all");
      setOffers(data);
    } catch (error) {
      console.error("Failed to load offers", error);
    }
  };

  const loadMovies = async () => {
    try {
      const { data } = await api.get("/movies");
      setMovies(data.filter(m => m.type !== "series"));
    } catch (error) {
      console.error("Failed to load movies", error);
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.title?.trim()) newErrors.title = "Title is required.";
    if (!formData.movieId) newErrors.movieId = "Movie is required.";
    if (!formData.discountValue || formData.discountValue <= 0) newErrors.discountValue = "Valid discount value required.";
    if (!formData.validTill) newErrors.validTill = "Valid until date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === "checkbox" ? checked : value 
    });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const handleAdd = () => {
    setEditingOffer(null);
    setFormData({
      title: "",
      movieId: "",
      discountType: "percentage",
      discountValue: "",
      validTill: "",
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleEdit = (offer) => {
    setEditingOffer(offer);
    const validDate = offer.validTill ? new Date(offer.validTill).toISOString().split('T')[0] : "";
    setFormData({
      title: offer.title,
      movieId: offer.movieId?._id || offer.movieId || "",
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      validTill: validDate,
      isActive: offer.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Soft delete this offer?")) return;
    try {
      await api.delete(`/offers/${id}`);
      await loadOffers();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete offer");
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue)
      };

      if (editingOffer?._id) {
        await api.put(`/offers/${editingOffer._id}`, payload);
      } else {
        await api.post("/offers", payload);
      }
      await loadOffers();
      setIsModalOpen(false);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to save offer");
    }
  };

  const movieOptions = movies.map(m => ({ value: m._id, label: m.title }));
  const typeOptions = [
    { value: "percentage", label: "Percentage (%)" },
    { value: "fixed", label: "Fixed Amount ($)" }
  ];

  const formFields = [
    { name: "title", label: "Offer Title", type: "text", required: true, placeholder: "e.g., 50% Off Weekend" },
    { name: "movieId", label: "Select Movie", type: "select", required: true, options: movieOptions },
    { name: "discountType", label: "Discount Type", type: "select", required: true, options: typeOptions },
    { name: "discountValue", label: "Discount Value", type: "number", required: true, placeholder: "e.g., 50" },
    { name: "validTill", label: "Valid Until", type: "date", required: true },
    { name: "isActive", label: "Active", type: "checkbox" }
  ];

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-gray-200 font-sans selection:bg-red-500/30">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <AdminNavbar />

        <div className="p-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Offers Management</h2>
            <button onClick={handleAdd} className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-[1.02]">
              Add Offer
            </button>
          </div>

          <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-xs tracking-wider">
                  <th className="p-4 font-semibold">Movie</th>
                  <th className="p-4 font-semibold">Offer Title</th>
                  <th className="p-4 font-semibold">Discount</th>
                  <th className="p-4 font-semibold">Final Price</th>
                  <th className="p-4 font-semibold">Valid Till</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {offers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      {offer.movieId ? (
                        <div className="flex items-center gap-3">
                          <img src={getImageUrl(offer.movieId.image)} alt={offer.movieId.title} className="w-12 h-8 object-cover rounded border border-white/10" onError={(e) => {e.target.src="https://via.placeholder.com/80x48?text=No+Image";}}/>
                          <span className="text-white font-medium">{offer.movieId.title}</span>
                        </div>
                      ) : (
                        <span className="text-gray-500 italic">Deleted Movie</span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-gray-300">{offer.title}</td>
                    <td className="p-4">
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded text-xs font-bold">
                        {offer.discountType === 'percentage' ? `${offer.discountValue}% OFF` : `$${offer.discountValue} OFF`}
                      </span>
                    </td>
                    <td className="p-4 text-white font-bold">${offer.finalPrice?.toFixed(2)}</td>
                    <td className="p-4 text-gray-400">
                      {new Date(offer.validTill).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${offer.isActive ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'}`}>
                        {offer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-4">
                      <button onClick={() => handleEdit(offer)} className="text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline">Edit</button>
                      <button onClick={() => handleDelete(offer._id)} className="text-red-400 hover:text-red-300 transition-colors font-medium hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {offers.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-500">No offers found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <FormModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingOffer ? "Edit Offer" : "Add Offer"}>
        <AdminForm
          fields={formFields}
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          submitLabel={editingOffer ? "Update" : "Add"}
          onCancel={() => setIsModalOpen(false)}
        />
      </FormModal>
    </div>
  );
}

export default AdminOffers;
