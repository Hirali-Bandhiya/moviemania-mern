import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import movies from "../data/movies";
import api from "../services/api";
import MovieCard from "../components/MovieCard";
import { getImageUrl } from "../utils/imageHelper";
import { resolvePlaybackUrl, resolveTrailerUrl } from "../utils/mediaResolver";
import { isLoggedIn, hasActivePlan } from "../utils/auth";
import { requiresSubscriptionForContent } from "../utils/accessControl";
import {
  addToWishlistStore,
  removeFromWishlistStore,
  isInWishlistStore,
} from "../features/wishlist/utils/wishlistHelper";

function WatchMovie() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [movie, setMovie] = useState(() =>
    movies.find((m) => String(m._id) === String(id) || String(m.id) === String(id)) || null
  );
  const [loading, setLoading] = useState(true);
  const [inUserWishlist, setInUserWishlist] = useState(false);
  const [relatedMovies, setRelatedMovies] = useState([]);
  const [playbackSource, setPlaybackSource] = useState("");
  const [playbackFailed, setPlaybackFailed] = useState(false);

  // ✅ Check if user has access to watch full movie
  useEffect(() => {
    if (!loading && !isLoggedIn()) {
      // Redirect guest users back to movie details
      navigate(`/movie/${id}`, { replace: true });
      return;
    }
  }, [loading, id, navigate]);

  const getYoutubeEmbedUrl = (url) => {
    if (!url) return null;

    const value = String(url).trim();
    const regExp = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
    const match = value.match(regExp);
    return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&rel=0` : null;
  };

  const isYoutubeUrl = (url) => /(?:youtube\.com|youtu\.be)/i.test(String(url || ""));


  useEffect(() => {
    let active = true;

    const loadContent = async () => {
      if (!id) {
        if (active) setLoading(false);
        return;
      }

      const localMovie = movies.find(
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
        // fallback to series endpoint below
      }

      try {
        const { data } = await api.get(`/series/${id}`);
        if (active && data) {
          setMovie(data);
        }
      } catch {
        // local fallback already set above
      } finally {
        if (active) setLoading(false);
      }
    };

    loadContent();

    return () => {
      active = false;
    };
  }, [id]);

  const formatRuntime = (value) => {
    const parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed <= 0) return "Unknown";

    const totalMinutes = parsed > 400 ? Math.round(parsed / 60) : Math.round(parsed);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours <= 0) return `${totalMinutes}m`;
    if (!minutes) return `${hours}h`;
    return `${hours}h ${minutes}m`;
  };

  const normalizeText = (value) => String(value || "").trim().toLowerCase();
  const localFallbackMovie = movies.find((item) => {
    const sameId = String(item._id || item.id) === String(movie?._id || movie?.id || id);
    const sameTitle = normalizeText(item.title) === normalizeText(movie?.title);
    return sameId || sameTitle;
  });
  const detailMovie = { ...(localFallbackMovie || {}), ...(movie || {}) };
  const movieId = detailMovie._id || detailMovie.id;
  const requiresPlan = requiresSubscriptionForContent(detailMovie);
  const playbackUrl = resolvePlaybackUrl(detailMovie, localFallbackMovie);
  // Don't use YouTube trailer as video fallback (won't work in video player)
  const fallbackPlaybackUrl = "";
  const runtime = formatRuntime(detailMovie.duration);
  const language = detailMovie.language || detailMovie.lang || "English";
  const castText = Array.isArray(detailMovie.cast)
    ? detailMovie.cast.join(", ")
    : (detailMovie.cast || "Unknown");

  const buildRelatedList = (sourceList) => {
    const strictMatches = sourceList
      .filter((item) => {
        const sameGenre = String(item.genre || "").toLowerCase() === String(detailMovie.genre || "").toLowerCase();
        const isSameItem = String(item._id || item.id) !== String(movieId);
        return sameGenre && isSameItem;
      })
      .slice(0, 6);

    if (strictMatches.length) return strictMatches;
    return sourceList.filter((item) => String(item._id || item.id) !== String(movieId)).slice(0, 6);
  };

  const openTrailer = () => {
    const trailerTarget = resolveTrailerUrl(detailMovie);
    const popup = window.open(trailerTarget, "_blank", "noopener,noreferrer");
    if (!popup) {
      window.location.href = trailerTarget;
    }
  };

  useEffect(() => {
    if (!movieId) return;
    setInUserWishlist(isInWishlistStore(movieId));
  }, [movieId]);

  useEffect(() => {
    if (!loading && requiresPlan && !hasActivePlan()) {
      navigate("/plans", {
        replace: true,
        state: {
          movieId,
          paymentOrigin: isLoggedIn() ? "subscription" : "guest",
        },
      });
    }
  }, [loading, requiresPlan, movieId, navigate]);

  useEffect(() => {
    const primary = String(playbackUrl || "").trim();
    setPlaybackSource(primary);
    setPlaybackFailed(false);
    setIsVideoLoading(true);
  }, [playbackUrl, fallbackPlaybackUrl]);

  useEffect(() => {
    let active = true;

    const loadRelated = async () => {
      const fallbackRelated = buildRelatedList(movies);

      try {
        const results = await Promise.allSettled([
          api.get("/movies"),
          api.get("/series"),
        ]);

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
        if (active) {
          setRelatedMovies(fallbackRelated);
        }
      }
    };

    if (detailMovie) {
      loadRelated();
    }

    return () => {
      active = false;
    };
  }, [movieId, detailMovie.genre]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!id) {
    return <div className="min-h-screen bg-black text-white p-20 text-center">Invalid movie ID.</div>;
  }

  if (!movie) {
    return <div className="min-h-screen bg-black text-white p-20 text-center">Movie/Series not found</div>;
  }

  if (!playbackSource) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-20">
        <div className="text-center max-w-md">
          <h2 className="text-3xl font-bold mb-4">Video Not Available</h2>
          <p className="text-gray-300 mb-6">Full movie is not available for this title right now. Watch the trailer or check back later.</p>
          <button
            onClick={openTrailer}
            className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-xl font-semibold transition"
          >
            Watch Trailer
          </button>
        </div>
      </div>
    );
  }

  const youtubeEmbedUrl = getYoutubeEmbedUrl(playbackSource);

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center pt-24 pb-12 px-4 md:px-12">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl md:text-5xl font-bold mb-6 text-red-600">{detailMovie.title}</h1>

        {/* Video Player Section */}
        <div className="relative w-full rounded-lg overflow-hidden bg-gray-900 shadow-2xl mb-8 aspect-video flex items-center justify-center">
          {isVideoLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-80 z-10">
               <div className="flex flex-col items-center gap-3">
                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
                 <span className="text-sm font-medium animate-pulse text-red-500">Buffering...</span>
               </div>
            </div>
          )}
          {youtubeEmbedUrl ? (
            <iframe
              src={youtubeEmbedUrl}
              title={detailMovie.title}
              className="w-full h-full"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              onLoad={() => setIsVideoLoading(false)}
            />
          ) : (
            <video
              controls
              autoPlay
              className="w-full h-full object-cover"
              onCanPlay={() => setIsVideoLoading(false)}
              onWaiting={() => setIsVideoLoading(true)}
              onPlaying={() => setIsVideoLoading(false)}
              onStalled={() => setIsVideoLoading(true)}
              onError={() => {
                setIsVideoLoading(false);
                setPlaybackFailed(true);
              }}
            >
              <source src={playbackSource} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}

          {playbackFailed && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/85 z-20">
              <div className="text-center px-6">
                <p className="text-white font-semibold mb-4">Full movie stream unavailable.</p>
                <button
                  onClick={openTrailer}
                  className="bg-gray-700 px-6 py-2 rounded-xl"
                >
                  Watch Trailer Instead
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Movie Details Section */}
        <div className="bg-zinc-900 p-6 md:p-8 rounded-xl shadow-xl w-full border border-gray-800">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img 
                src={detailMovie.image ? getImageUrl(detailMovie.image) : "https://via.placeholder.com/300x450?text=No+Image"} 
                alt={detailMovie.title} 
                className="w-full rounded-lg shadow-lg object-cover aspect-[2/3]"
                onError={(e) => { e.target.src = "https://via.placeholder.com/300x450?text=Image+Not+Found"; }}
                loading="lazy"
              />
            </div>
            <div className="w-full md:w-2/3 flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <span className="bg-red-600 text-white px-3 py-1 rounded text-sm font-semibold shadow-md">{detailMovie.genre || "Action"}</span>
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm shadow-inner">{detailMovie.year || "Unknown Year"}</span>
                <span className="flex items-center text-yellow-400 font-bold bg-gray-800 px-3 py-1 rounded shadow-inner">⭐ {detailMovie.rating || "N/A"} / 10</span>
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm shadow-inner">{runtime}</span>
                <span className="bg-gray-800 text-gray-300 px-3 py-1 rounded text-sm shadow-inner">{language}</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 text-white border-b border-gray-700 pb-2 inline-block">Overview</h2>
              <p className="text-gray-300 mb-6 leading-relaxed text-lg">
                {detailMovie.description || "No description available for this movie. Check back later for more details."}
              </p>

              <div className="flex gap-4 mb-6">
                <button onClick={openTrailer} className="bg-gray-700 px-8 py-3 rounded-xl">
                  Watch Trailer
                </button>
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
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm bg-gray-950 p-4 rounded-lg">
                <div>
                  <span className="text-gray-500 block mb-1 uppercase tracking-wider text-xs font-bold">Director</span>
                  <span className="text-white font-medium text-base">{detailMovie.director || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-gray-500 block mb-1 uppercase tracking-wider text-xs font-bold">Cast</span>
                  <span className="text-white font-medium text-base">{castText}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {relatedMovies.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8">Related Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
              {relatedMovies.map((item) => (
                <MovieCard key={item._id || item.id} movie={item} requirePlanForAccess={item.requirePlanForAccess} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default WatchMovie;