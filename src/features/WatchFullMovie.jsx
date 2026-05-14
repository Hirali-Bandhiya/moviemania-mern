import { useParams } from "react-router-dom";
import { Navigate } from "react-router-dom";
import movies from "../data/movies";

function WatchFullMovie() {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === parseInt(id, 10));

  const subscriptionPlan = localStorage.getItem("subscriptionPlan");

  if (!subscriptionPlan) {
    return <Navigate to="/plans" replace />;
  }

  if (!movie) {
    return (
      <div className="text-white p-20">
        Movie not found
      </div>
    );
  }

  if (!movie.videoUrl) {
    return (
      <div className="text-white p-20">
        Video URL is not available for this title.
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">{movie.title} (Full Movie)</h1>
      <div className="w-full max-w-4xl">
        <video
          controls
          autoPlay
          className="w-full rounded-lg shadow-lg"
        >
          <source src={movie.videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    </div>
  );
}

export default WatchFullMovie;
