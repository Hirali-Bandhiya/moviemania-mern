import { useState, useEffect } from "react";
import api from "../services/api";
import AdminSidebar from "./components/AdminSidebar";
import AdminNavbar from "./components/AdminNavbar";
import FormModal from "./components/FormModal";
import AdminForm from "./components/AdminForm";
import { getImageUrl } from "../utils/imageHelper";

const imageModules = import.meta.glob("../assets/images/*.{png,jpg,jpeg,webp,avif,gif,svg}", {
  eager: true,
  import: "default",
});

const imageOptions = Object.keys(imageModules)
  .map((path) => path.split("/").pop())
  .filter(Boolean)
  .sort((a, b) => a.localeCompare(b))
  .map((filename) => ({ value: filename, label: filename }));

function AdminSeries() {
  const [seriesList, setSeriesList] = useState([]);
  const [filteredSeries, setFilteredSeries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [genreFilter, setGenreFilter] = useState("All");
  const [yearFilter, setYearFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeries, setEditingSeries] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    year: "",
    image: "",
    videoUrl: "",
    trailerUrl: "",
    category: "",
    rating: "",
    industry: "Hollywood"
  });
  const [errors, setErrors] = useState({});
  const [posterPreview, setPosterPreview] = useState("");

  const itemsPerPage = 10;

  // Load series from backend
  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      const { data } = await api.get("/series");
      const seriesOnly = Array.isArray(data) ? data : [];
      setSeriesList(seriesOnly);
      setFilteredSeries(seriesOnly);
    } catch (error) {
      console.error("Failed to load series", error);
      setSeriesList([]);
      setFilteredSeries([]);
    }
  };

  useEffect(() => {
    const normalizedSearch = searchTerm.toLowerCase();
    const normalizedGenre = String(genreFilter || "All").toLowerCase();

    const filtered = seriesList.filter((series) => {
      const title = String(series.title || "").toLowerCase();
      const genre = String(series.genre || "").toLowerCase();
      const year = String(series.year || "");

      const searchMatch =
        title.includes(normalizedSearch) || genre.includes(normalizedSearch);
      const genreMatch =
        normalizedGenre === "all" || genre === normalizedGenre;
      const yearMatch = yearFilter === "All" || year === String(yearFilter);

      return searchMatch && genreMatch && yearMatch;
    });

    setFilteredSeries(filtered);
    setCurrentPage(1);
  }, [searchTerm, genreFilter, yearFilter, seriesList]);

  const tableGenreOptions = [
    "All",
    ...Array.from(
      new Set(seriesList.map((series) => String(series.genre || "").trim()).filter(Boolean))
    ).sort((a, b) => a.localeCompare(b)),
  ];

  const tableYearOptions = [
    "All",
    ...Array.from(
      new Set(seriesList.map((series) => String(series.year || "").trim()).filter(Boolean))
    ).sort((a, b) => Number(b) - Number(a)),
  ];

  const isForbiddenDemoUrl = (url) => {
    const value = String(url || "").toLowerCase();
    return (
      value.includes("w3schools.com/html/mov_bbb.mp4") ||
      value.includes("gtv-videos-bucket/sample/") ||
      value.includes("commondatastorage.googleapis.com") ||
      value.includes("storage.googleapis.com")
    );
  };

  const validate = () => {
    let newErrors = {};

    if (!formData.title?.trim()) newErrors.title = "Title is required.";
    if (!formData.industry) newErrors.industry = "Industry is required.";
    if (!formData.genre) newErrors.genre = "Genre is required.";
    if (!formData.year) newErrors.year = "Year is required.";
    if (!formData.image?.trim()) newErrors.image = "Poster URL is required.";
    const hasVideoUrl = Boolean(formData.videoUrl?.trim());
    const hasTrailerUrl = Boolean(formData.trailerUrl?.trim());
    if (!hasVideoUrl && !hasTrailerUrl) {
      newErrors.videoUrl = "Add Video URL or Trailer URL.";
      newErrors.trailerUrl = "Add Trailer URL or Video URL.";
    }

    if (hasVideoUrl && isForbiddenDemoUrl(formData.videoUrl)) {
      newErrors.videoUrl = "Demo/blocked video URL is not allowed. Use a real series source.";
    }

    if (hasTrailerUrl && isForbiddenDemoUrl(formData.trailerUrl)) {
      newErrors.trailerUrl = "Demo/blocked trailer URL is not allowed. Use a real trailer source.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "image") {
      setPosterPreview(getImageUrl(value));
    }

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select a valid image file." }));
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const imageValue = String(reader.result || "");
      setFormData((prev) => ({ ...prev, image: imageValue }));
      setPosterPreview(imageValue);
      setErrors((prev) => ({ ...prev, image: "" }));
    };
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    setEditingSeries(null);
    setFormData({
      title: "",
      genre: "",
      year: "",
      image: "",
      videoUrl: "",
      trailerUrl: "",
      category: "",
      rating: "",
      industry: "Hollywood"
    });
    setPosterPreview("");
    setErrors({});
    setIsModalOpen(true);
  };

  const handleEdit = (series) => {
    setEditingSeries(series);
    setFormData({
      title: series.title,
      genre: series.genre,
      year: series.year,
      image: series.image,
      videoUrl: series.videoUrl || "",
      trailerUrl: series.trailerUrl || "",
      category: series.category || "",
      rating: series.rating ? series.rating : "",
      industry: series.industry || "Hollywood"
    });
    setPosterPreview(getImageUrl(series.image));
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this series?")) return;

    try {
      await api.delete(`/series/${id}`);
      await loadSeries();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete series");
    }
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...formData,
      year: formData.year ? Number(formData.year) : undefined,
      rating: formData.rating ? Number(formData.rating) : undefined,
    };

    try {
      if (editingSeries?._id) {
        await api.put(`/series/${editingSeries._id}`, payload);
      } else {
        await api.post("/series", payload);
      }

      await loadSeries();
      setIsModalOpen(false);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to save series");
    }
  };

  const totalPages = Math.ceil(filteredSeries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSeries = filteredSeries.slice(startIndex, startIndex + itemsPerPage);

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1999 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  const ratingOptions = Array.from({ length: 10 }, (_, i) => {
    const rating = i + 1;
    return { value: rating.toString(), label: rating.toString() };
  });

  const genreOptions = [
    { value: "Action", label: "Action" },
    { value: "Comedy", label: "Comedy" },
    { value: "Drama", label: "Drama" },
    { value: "Thriller", label: "Thriller" },
    { value: "Sci-Fi", label: "Sci-Fi" },
    { value: "Romance", label: "Romance" },
    { value: "Horror", label: "Horror" },
  ];

  const categoryOptions = [
    { value: "Movie", label: "Movie" },
    { value: "Series", label: "Series" },
    { value: "Documentary", label: "Documentary" },
    { value: "Kids", label: "Kids" },
  ];

  const industryOptions = [
    { value: "Hollywood", label: "Hollywood" },
    { value: "Bollywood", label: "Bollywood" },
  ];

  const seriesFormFields = [
    { name: "title", label: "Title", type: "text", required: true, placeholder: "Enter series title" },
    { name: "industry", label: "Industry", type: "select", required: true, options: industryOptions },
    { name: "genre", label: "Genre", type: "select", required: true, options: genreOptions },
    { name: "year", label: "Year", type: "select", required: true, options: yearOptions },
    { name: "image", label: "Series Image", type: "select", required: true, options: imageOptions },
    { name: "videoUrl", label: "Video URL", type: "text", placeholder: "Enter video stream URL" },
    { name: "trailerUrl", label: "Trailer URL", type: "text", placeholder: "Enter Youtube Trailer URL" },
    { name: "category", label: "Category", type: "select", options: categoryOptions },
    { name: "rating", label: "Rating", type: "select", options: ratingOptions }
  ];

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-gray-200 font-sans selection:bg-red-500/30">
      <AdminSidebar />
      <div className="flex-1 ml-64 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <AdminNavbar />
        <div className="p-8 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Series Management</h2>
            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-[1.02]"
            >
              Add New Series
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Search series by title or genre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 w-full bg-[#1e293b]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-white backdrop-blur-md transition-all placeholder-gray-500 shadow-inner shadow-black/20"
            />

            <select
              value={genreFilter}
              onChange={(e) => setGenreFilter(e.target.value)}
              className="p-3 w-full bg-[#1e293b]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-white backdrop-blur-md transition-all"
            >
              {tableGenreOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={yearFilter}
              onChange={(e) => setYearFilter(e.target.value)}
              className="p-3 w-full bg-[#1e293b]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-white backdrop-blur-md transition-all"
            >
              {tableYearOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-xs tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Image</th>
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Industry</th>
                  <th className="p-4 font-semibold">Genre</th>
                  <th className="p-4 font-semibold">Year</th>
                  <th className="p-4 font-semibold">Rating</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {paginatedSeries.map((series) => (
                  <tr key={series._id || series.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <img
                        src={getImageUrl(series.image || series.posterUrl)}
                        alt={series.title || "Series"}
                        className="w-16 h-10 object-cover rounded border border-white/10"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80x48?text=No+Image";
                        }}
                      />
                    </td>
                    <td className="p-4 font-medium text-white">
                      {series.title}
                    </td>
                    <td className="p-4 text-gray-400">
                      {series.industry || "Hollywood"}
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/20">
                        {series.genre}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">
                      {series.year}
                    </td>
                    <td className="p-4 text-gray-400">
                      {series.rating || "N/A"}
                    </td>
                    <td className="p-4 text-right space-x-4">
                      <button
                        onClick={() => handleEdit(series)}
                        className="text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(series._id)}
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

      {/* Modal */}
      <FormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingSeries ? "Edit Series" : "Add New Series"}
      >
        <AdminForm
          fields={seriesFormFields}
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          submitLabel={editingSeries ? "Update" : "Add"}
          onCancel={() => setIsModalOpen(false)}
          beforeActions={(
            <div className="mt-4">
              <label className="block text-sm font-semibold text-gray-300 mb-1 tracking-wide">
                Or Upload Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 file:mr-3 file:px-3 file:py-1.5 file:border-0 file:rounded-lg file:bg-red-600 file:text-white file:font-medium hover:border-white/30 transition-all"
              />
            </div>
          )}
        />

        {posterPreview && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Poster Preview</h4>
            <img
              src={posterPreview}
              alt="Poster preview"
              className="w-full h-64 object-cover rounded-md border border-white/10"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/300x400?text=Invalid+Image+URL";
              }}
            />
          </div>
        )}
      </FormModal>
    </div>
  );
}

export default AdminSeries;