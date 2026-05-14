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

function AdminMovies() {
  const [movieList, setMovieList] = useState([]);
  const [filteredMovies, setFilteredMovies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    year: "",
    image: "",
    videoUrl: "",
    trailerUrl: "",
    category: "",
    rating: "",
    duration: ""
  });

  const [errors, setErrors] = useState({});
  const [posterPreview, setPosterPreview] = useState("");

  const itemsPerPage = 10;

  // Load movies from backend
  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    try {
      const { data } = await api.get("/movies");
      const moviesOnly = (data || []).filter((movie) => String(movie.type || "").toLowerCase() !== "series");
      setMovieList(moviesOnly);
      setFilteredMovies(moviesOnly);
    } catch (error) {
      console.error("Failed to load movies", error);
      setMovieList([]);
      setFilteredMovies([]);
    }
  };

  // 🔍 SEARCH
  useEffect(() => {
    const filtered = movieList.filter((movie) =>
      movie.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      movie.genre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMovies(filtered);
    setCurrentPage(1);
  }, [searchTerm, movieList]);

  // ✅ VALIDATION
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
    if (!formData.genre) newErrors.genre = "Genre is required.";
    if (!formData.year) newErrors.year = "Year is required.";
    if (!formData.image?.trim()) newErrors.image = "Image URL is required.";
    const hasVideoUrl = Boolean(formData.videoUrl?.trim());
    const hasTrailerUrl = Boolean(formData.trailerUrl?.trim());
    if (!hasVideoUrl && !hasTrailerUrl) {
      newErrors.videoUrl = "Add Video URL or Trailer URL.";
      newErrors.trailerUrl = "Add Trailer URL or Video URL.";
    }

    if (hasVideoUrl && isForbiddenDemoUrl(formData.videoUrl)) {
      newErrors.videoUrl = "Demo/blocked video URL is not allowed. Use a real movie source.";
    }

    if (hasTrailerUrl && isForbiddenDemoUrl(formData.trailerUrl)) {
      newErrors.trailerUrl = "Demo/blocked trailer URL is not allowed. Use a real trailer source.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // INPUT CHANGE
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

  // ADD BUTTON CLICK
  const handleAdd = () => {
    setEditingMovie(null);
    setFormData({
      title: "",
      genre: "",
      year: "",
      image: "",
      videoUrl: "",
      trailerUrl: "",
      category: "",
      rating: "",
      duration: ""
    });
    setPosterPreview("");
    setIsModalOpen(true);
  };

  // EDIT
  const handleEdit = (movie) => {
    setEditingMovie(movie);

    setFormData({
      title: movie.title,
      genre: movie.genre,
      year: movie.year,
      image: movie.image,
      videoUrl: movie.videoUrl,
      trailerUrl: movie.trailerUrl || "",
      category: movie.category || "",
      rating: movie.rating || "",
      duration: movie.duration || ""
    });

    setPosterPreview(getImageUrl(movie.image));
    setIsModalOpen(true);
  };

  // DELETE
  const handleDelete = async (_id) => {
    if (!window.confirm("Delete this movie?")) return;

    try {
      await api.delete(`/movies/${_id}`);
      await loadMovies();
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to delete movie");
    }
  };

  // SUBMIT (ADD / UPDATE) LOCAL STATE CRUD
  const handleSubmit = async () => {
    if (!validate()) return;

    const payload = {
      ...formData,
      type: "movie",
      year: formData.year ? Number(formData.year) : undefined,
      rating: formData.rating ? Number(formData.rating) : undefined,
      duration: formData.duration ? Number(formData.duration) : undefined,
    };

    try {
      if (editingMovie?._id) {
        await api.put(`/movies/${editingMovie._id}`, payload);
      } else {
        await api.post("/movies", payload);
      }

      await loadMovies();
      setIsModalOpen(false);
    } catch (error) {
      alert(error?.response?.data?.message || "Failed to save movie");
    }
  };

  // PAGINATION
  const totalPages = Math.ceil(filteredMovies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMovies = filteredMovies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

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

  const movieFormFields = [
    { name: "title", label: "Title", type: "text", required: true, placeholder: "Enter movie title" },
    { name: "genre", label: "Genre", type: "select", required: true, options: genreOptions },
    { name: "year", label: "Year", type: "select", required: true, options: yearOptions },
    { name: "image", label: "Movie Image", type: "select", required: true, options: imageOptions },
    { name: "videoUrl", label: "Video URL", type: "text", placeholder: "Enter video stream URL" },
    { name: "trailerUrl", label: "Trailer URL", type: "text", placeholder: "Enter Youtube trailer URL" },
    { name: "category", label: "Category", type: "select", options: categoryOptions },
    { name: "rating", label: "Rating", type: "select", options: ratingOptions },
    { name: "duration", label: "Duration", type: "number", placeholder: "Duration in mins" }
  ];

  return (
    <div className="flex bg-[#0f172a] min-h-screen text-gray-200 font-sans selection:bg-red-500/30">
      <AdminSidebar />

      <div className="flex-1 ml-64 flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        <AdminNavbar />

        <div className="p-8 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-sm">Movies Management</h2>

            <button
              onClick={handleAdd}
              className="bg-gradient-to-r from-red-600 to-red-800 hover:from-red-500 hover:to-red-700 text-white font-bold px-6 py-2.5 rounded-xl shadow-lg shadow-red-600/30 transition-all duration-300 hover:scale-[1.02]"
            >
              Add Movie
            </button>
          </div>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search movies..."
            className="mb-8 p-3 w-full bg-[#1e293b]/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-red-600 outline-none text-white backdrop-blur-md transition-all placeholder-gray-500 shadow-inner shadow-black/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* TABLE */}
          <div className="bg-[#1e293b]/50 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-xl shadow-black/20">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 border-b border-white/10 text-gray-400 uppercase text-xs tracking-wider">
                  <th className="p-4 font-semibold">Image</th>
                  <th className="p-4 font-semibold">Title</th>
                  <th className="p-4 font-semibold">Genre</th>
                  <th className="p-4 font-semibold">Year</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5">
                {paginatedMovies.map((movie) => (
                  <tr key={movie._id || movie.id} className="hover:bg-white/5 transition-colors group">
                    <td className="p-4">
                      <img
                        src={getImageUrl(movie.image || movie.posterUrl)}
                        alt={movie.title || "Movie"}
                        className="w-16 h-10 object-cover rounded border border-white/10"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/80x48?text=No+Image";
                        }}
                      />
                    </td>
                    <td className="p-4 font-medium text-white">{movie.title}</td>
                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/20">
                        {movie.genre}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400">{movie.year}</td>

                    <td className="p-4 text-right space-x-4">
                      <button onClick={() => handleEdit(movie)} className="text-blue-400 hover:text-blue-300 transition-colors font-medium hover:underline">
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(movie._id)}
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
        title={editingMovie ? "Edit Movie" : "Add Movie"}
      >
        <AdminForm
          fields={movieFormFields}
          formData={formData}
          errors={errors}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          submitLabel={editingMovie ? "Update" : "Add"}
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

export default AdminMovies;