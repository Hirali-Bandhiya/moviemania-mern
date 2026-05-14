import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import localData from "../data/movies";
import api from "../services/api";
import MovieCard from "../components/MovieCard";
import { Star, ArrowLeft, Play } from "lucide-react";
import { getImageUrl } from "../utils/imageHelper";
import { updateContinueWatching } from "../utils/continueWatching";
import { resolvePlaybackUrl, resolveTrailerUrl } from "../utils/mediaResolver";
import { isLoggedIn, hasActivePlan } from "../utils/auth";
import {
  addToWishlistStore,
  removeFromWishlistStore,
  isInWishlistStore,
} from "../features/wishlist/utils/wishlistHelper";

function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageError, setImageError] = useState(false);
  const [movie, setMovie] = useState(() =>
    localData.find((m) => String(m._id) === String(id) || String(m.id) === String(id)) || null
  );
  const [loading, setLoading] = useState(true);
  const [inUserWishlist, setInUserWishlist] = useState(false);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [userHasActivePlan, setUserHasActivePlan] = useState(false);

  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      if (!id) {
        if (active) setLoading(false);
        return;
      }

      const localMovie = localData.find(
        (m) => String(m._id) === String(id) || String(m.id) === String(id)
      );
      if (active && localMovie) {
        setMovie(localMovie);
      }

      try {
        const { data } = await api.get(`/movies/${id}`);
        if (active && data) {
          setMovie(data);
          setLoading(false);
          return;
        }
      } catch {
        // try series fallback
      }

      try {
        const { data } = await api.get(`/series/${id}`);
        if (active && data) {
          setMovie(data);
        }
      } catch {
        // local fallback already handled
      } finally {
        if (active) setLoading(false);
      }
    };

    loadContent();

    return () => {
      active = false;
    };
  }, [id]);

  const normalizeText = (value) => String(value || "").trim().toLowerCase();
  const localFallbackMovie = localData.find((item) => {
    const sameId = String(item._id || item.id) === String(movie?._id || movie?.id || id);
    const sameTitle = normalizeText(item.title) === normalizeText(movie?.title);
    return sameId || sameTitle;
  });

  const detailMovie = { ...(localFallbackMovie || {}), ...(movie || {}) };
  const movieId = detailMovie?._id || detailMovie?.id || id;

  const defaultImage = "https://via.placeholder.com/300x400?text=No+Image";
  const imageUrl = imageError
    ? defaultImage
    : getImageUrl(detailMovie?.image || detailMovie?.posterUrl);

  const primaryVideoUrl = resolvePlaybackUrl(detailMovie, localFallbackMovie);

  const buildRelatedList = (sourceList) => {
    const strictMatches = sourceList
      .filter((item) => {
        const sameGenre = String(item.genre || "").toLowerCase() === String(detailMovie.genre || "").toLowerCase();
        const isSameItem = String(item._id || item.id) !== String(movieId);
        return sameGenre && isSameItem;
      })
      .slice(0, 6);

    if (strictMatches.length > 0) return strictMatches;
    return sourceList.filter((item) => String(item._id || item.id) !== String(movieId)).slice(0, 6);
  };

  useEffect(() => {
    setInUserWishlist(isInWishlistStore(movieId));
  }, [movieId]);

  // ✅ Check if user is logged in and has active plan
  useEffect(() => {
    setIsUserLoggedIn(isLoggedIn());
    setUserHasActivePlan(hasActivePlan());
  }, []);

  useEffect(() => {
    let active = true;

    const loadRelated = async () => {
      const fallbackRelated = buildRelatedList(localData);

      try {
        const results = await Promise.allSettled([api.get("/movies"), api.get("/series")]);

        const moviesApi =
          results[0].status === "fulfilled" && Array.isArray(results[0].value.data)
            ? results[0].value.data
            : [];
        const seriesApi =
          results[1].status === "fulfilled" && Array.isArray(results[1].value.data)
            ? results[1].value.data
            : [];

        const backendRelated = buildRelatedList([...moviesApi, ...seriesApi]);
        if (active) {
          setRelatedMovies(backendRelated.length ? backendRelated : fallbackRelated);
        }
      } catch {
        if (active) setRelatedMovies(fallbackRelated);
      }
    };

    if (movie) loadRelated();

    return () => {
      active = false;
    };
  }, [movie, movieId]);

  const openTrailer = () => {
    const trailerTarget = resolveTrailerUrl(detailMovie);
    const popup = window.open(trailerTarget, "_blank", "noopener,noreferrer");
    if (!popup) {
      window.location.href = trailerTarget;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-black text-white p-20 text-center font-bold text-xl">
        Movie/Series Not Found...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center text-white" style={{ backgroundImage: `url(${imageUrl})` }}>
      <div className="bg-black/80 min-h-screen">
        <div className="max-w-[1200px] mx-auto px-8 py-20">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 mb-10 text-gray-300 hover:text-white"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <img
              src={imageUrl}
              onError={() => setImageError(true)}
              alt={detailMovie.title}
              className="rounded-2xl shadow-2xl w-full max-w-md"
            />

            <div>
              <h1 className="text-5xl font-bold mb-4">{detailMovie.title}</h1>

              <div className="flex items-center gap-4 text-gray-300 mb-4">
                <span>{detailMovie.year || "Unknown"}</span>
                <span>•</span>
                <span>{detailMovie.genre || "Unknown"}</span>
              </div>

              <div className="flex items-center gap-2 mb-6 text-yellow-400 font-bold">
                <Star size={20} />
                <span>{detailMovie.rating || "N/A"}/10 IMDb</span>
              </div>

              <p className="text-gray-200 mb-8">
                {detailMovie.description || "No description available for this movie."}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                <div>
                  <span className="text-gray-400 block mb-1 text-sm">Director</span>
                  <span className="text-white">{detailMovie.director || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-gray-400 block mb-1 text-sm">Cast</span>
                  <span className="text-white">
                    {Array.isArray(detailMovie.cast)
                      ? detailMovie.cast.join(", ")
                      : detailMovie.cast || "Unknown"}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                {/* For Guest Users - Show only trailers */}
                {!isUserLoggedIn ? (
                  <>
                    <button 
                      onClick={openTrailer} 
                      className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl flex gap-2 transition font-semibold"
                    >
                      <Play size={20} />
                      Watch Trailer
                    </button>
                    <button
                      onClick={() => navigate("/register", { state: { movieId: movieId, redirectAfterPayment: true } })}
                      className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 rounded-xl transition font-semibold"
                    >
                      Sign Up to Watch Full Movie
                    </button>
                  </>
                ) : !userHasActivePlan ? (
                  /* For Logged In Users Without Plan - allow watching full movie directly */
                  <>
                    <button
                      onClick={openTrailer}
                      className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl flex gap-2 transition font-semibold"
                    >
                      <Play size={20} />
                      Watch Trailer
                    </button>
                    <button
                      onClick={() => {
                        const idToUse = movieId;
                        if (!idToUse) return;

                        if (primaryVideoUrl) {
                          updateContinueWatching(idToUse, 0);
                          navigate(`/watch/${idToUse}`);
                        } else {
                          openTrailer();
                        }
                      }}
                      className="bg-yellow-600 hover:bg-yellow-700 px-8 py-3 rounded-xl transition font-semibold"
                    >
                      Watch Full Movie
                    </button>
                  </>
                ) : (
                  /* For Logged In Users With Active Plan */
                  <>
                    <button
                      onClick={() => {
                        const idToUse = movieId;
                        if (!idToUse) return;

                        if (primaryVideoUrl) {
                          updateContinueWatching(idToUse, 0);
                          navigate(`/watch/${idToUse}`);
                        } else {
                          openTrailer();
                        }
                      }}
                      className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl transition font-semibold"
                    >
                      Watch {primaryVideoUrl ? "Now" : "Trailer"}
                    </button>

                    <button 
                      onClick={openTrailer} 
                      className="bg-gray-700 hover:bg-gray-600 px-8 py-3 rounded-xl flex gap-2 transition"
                    >
                      <Play size={20} />
                      {primaryVideoUrl ? "Watch Trailer" : "See Trailer"}
                    </button>
                  </>
                )}

                <button
                  onClick={() => {
                    if (inUserWishlist) {
                      removeFromWishlistStore(movieId);
                      setInUserWishlist(false);
                    } else {
                      addToWishlistStore(detailMovie);
                      setInUserWishlist(true);
                    }
                  }}
                  className="bg-gray-700 px-8 py-3 rounded-xl"
                >
                  {inUserWishlist ? "In Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>

          {relatedMovies.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Related Movies</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
                {relatedMovies.map((item) => (
                  <MovieCard key={item._id || item.id} movie={item} requirePlanForAccess />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
