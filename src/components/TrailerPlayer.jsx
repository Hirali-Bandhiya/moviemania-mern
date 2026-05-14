import { useNavigate } from "react-router-dom";

function TrailerPlayer({ trailerUrl }) {
  const navigate = useNavigate();

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Trailer</h3>
      <div className="aspect-video w-full max-w-4xl mx-auto mb-6">
        <iframe
          src={trailerUrl}
          title="Movie Trailer"
          className="w-full h-full rounded-lg"
          allowFullScreen
        ></iframe>
      </div>
      <div className="text-center">
        <button
          onClick={() => navigate("/watch")}
          className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-semibold transition"
        >
          Watch Full Movie
        </button>
      </div>
    </div>
  );
}

export default TrailerPlayer;